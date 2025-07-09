<script setup lang="ts">
    import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
    import DBTable from './DBTable.vue';
    import Editor from '@/components/Editor.vue';
    import { Parser } from '@dbml/core';
    import { ref, watch } from 'vue';
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

    const debouncedParse = debounce((content: string) => {
        try {
            const parsed = parser.parse(content, 'dbml');
            currentDB.value.tables = parsed.schemas[0].tables.map((table: any, i: number) => ({
              ...table,
              position: { x: 100 + i * 50, y: 100 + i * 50 },
            }));
            console.log('Parsed DBML:', currentDB.value.tables);

        } catch (error) {
            console.error('Error parsing DBML:', error);
        }
    }, 500);

    watch(editorContent, (newValue) => {
        debouncedParse(newValue);
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
