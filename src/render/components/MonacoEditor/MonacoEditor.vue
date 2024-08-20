<template>
  <div ref="editorContainer" :style="{ width: width, height: height }"></div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, PropType, ref, watch} from 'vue';
import * as monaco from 'monaco-editor';
import {LanguageIdEnum} from 'monaco-sql-languages';
import {registerPgSql} from "@render/components/MonacoEditor/languages/postgresql";

const props = defineProps({
  // 编辑器宽度
  width: {
    type: String,
    default: '100%'
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
});

const emit = defineEmits(['update:code', 'editorReady']);

const editorContainer = ref<HTMLElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

onMounted(() => {
  if (editorContainer.value) {

    registerPgSql()

    editor = monaco.editor.create(editorContainer.value, {
      value: props.code,
      language: props.language,
      theme: props.theme,
      automaticLayout: props.automaticLayout,
      lineNumbers: props.lineNumbers,
      wordWrap: 'on',
      fontFamily: 'Consolas, "Courier New", monospace;',
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
