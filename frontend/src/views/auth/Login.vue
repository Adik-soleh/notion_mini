<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <DocumentTextIcon class="w-8 h-8 text-white" />
          </div>
          <h2 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Selamat Datang
          </h2>
          <p class="text-slate-600 mt-2">Masuk ke akun Anda untuk melanjutkan</p>
        </div>

        <form @submit.prevent="onSubmit" class="space-y-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">
              Email
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon class="h-5 w-5 text-slate-400" />
              </div>
              <input
                v-model="email"
                type="email"
                placeholder="name@example.com"
                class="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                :class="{ 'border-red-500 focus:ring-red-500': emailError }"
              />
            </div>
            <p v-if="emailError" class="text-sm text-red-500 flex items-center gap-1">
              <ExclamationCircleIcon class="w-4 h-4" />
              {{ emailError }}
            </p>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon class="h-5 w-5 text-slate-400" />
              </div>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Masukkan password"
                class="w-full pl-10 pr-12 py-3 bg-white/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                :class="{ 'border-red-500 focus:ring-red-500': passwordError }"
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
            <p v-if="passwordError" class="text-sm text-red-500 flex items-center gap-1">
              <ExclamationCircleIcon class="w-4 h-4" />
              {{ passwordError }}
            </p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div v-if="isLoading" class="flex items-center justify-center gap-2">
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Masuk...
            </div>
            <span v-else class="flex items-center justify-center gap-2">
              <ArrowRightOnRectangleIcon class="w-5 h-5" />
              Masuk
            </span>
          </button>
        </form>

        <!-- Register Link -->
        <div class="mt-8 text-center">
          <p class="text-slate-600">
            Belum punya akun?
            <router-link 
              to="/register" 
              class="font-medium text-blue-600 hover:text-purple-600 transition-colors duration-200"
            >
              Daftar di sini
            </router-link>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8 text-slate-500 text-sm">
        <p>© 2024 My Notes. Semua hak dilindungi.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { 
  DocumentTextIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  ExclamationCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline';
import api from "../../utils/api";
import { AxiosError } from "axios";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const isLoading = ref(false);

const emailError = ref("");
const passwordError = ref("");

const store = useStore();
const router = useRouter();

import { useToast } from "vue-toastification";
const toast = useToast();

interface ErrorResponse {
  message?: string;
  errors?: string;
}

const validate = () => {
  let valid = true;
  emailError.value = "";
  passwordError.value = "";

  if (!email.value) {
    emailError.value = "Email harus diisi";
    valid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    emailError.value = "Format email tidak valid";
    valid = false;
  }

  if (!password.value) {
    passwordError.value = "Password harus diisi";
    valid = false;
  } else if (password.value.length < 6) {
    passwordError.value = "Password minimal 6 karakter";
    valid = false;
  }

  return valid;
};

const onSubmit = async () => {
  if (!validate()) return;

  isLoading.value = true;

  try {
    const res = await api.post("/users/login", {
      email: email.value,
      password: password.value,
    }, { withCredentials: true });

    await store.dispatch("auth/setUser", res.data.data);
    toast.success("Login berhasil!");
    router.push("/");
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    const message =
      err.response?.data?.message ||
      err.response?.data?.errors ||
      "Login gagal";
    toast.error(message);
  } finally {
    isLoading.value = false;
  }
};
</script>