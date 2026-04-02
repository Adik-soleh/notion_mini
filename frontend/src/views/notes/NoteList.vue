<template>
  <div class="min-h-screen bg-slate-50">
    <nav class="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-black rounded flex items-center justify-center shadow-md">
              <DocumentTextIcon class="w-5 h-5 text-white" />
            </div>
            <span class="ml-3 text-xl font-extrabold text-slate-900 tracking-tight">
              My Notes
            </span>
          </div>

          <div class="relative">
            <button
              @click="toggleDropdown"
              class="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all duration-200 p-1"
            >
              <div class="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                {{ userInitial }}
              </div>
              <ChevronDownIcon 
                class="w-4 h-4 text-slate-600 transition-transform duration-200" 
                :class="{ 'rotate-180': isDropdownOpen }"
              />
            </button>

            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-show="isDropdownOpen"
                class="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 py-2 z-50"
              >
                <div class="px-4 py-3 border-b border-slate-200">
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">
                      {{ userInitial }}
                    </div>
                    <div>
                      <p class="text-sm font-medium text-slate-900">{{ userName }}</p>
                      <p class="text-sm text-slate-500">{{ userEmail }}</p>
                    </div>
                  </div>
                </div>

                <div class="py-1">
                  
                  <div class="border-t border-slate-200 my-1"></div>
                  
                  <button
                    @click="handleLogout"
                    class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-900 transition-colors duration-200"
                  >
                    <ArrowRightOnRectangleIcon class="w-4 h-4 mr-3" />
                    Keluar
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-4xl mx-auto p-6">
      <header class="flex flex-col sm:flex-row sm:items-center justify-between mb-10 mt-4">
        <div>
          <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Catatanku
          </h1>
          <p class="text-slate-500 mt-2 text-lg font-medium">Kelola semua ide dan catatan Anda dengan mudah.</p>
        </div>
        
        <button
          @click="handleCreate"
          class="mt-6 sm:mt-0 inline-flex items-center gap-2 px-6 py-3.5 bg-black text-white rounded-full font-bold shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] hover:bg-black/90 transition-all duration-300 hover:-translate-y-0.5"
        >
          <PlusIcon class="w-5 h-5" stroke-width="2.5" />
          Catatan Baru
        </button>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="note in notes"
          :key="note.id"
          class="group relative bg-white rounded-3xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col min-h-[160px]"
          @click="goToNote(note.id)"
        >
          <div class="p-7 flex-1">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1 pr-4">
                <h3 class="text-xl font-bold text-slate-900 line-clamp-2">
                  {{ note.title || 'Untitled Note' }}
                </h3>
                <p class="text-sm text-slate-400 mt-1 font-medium">
                  {{ formatDate(note.updatedAt || note.createdAt) }}
                </p>
              </div>
              
              <button
                @click.stop="handleDelete(note.id)"
                class="opacity-0 group-hover:opacity-100 p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>

            <div class="text-sm text-slate-500 leading-relaxed font-medium line-clamp-2 mt-4 break-words">
              {{ note.preview || 'Tidak ada konten' }}
            </div>
          </div>

          <div class="px-7 py-4 bg-slate-50/80 border-t border-slate-100 mt-auto">
            <div class="flex items-center justify-between text-sm font-semibold text-slate-500">
              <span class="flex items-center gap-1.5">
                <DocumentTextIcon class="w-4 h-4" />
                {{ note.block_count || 0 }} blok
              </span>
              <span class="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-full text-xs">
                {{ note.type || 'Note' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="notes.length === 0" class="text-center py-20">
        <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 p-12 max-w-md mx-auto">
          <div class="w-20 h-20 bg-black rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3 hover:rotate-0 transition-transform duration-300">
            <DocumentTextIcon class="w-10 h-10 text-white" />
          </div>
          <h3 class="text-2xl font-bold text-slate-900 mb-2">Belum ada catatan</h3>
          <p class="text-slate-500 mb-8 font-medium">Mulai dengan membuat catatan pertama Anda hari ini</p>
          <button
            @click="handleCreate"
            class="inline-flex items-center gap-2 px-6 py-4 bg-black text-white rounded-full font-bold shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] hover:bg-black/90 transition-all duration-300 hover:-translate-y-0.5"
          >
            <PlusIcon class="w-5 h-5" stroke-width="2.5" />
            Buat Catatan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { 
  PlusIcon, 
  TrashIcon, 
  DocumentTextIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline';
import {
  getNotes,
  createNote,
  deleteNote
} from "../../services/notes";
import api from "../../utils/api";
import { useToast } from "vue-toastification";

const notes = ref([]);
const isDropdownOpen = ref(false);
const router = useRouter();
const store = useStore();
const toast = useToast();

const userEmail = computed(() => store.getters["auth/user"]?.email || "user@example.com");
const userName = computed(() => store.getters["auth/user"]?.name || "User");
const userInitial = computed(() => {
  return userEmail.value.charAt(0).toUpperCase();
});

const fetchNotes = async () => {
  notes.value = await getNotes();
};

const handleCreate = async () => {
  const newNote = await createNote("Custom");
  router.push(`/notes/${newNote.id}`);
};

const handleDelete = async (id) => {
  await deleteNote(id);
  fetchNotes();
};

const goToNote = (id) => {
  router.push(`/notes/${id}`);
};

const formatDate = (dateString) => {
  if (!dateString) return 'Baru saja';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Kemarin';
  if (diffDays < 7) return `${diffDays} hari yang lalu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu yang lalu`;
  
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

const handleLogout = async () => {
  try {
    await api.post("/users/logout", {}, { withCredentials: true });
    await store.dispatch("auth/clearUser");
    toast.success("Logout berhasil!");
    router.push("/login");
  } catch (error) {
    console.error("Logout error:", error);
    toast.error("Logout gagal!");
  } finally {
    closeDropdown();
  }
};

const handleClickOutside = (event) => {
  const target = event.target;
  if (!target.closest('.relative')) {
    closeDropdown();
  }
};

onMounted(() => {
  fetchNotes();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>