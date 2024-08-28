<template>
	<div
		ref="editorContainer"
		:style="{ width: width, height: height }"/>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, PropType, ref, watch} from 'vue';
import * as monaco from "monaco-editor";
import {registerPgSql} from "@render/components/MonacoEditor/languages/commonsql";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

const props = defineProps({
	// 编辑器宽度
	width: {
		type: String,
		default: '99%'
	},
	// 编辑器高度
	height: {
		type: String,
		default: '400px'
	},
	// 编辑器实际内容
	code: {
		type: String,
		default: ''
	},
	// 语言
	language: {
		type: String,
		default: 'commonsql'
	},
	// 主题: 'vs' | 'vs-dark' | 'hc-black'
	theme: {
		type: String,
		default: 'vs'
	},
	// 是否自动布局
	automaticLayout: {
		type: Boolean,
		default: true
	},
	// 是否显示行号
	lineNumbers: {
		type: String as PropType<'on' | 'off' | 'relative' | 'interval'>,
		default: 'on'
	},
	wordWrap: {
		type: String as PropType<'off' | 'on' | 'wordWrapColumn' | 'bounded'>,
		default: 'off'
	},
	fontSize: {
		type: Number,
		default: 14
	},
});

const emit = defineEmits(['update:code', 'editorReady']);

const editorContainer = ref<HTMLElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

onMounted(() => {
	if (editorContainer.value) {

		const cssArr = ["css", "scss", "less"];
		const jsonArr = ["json"];
		const htmlArr = ["html", "handlebars", "razor"];
		const tsArr = ["typescript", "javascript"];

		// 解决 Unexpected usage at EditorSimpleWorker.loadForeignModule 报错问题
		self.MonacoEnvironment = {
			getWorker(_: any, label: any) {
				if (jsonArr.includes(label)) {
					return new jsonWorker();
				}
				if (cssArr.includes(label)) {
					return new cssWorker();
				}
				if (htmlArr.includes(label)) {
					return new htmlWorker();
				}
				if (tsArr.includes(label)) {
					return new tsWorker();
				}
				return new editorWorker();
			},
		};

		monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

		// 获取所有已注册的语言ID的数组
		const languages = monaco.languages.getLanguages();
		if (!languages.map(lang => lang.id).includes('commonsql')) {
			registerPgSql()
		}

		editor = monaco.editor.create(editorContainer.value, {
			value: props.code,
			language: props.language,
			theme: props.language === 'commonsql' ? props.language : 'vs',
			automaticLayout: props.automaticLayout,
			lineNumbers: props.lineNumbers,
			wordWrap: props.wordWrap,
			fontFamily: 'v-mono',
			fontSize: props.fontSize,
			contextmenu: false,
			minimap: {
				enabled: false
			}
		});

		editor.onDidChangeModelContent(() => {
			emit('update:code', editor!.getValue());
		});

		emit('editorReady', editor);

	}
});

watch(
	() => props.code,
	(newCode) => {
		if (editor && newCode !== editor.getValue()) {
			editor.setValue(newCode);
		}
	}
);

onUnmounted(() => {
	if (editor) {
		editor.dispose();
	}
});

onUnmounted(() => {
	editor?.dispose();
});

</script>
<style scoped>

</style>
