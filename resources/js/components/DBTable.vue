<script setup lang="ts">

    import { ref} from 'vue'
    import {
        Collapsible,
        CollapsibleContent,
        CollapsibleTrigger,
    } from '@/components/ui/collapsible'
    import {
        HoverCard,
        HoverCardContent,
        HoverCardTrigger,
    } from '@/components/ui/hover-card'
    import { Minimize2, KeyRound, ScrollText } from 'lucide-vue-next'
    
    const props = defineProps<{
        head: string,
        fields: Array<{ id: string | number; name: string; type: { type_name: string }; pk: boolean | undefined; note: string | null }>,
        position: { x: number; y: number }
    }>()

    const emit = defineEmits(['update:position']);

    const el = ref<HTMLElement | null>(null);
    let offset = { x: 0, y: 0 };
    let isDragging = false;

    function onMouseDown(e: MouseEvent) {
        isDragging = true;
        offset = {
            x: e.clientX - props.position.x,
            y: e.clientY - props.position.y,
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(e: MouseEvent) {
        if (!isDragging) return;
        emit('update:position', {
            x: e.clientX - offset.x,
            y: e.clientY - offset.y,
        });
    }

    function onMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    }

    const isOpen = ref(true)
</script>

<template>
    <div class="absolute" :style="{ left: position.x + 'px', top: position.y + 'px' }"
    ref="el"> 
        <div class="flex flex-col text-white rounded-md p-2 min-w-[250px]">
            <Collapsible :open="isOpen">
                    <div class="flex justify-between bg-zinc-900 py-1 px-2 text-sm w-full cursor-move" @mousedown="onMouseDown">
                        <div>{{ head }}</div>
                        <CollapsibleTrigger @click="isOpen = !isOpen">
                            <Minimize2 class="h-4 w-4 cursor-pointer" />
                        </CollapsibleTrigger>
                    </div>
                <CollapsibleContent>
                    <div class="bg-zinc-700 py-1 px-2 flex flex-col gap-2 text-sm">
                        <div class="flex justify-between gap-2" v-for="(field) in fields" :key="field.id">
                            <div class="flex items-center gap-1">
                                <span>{{ field.name }}</span>
                                <KeyRound v-if="field.pk" class="h-4 w-4" />
                                <HoverCard v-if="field.note" :open-delay="0">
                                    <HoverCardTrigger>
                                        <ScrollText class="h-4 w-4" />
                                    </HoverCardTrigger>
                                    <HoverCardContent class="bg-zinc-900 p-2 rounded">
                                        <div class="text-xs text-gray-300">
                                            {{ field.note }}
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                            </div>
                            <span>{{ field.type.type_name }}</span>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    </div>
</template>

