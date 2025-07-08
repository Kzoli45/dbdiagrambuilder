<script setup lang="ts">
    
    defineProps<{
        head: string,
        fields: Array<{ id: string | number; name: string; type: { type_name: string } }>
    }>()

</script>

<template>
    <div class="flex flex-col text-white rounded-md p-2 min-w-[250px]">
        <div class="bg-zinc-900 py-1 px-2 text-sm">{{ head }}</div>
        <div class="bg-zinc-700 py-1 px-2 flex flex-col gap-2 text-sm">
            <div class="flex justify-between gap-2" v-for="(field) in fields" :key="field.id">
                <span>{{ field.name }}</span>
                <span>{{ field.type.type_name }}</span>
            </div>
        </div>
    </div>
</template>

