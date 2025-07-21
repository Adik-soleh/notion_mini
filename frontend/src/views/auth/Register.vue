<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlusIcon class="w-8 h-8 text-white" />
          </div>
          <h2 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bergabung dengan Kami
          </h2>
          <p class="text-slate-600 mt-2">Buat akun baru untuk mulai mencatat</p>
        </div>

        <form @submit.prevent="onSubmit" class="space-y-6">
           <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">
              Name
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon class="h-5 w-5 text-slate-400" />
              </div>
              <input
                v-model="form.name"
                type="name"
                placeholder="Your Name"
                class="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                :class="{ 'border-red-500 focus:ring-red-500': errors.name }"
              />
            </div>
            <p v-if="errors.email" class="text-sm text-red-500 flex items-center gap-1">
              <ExclamationCircleIcon class="w-4 h-4" />
              {{ errors.name }}
            </p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">
              Email
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon class="h-5 w-5 text-slate-400" />
              </div>
              <input
                v-model="form.email"
                type="email"
                placeholder="name@example.com"
                class="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                :class="{ 'border-red-500 focus:ring-red-500': errors.email }"
              />
            </div>
            <p v-if="errors.email" class="text-sm text-red-500 flex items-center gap-1">
              <ExclamationCircleIcon class="w-4 h-4" />
              {{ errors.email }}
            </p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon class="h-5 w-5 text-slate-400" />
              </div>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Minimal 6 karakter"
                class="w-full pl-10 pr-12 py-3 bg-white/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                :class="{ 'border-red-500 focus:ring-red-500': errors.password }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                <EyeSlashIcon v-else class="h-5 w-5" />
              </button>
            </div>
            <p v-if="errors.password" class="text-sm text-red-500 flex items-center gap-1">
              <ExclamationCircleIcon class="w-4 h-4" />
              {{ errors.password }}
            </p>
            
            <div v-if="form.password" class="mt-2">
              <div class="flex space-x-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="h-1 flex-1 rounded-full transition-colors"
                  :class="getPasswordStrengthColor(i)"
                ></div>
              </div>
              <p class="text-xs text-slate-500 mt-1">
                {{ getPasswordStrengthText() }}
              </p>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div v-if="isLoading" class="flex items-center justify-center gap-2">
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Mendaftar...
            </div>
            <span v-else class="flex items-center justify-center gap-2">
              <UserPlusIcon class="w-5 h-5" />
              Daftar Sekarang
            </span>
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-slate-600">
            Sudah punya akun?
            <router-link 
              to="/login" 
              class="font-medium text-blue-600 hover:text-purple-600 transition-colors duration-200"
            >
              Masuk di sini
            </router-link>
          </p>
        </div>
      </div>

      <div class="text-center mt-8 text-slate-500 text-sm">
        <p>© 2024 My Notes. Semua hak dilindungi.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  UserPlusIcon, 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline';
import api from '../../utils/api';

const router = useRouter();
const isLoading = ref(false);
const showPassword = ref(false);

const form = reactive({
  name: '',
  email: '',
  password: ''
});

const errors = reactive({
  name: '',
  email: '',
  password: ''
});

import { useToast } from "vue-toastification";
const toast = useToast();

const validate = () => {
  let valid = true;
  
  errors.email = '';
  errors.password = '';

  if (!form.email) {
    errors.email = 'Email harus diisi';
    valid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Format email tidak valid';
    valid = false;
  }

  if (!form.password) {
    errors.password = 'Password harus diisi';
    valid = false;
  } else if (form.password.length < 6) {
    errors.password = 'Password minimal 6 karakter';
    valid = false;
  }

  return valid;
};

const getPasswordStrength = computed(() => {
  const password = form.password;
  if (!password) return 0;
  
  let strength = 0;
  
  if (password.length >= 6) strength++;
  if (password.length >= 8) strength++;
  
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password) && /[^a-zA-Z0-9]/.test(password)) strength++;
  
  return strength;
});

const getPasswordStrengthColor = (index) => {
  const strength = getPasswordStrength.value;
  if (index <= strength) {
    switch (strength) {
      case 1: return 'bg-red-400';
      case 2: return 'bg-orange-400';
      case 3: return 'bg-yellow-400';
      case 4: return 'bg-green-400';
      default: return 'bg-slate-200';
    }
  }
  return 'bg-slate-200';
};

const getPasswordStrengthText = () => {
  const strength = getPasswordStrength.value;
  switch (strength) {
    case 1: return 'Lemah';
    case 2: return 'Cukup';
    case 3: return 'Kuat';
    case 4: return 'Sangat Kuat';
    default: return 'Terlalu Lemah';
  }
};

const onSubmit = async () => {
  if (!validate()) return;
  
  isLoading.value = true;
  
  try {
    await api.post('/users', form);
    
    toast.success('Pendaftaran berhasil! Mengarahkan ke login...');
    
    setTimeout(() => {
      router.push('/login');
    }, 2000);
    
  } catch (error) {
    const message = error.response?.data?.message || 
                   error.response?.data?.errors || 
                   'Pendaftaran gagal';
    toast.error(message);
  } finally {
    isLoading.value = false;
  }
};
</script>