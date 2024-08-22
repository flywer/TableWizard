<template>
	<div
		id="editor-container"
		ref="editorContainer"
		:style="{ width: width, height: height }"/>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, PropType, ref, watch} from 'vue';
import * as monaco from 'monaco-editor';
import {registerPgSql} from "@render/components/MonacoEditor/languages/commonsql";

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
		default: 'javascript'
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
});

const emit = defineEmits(['update:code', 'editorReady']);

const editorContainer = ref<HTMLElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

onMounted(() => {
	if (editorContainer.value) {

		registerPgSql()

		editor = monaco.editor.create(editorContainer.value, {
			value: props.code,
			language: 'commonsql',
			theme: 'commonsql',
			automaticLayout: props.automaticLayout,
			lineNumbers: props.lineNumbers,
			wordWrap: props.wordWrap,
			fontFamily: 'v-mono',
			fontSize: 14,
			contextmenu: false,
			// ... other options
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
</script>
<style scoped>

</style>
