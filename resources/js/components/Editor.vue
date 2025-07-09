<script setup lang="ts">
    import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
    import * as monaco from 'monaco-editor'
    import { registerDbmlLanguage } from '@/composables/useDBML'

    const props = defineProps<{
        value: string
    }>()

    const emit = defineEmits<{
        (e: 'update:value', value: string): void
    }>()

    const editorContainer = ref<HTMLDivElement | null>(null)
    let editor: monaco.editor.IStandaloneCodeEditor

    onMounted(() => {
        if (!editorContainer.value) return

        registerDbmlLanguage(monaco)

        editor = monaco.editor.create(editorContainer.value, {
            value: props.value,
            language: 'dbml',
            theme: 'dbmlTheme',
            automaticLayout: true,
            fontSize: 14,
            minimap: { enabled: false },
            wordWrap: 'on',
        })

        editor.onDidChangeModelContent(() => {
            emit('update:value', editor.getValue())
            })
        })

        watch(
            () => props.value,
            (newVal) => {
                if (editor && editor.getValue() !== newVal) {
                editor.setValue(newVal)
                }
            }
        )

        onBeforeUnmount(() => {
            editor?.dispose()
    })
</script>

<template>
  <div ref="editorContainer" class="h-full"></div>
</template>
