<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 p-10">
        <div class="text-center mb-10">
          <div class="w-20 h-20 bg-black rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3 hover:rotate-0 transition-transform duration-300 shadow-slate-300">
            <DocumentTextIcon class="w-10 h-10 text-white" />
          </div>
          <h2 class="text-4xl font-extrabold text-slate-900 tracking-tight">
            Selamat Datang
          </h2>
          <p class="text-slate-500 mt-3 font-medium">Masuk ke akun Anda untuk melanjutkan</p>
        </div>

        <form @submit.prevent="onSubmit" class="space-y-7">
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-900 ml-1 mb-2">
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
                class="w-full pl-11 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-black transition-all duration-300 placeholder-slate-400 font-medium text-slate-900"
                :class="{ 'border-red-500 focus:ring-red-100 focus:border-red-500': emailError }"
              />
            </div>
            <p v-if="emailError" class="text-sm text-red-500 font-medium flex items-center gap-1 mt-2">
              <ExclamationCircleIcon class="w-4 h-4" />
              {{ emailError }}
            </p>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-900 ml-1 mb-2">
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
                class="w-full pl-11 pr-12 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-black transition-all duration-300 placeholder-slate-400 font-medium text-slate-900"
                :class="{ 'border-red-500 focus:ring-red-100 focus:border-red-500': passwordError }"
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
            <p v-if="passwordError" class="text-sm text-red-500 font-medium flex items-center gap-1 mt-2">
              <ExclamationCircleIcon class="w-4 h-4" />
              {{ passwordError }}
            </p>
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-4 px-4 bg-black text-white rounded-2xl font-bold shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] hover:bg-black/90 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
          </div>
        </form>

        <!-- Register Link -->
        <div class="mt-10 text-center">
          <p class="text-slate-500 font-medium">
            Belum punya akun?
            <router-link 
              to="/register" 
              class="font-bold text-black hover:underline transition-all duration-200 ml-1"
            >
              Daftar di sini
            </router-link>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8 text-slate-500 text-sm">
        <p>© 2024 Adik Soleh. Semua hak dilindungi.</p>
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