<template>
  <div class="w-full">
    <div v-if="block.type === 'text'" class="group/block flex items-start gap-3 p-2 w-full bg-transparent">
      <textarea
        :value="block.content"
        @input="debouncedOnChange($event.target.value)"
        placeholder="Ketik sesuatu..."
        class="flex-1 w-full min-h-[44px] text-lg p-0 bg-transparent border-none resize-none focus:outline-none focus:ring-0 placeholder-slate-300 text-slate-800 leading-relaxed font-medium"
      />
      <button
        @click="$emit('delete')"
        class="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover/block:opacity-100"
      >
        <TrashIcon class="w-5 h-5" />
      </button>
    </div>

    <div v-else-if="block.type === 'checklist'" class="group/block flex items-center gap-3 p-2 w-full bg-transparent">
      <input
        type="checkbox"
        :checked="isChecked"
        @change="handleCheckChange"
        class="w-5 h-5 mt-0.5 accent-black border-slate-300 rounded focus:ring-black cursor-pointer"
      />
      <input
        type="text"
        :value="rawContent"
        @input="handleChecklistTextChange"
        class="flex-1 text-lg border-none outline-none focus:ring-0 bg-transparent text-slate-800 placeholder-slate-300 font-medium"
        :class="{ 'line-through text-slate-400': isChecked }"
        placeholder="Item checklist..."
      />
      <button
        @click="$emit('delete')"
        class="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover/block:opacity-100"
      >
        <TrashIcon class="w-5 h-5" />
      </button>
    </div>

    <div v-else-if="block.type === 'image'" class="group/block flex items-center gap-6 p-2 w-full bg-transparent">
      <img :src="imageUrl" alt="Image block" class="max-w-[12rem] md:max-w-xs h-auto rounded-xl shadow-md object-cover border border-slate-100" />
      <div class="flex flex-col gap-3">
        <button @click="triggerFileInput" class="px-4 py-2 text-sm font-semibold bg-white border border-slate-200 shadow-sm rounded-lg hover:bg-slate-50 transition-all text-slate-700">
          Ubah Gambar
        </button>
        <input
          type="file"
          accept="image/*"
          ref="fileInput"
          @change="handleFileChange"
          class="hidden"
        />
      </div>
      <button @click="$emit('delete')" class="p-2 ml-auto text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover/block:opacity-100 self-start">
        <TrashIcon class="w-5 h-5" />
      </button>
    </div>

    <div v-else-if="block.type === 'code'" class="group/block flex items-start gap-4 p-2 w-full bg-transparent">
      <textarea
        :value="block.content"
        @input="debouncedOnChange($event.target.value)"
        class="flex-1 w-full min-h-[80px] p-4 bg-slate-900 text-slate-100 border border-slate-800 rounded-xl resize-y font-mono text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent placeholder-slate-500 shadow-inner"
        placeholder="Tulis kodemu di sini..."
      />
      <button
        @click="$emit('delete')"
        class="p-2 mt-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover/block:opacity-100"
      >
        <TrashIcon class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { TrashIcon } from '@heroicons/vue/24/outline';
import { ref, computed } from 'vue';
import debounce from 'lodash/debounce';

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['change', 'delete']);

const fileInput = ref(null);

const isChecked = computed(() => String(props.block.content).startsWith('[x]'));
const rawContent = computed(() => String(props.block.content).replace(/^\[.\]\s?/, ''));

const imageUrl = computed(() => {
  if (!props.block.content || props.block.content === 'New image block') {
    return 'https://via.placeholder.com/150';
  }
  return `http://localhost:3001${props.block.content}`;
});

const debouncedOnChange = debounce((value) => {
  emit('change', value);
}, 500);

const handleCheckChange = (event) => {
  const newContent = `${event.target.checked ? '[x]' : '[ ]'} ${rawContent.value}`;
  emit('change', newContent);
};

const handleChecklistTextChange = (event) => {
  const newContent = `${isChecked.value ? '[x]' : '[ ]'} ${event.target.value}`;
  debouncedOnChange(newContent);
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    emit('change', '', file);
  }
};
</script>
