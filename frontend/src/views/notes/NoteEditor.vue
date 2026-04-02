<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-4xl mx-auto p-6">
      <header class="flex items-center gap-6 mb-10 py-6 px-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 sticky top-6 z-40">
        <button
          @click="goBack"
          class="text-slate-400 hover:text-slate-900 p-3 bg-slate-50 hover:bg-slate-100 rounded-full transition-all duration-300 hover:-translate-x-1"
        >
          <ArrowLeftIcon class="w-6 h-6" />
        </button>

        <input
          v-model="title"
          class="flex-1 text-3xl md:text-4xl font-extrabold bg-transparent border-none outline-none placeholder-slate-300 text-slate-900 focus:placeholder-slate-200 transition-all duration-300 tracking-tight"
          placeholder="Judul Catatan"
        />

        <button
          @click="handleSave"
          class="inline-flex items-center gap-2 px-7 py-3.5 bg-black text-white rounded-full font-bold shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] hover:bg-black/90 transition-all duration-300 hover:-translate-y-0.5"
        >
          <CheckIcon class="w-5 h-5 stroke-[2.5]" />
          Simpan
        </button>
      </header>

      <div class="space-y-6">
        <div
          v-for="(block, index) in blocks"
          :key="block.id"
          draggable="true"
          @dragstart="dragStart(index)"
          @dragover.prevent
          @dragenter.prevent
          @drop="drop(index)"
          class="group relative bg-white rounded-2xl border border-transparent hover:border-slate-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 cursor-move"
          :class="{ 'opacity-50 scale-95': draggedIndex === index }"
        >
          <div class="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:text-slate-900 cursor-grab active:cursor-grabbing">
            <Bars3Icon class="w-6 h-6" />
          </div>
          
          <div class="pl-12 pr-4 py-2">
            <BlockRenderer
              :block="block"
              @change="(content, file) => handleUpdateBlock(block.id, content, file)"
              @delete="handleDeleteBlock(block.id)"
            />
          </div>
        </div>
      </div>

      <footer class="mt-16 mb-20 flex justify-center">
        <div class="inline-flex flex-wrap items-center gap-2 p-2.5 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100">
          <button
            @click="addBlock('text')"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent text-slate-600 hover:text-black rounded-full font-bold transition-all duration-200 hover:bg-slate-100"
          >
            <DocumentTextIcon class="w-5 h-5 stroke-2" />
            Teks
          </button>
          
          <button
            @click="addBlock('checklist')"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent text-slate-600 hover:text-black rounded-full font-bold transition-all duration-200 hover:bg-slate-100"
          >
            <CheckCircleIcon class="w-5 h-5 stroke-2" />
            Checklist
          </button>
          
          <button
            @click="addBlock('code')"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent text-slate-600 hover:text-black rounded-full font-bold transition-all duration-200 hover:bg-slate-100"
          >
            <CodeBracketIcon class="w-5 h-5 stroke-2" />
            Kode
          </button>
          
          <button
            @click="addBlock('image')"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent text-slate-600 hover:text-black rounded-full font-bold transition-all duration-200 hover:bg-slate-100"
          >
            <PhotoIcon class="w-5 h-5 stroke-2" />
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
  text: "✨ Mulailah menulis ide kreatifmu di sini...",
  checklist: "[ ] Tambahkan tugas atau checklist di sini",
  code: "// 💡 Tulis cuplikan kode atau logika di sini",
  image: "🖼️ Unggah gambar menarik untuk memperkaya catatanmu",
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