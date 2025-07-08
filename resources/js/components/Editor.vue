<script setup lang="ts">
    import MonacoEditor from 'monaco-editor-vue3';

    defineProps({
        value: {
            type: String,
            required: true
        }
    });

    const options = {
        colorDecorators: true,
        lineHeight: 24,
        tabSize: 2,
        fontSize: 14,
        minimap: {
            enabled:false
        },
        automaticLayout: true,
        wordWrap: 'on',
        wrappingIndent: 'indent',
        scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 8,
            alwaysConsumeMouseWheel: false
        },
    }
</script>

<template>
  <MonacoEditor
    theme="vs-dark"
    :options="options"
    language="dbml"
    :value="value"
    @update:value="$emit('update:value', $event)"
  ></MonacoEditor>
</template>
