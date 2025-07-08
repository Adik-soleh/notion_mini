<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <nav class="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-lg sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <DocumentTextIcon class="w-5 h-5 text-white" />
            </div>
            <span class="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Notes
            </span>
          </div>

          <div class="relative">
            <button
              @click="toggleDropdown"
              class="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 p-1"
            >
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
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
                class="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 py-2 z-50"
              >
                <div class="px-4 py-3 border-b border-slate-200">
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
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
      <header class="flex items-center justify-between mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Notes
          </h1>
          <p class="text-slate-600 mt-1">Kelola catatan Anda dengan mudah</p>
        </div>
        
        <button
          @click="handleCreate"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-purple-700"
        >
          <PlusIcon class="w-5 h-5" />
          Catatan Baru
        </button>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="note in notes"
          :key="note.id"
          class="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden"
          @click="goToNote(note.id)"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-slate-800 truncate">
                  {{ note.title || 'Untitled Note' }}
                </h3>
                <p class="text-sm text-slate-500 mt-1">
                  {{ formatDate(note.updatedAt || note.createdAt) }}
                </p>
              </div>
              
              <button
                @click.stop="handleDelete(note.id)"
                class="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>

            <div class="text-sm text-slate-600 line-clamp-3">
              {{ note.preview || 'Tidak ada konten' }}
            </div>
          </div>

          <div class="px-6 py-4 bg-gradient-to-r from-slate-50/50 to-blue-50/50 border-t border-white/20">
            <div class="flex items-center justify-between text-xs text-slate-500">
              <span class="flex items-center gap-1">
                <DocumentTextIcon class="w-4 h-4" />
                {{ note.block_count || 0 }} blok
              </span>
              <span class="px-2 py-1 bg-blue-100 text-blue-600 rounded-full font-medium">
                {{ note.type || 'Note' }}
              </span>
            </div>
          </div>

          <div class="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      </div>

      <div v-if="notes.length === 0" class="text-center py-16">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 max-w-md mx-auto">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <DocumentTextIcon class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-xl font-semibold text-slate-800 mb-2">Belum ada catatan</h3>
          <p class="text-slate-600 mb-6">Mulai dengan membuat catatan pertama Anda</p>
          <button
            @click="handleCreate"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <PlusIcon class="w-5 h-5" />
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