<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <div class="max-w-4xl mx-auto p-6">
      <header class="flex items-center gap-4 mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
        <button
          @click="goBack"
          class="text-slate-500 hover:text-slate-700 p-3 rounded-xl transition-all duration-200 hover:bg-slate-100 hover:scale-105"
        >
          <ArrowLeftIcon class="w-6 h-6" />
        </button>

        <input
          v-model="title"
          class="flex-1 text-2xl md:text-3xl font-bold bg-transparent border-none outline-none placeholder-slate-400 text-slate-800 focus:placeholder-slate-300 transition-all duration-200"
          placeholder="Judul Catatan"
        />

        <button
          @click="handleSave"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-purple-700"
        >
          <CheckIcon class="w-5 h-5" />
          Simpan
        </button>
      </header>

      <div class="space-y-4">
        <div
          v-for="(block, index) in blocks"
          :key="block.id"
          draggable="true"
          @dragstart="dragStart(index)"
          @dragover.prevent
          @dragenter.prevent
          @drop="drop(index)"
          class="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-move"
          :class="{ 'opacity-50 scale-95': draggedIndex === index }"
        >
          <div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Bars3Icon class="w-5 h-5" />
          </div>
          
          <div class="pl-14 pr-6 py-6">
            <BlockRenderer
              :block="block"
              @change="(content, file) => handleUpdateBlock(block.id, content, file)"
              @delete="handleDeleteBlock(block.id)"
            />
          </div>
        </div>
      </div>

      <footer class="mt-12 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
        <div class="flex flex-wrap gap-3">
          <button
            @click="addBlock('text')"
            class="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 hover:from-emerald-600 hover:to-teal-700"
          >
            <DocumentTextIcon class="w-5 h-5" />
            Teks
          </button>
          
          <button
            @click="addBlock('checklist')"
            class="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 hover:from-amber-600 hover:to-orange-700"
          >
            <CheckCircleIcon class="w-5 h-5" />
            Checklist
          </button>
          
          <button
            @click="addBlock('code')"
            class="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 hover:from-violet-600 hover:to-purple-700"
          >
            <CodeBracketIcon class="w-5 h-5" />
            Kode
          </button>
          
          <button
            @click="addBlock('image')"
            class="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 hover:from-rose-600 hover:to-pink-700"
          >
            <PhotoIcon class="w-5 h-5" />
            Gambar
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeftIcon, Bars3Icon, DocumentTextIcon, CheckCircleIcon, CodeBracketIcon, PhotoIcon, CheckIcon } from '@heroicons/vue/24/outline';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  getNoteById,
  updateNoteTitle,
  getBlocksByNote,
  createBlock,
  updateBlock,
  deleteBlock,
  updateBlockOrders,
} from '../../services/blocks';
import BlockRenderer from '../../components/BlockRenderer.vue';

const route = useRoute();
const router = useRouter();

const noteId = route.params.noteId;
const title = ref('');
const blocks = ref([]);
const draggedIndex = ref(null);


onMounted(async () => {
  if (!noteId) return;
  try {
    const noteData = await getNoteById(noteId);
    console.log("noteData:", noteData);
    
    title.value = noteData.data.title;
    const blocksData = await getBlocksByNote(noteId);
    blocks.value = blocksData.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error("Gagal mengambil data:", error);
  }
});

const goBack = () => router.push('/');

const handleSave = async () => {
  if (!noteId) return;
  try {
    await updateNoteTitle(noteId, title.value);
    await saveOrder();
    goBack();
  } catch (error) {
    console.error("Gagal menyimpan:", error);
  }
};


const handleUpdateBlock = async (blockId, content, file) => {
  try {
    const updatedBlock = await updateBlock(blockId, content, file);
    const index = blocks.value.findIndex((b) => b.id === blockId);
    if (index !== -1) {
      blocks.value[index] = { ...blocks.value[index], ...updatedBlock };
    }
  } catch (error) {
    console.error("Gagal memperbarui block:", error);
  }
};

const handleDeleteBlock = async (blockId) => {
  try {
    await deleteBlock(blockId);
    blocks.value = blocks.value.filter((b) => b.id !== blockId);
    await saveOrder();
  } catch (error) {
    console.error("Gagal menghapus block:", error);
  }
};

const addBlock = async (type) => {
  if (!noteId) return;
  const placeholderContent = {
    text: "Blok teks baru",
    checklist: "[ ] Item checklist baru",
    code: "// Kode Anda di sini",
    image: "New image block",
  }[type];

  try {
    const newBlock = await createBlock(noteId, type, placeholderContent);
    newBlock.order = blocks.value.length;
    blocks.value.push(newBlock);
  } catch (error) {
    console.error("Gagal menambah block:", error);
  }
};

const dragStart = (index) => {
  draggedIndex.value = index;
};

const drop = async (dropIndex) => {
  if (draggedIndex.value === null || draggedIndex.value === dropIndex) {
    draggedIndex.value = null;
    return;
  }

  const draggedItem = blocks.value[draggedIndex.value];
  blocks.value.splice(draggedIndex.value, 1);
  blocks.value.splice(dropIndex, 0, draggedItem);

  await saveOrder();
  
  draggedIndex.value = null;
};

const saveOrder = async () => {
  try {
    const reordered = blocks.value.map((block, index) => ({
      id: block.id,
      order: index,
    }));
    await updateBlockOrders(reordered);
  } catch (error) {
    console.error("Gagal menyimpan urutan:", error);
  }
};
</script>