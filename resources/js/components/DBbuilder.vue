<script setup lang="ts">
    import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
    import DBTable from './DBTable.vue';
    import Editor from '@/components/Editor.vue';
    import { Parser } from '@dbml/core';
    import { ref, watch, onMounted } from 'vue';
    import { debounce } from 'lodash-es';

    const parser = new Parser();

    type Table = {
        id: string | number;
        name: string;
        fields: Array<{
            id: string | number;
            name: string;
            type: {
                type_name: string;

            };
            pk?: boolean | undefined;
            note?: string | null;
        }>;
        position?: {
            x: number;
            y: number;
        };
    };
    
    const currentDB = ref<{
        tables: Table[];
    }>({
        tables: [],
    });

    const editorContent = ref('// DBML docs:\n// https://dbml.dbdiagram.io/docs/');

    onMounted(() => {
        const savedContent = localStorage.getItem('dbml');
        if (savedContent) {
            editorContent.value = savedContent;
        }
    });

    const debouncedParse = debounce((content: string) => {
        try {
            const parsed = parser.parse(content, 'dbml');

            if (currentDB.value.tables.length === 0) {
              currentDB.value.tables = parsed.schemas[0].tables.map((table: any, i: number) => ({
              ...table,
              position: { x: 100, y: 100 + i * 100 },
              }));
            }
            else {
              currentDB.value.tables = parsed.schemas[0].tables.map((table: any) => ({
                ...table,
                position: currentDB.value.tables.find(t => t.id === table.id)?.position || { x: 0, y: 0 },
              }));
            }
            console.log('Parsed DBML:', parsed);

        } catch (error) {
            console.error('Error parsing DBML:', error);
        }
    }, 500);

    watch(editorContent, (newValue) => {
        debouncedParse(newValue);
        localStorage.setItem('dbml', newValue);
    });
</script>

<template>
  <div class="flex h-screen">
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel :minSize="15" :maxSize="55" :default-size="30">
        <Editor v-model:value="editorContent" />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel class="bg-zinc-800 relative overflow-hidden">
        <DBTable
          v-for="(table) in currentDB.tables"
          :key="table.id"
          :head="table.name"
          :fields="table.fields"
          :position="table.position || { x: 0, y: 0 }"
          @update:position="pos => table.position = pos"
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
</template>
