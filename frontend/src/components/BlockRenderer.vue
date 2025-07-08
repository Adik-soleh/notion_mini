<template>
  <div class="w-full">
    <div v-if="block.type === 'text'" class="flex items-start gap-3 p-4 border border-gray-200 rounded-lg w-full bg-white">
      <textarea
        :value="block.content"
        @input="debouncedOnChange($event.target.value)"
        placeholder="Ketik sesuatu..."
        class="flex-1 w-full min-h-20 p-2 border border-gray-300 rounded resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        @click="$emit('delete')"
        class="p-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition"
      >
        <TrashIcon class="w-5 h-5" />
      </button>
    </div>

    <div v-else-if="block.type === 'checklist'" class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg w-full bg-white">
      <input
        type="checkbox"
        :checked="isChecked"
        @change="handleCheckChange"
        class="w-5 h-5 accent-blue-500"
      />
      <input
        type="text"
        :value="rawContent"
        @input="handleChecklistTextChange"
        class="flex-1 border-0 border-b border-gray-300 outline-none focus:border-blue-500 bg-transparent"
      />
      <button
        @click="$emit('delete')"
        class="p-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition"
      >
        <TrashIcon class="w-5 h-5" />
      </button>
    </div>

    <div v-else-if="block.type === 'image'" class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg w-full bg-white">
      <img :src="imageUrl" alt="Image block" class="w-36 h-36 rounded object-cover" />
      <div class="flex flex-col gap-2">
        <button @click="triggerFileInput" class="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 transition">
          Ubah Gambar
        </button>
        <input
          type="file"
          accept="image/*"
          ref="fileInput"
          @change="handleFileChange"
          class="hidden"
        />
        <button @click="$emit('delete')" class="p-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition">
          <TrashIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div v-else-if="block.type === 'code'" class="flex items-start gap-3 p-4 border border-gray-200 rounded-lg w-full bg-white">
      <textarea
        :value="block.content"
        @input="debouncedOnChange($event.target.value)"
        class="flex-1 w-full min-h-20 p-2 border border-gray-300 rounded resize-y font-mono bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Tulis kodemu di sini..."
      />
      <button
        @click="$emit('delete')"
        class="p-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition"
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
