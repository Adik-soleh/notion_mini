<template>
  <div>
    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
    </div>
    
    <div v-else-if="isAuthenticated">
      <router-view />
    </div>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProtectedRoute',
  computed: {
    ...mapGetters('auth', ['user', 'isLoading', 'isAuthenticated'])
  },
  watch: {
    isAuthenticated: {
      handler(newVal) {
        if (!this.isLoading && !newVal) {
          this.$router.replace('/login')
        }
      },
      immediate: true
    }
  },
  async created() {
    if (this.isLoading) {
      await this.$store.dispatch('auth/checkAuth')
    }
    
    if (!this.isAuthenticated) {
      this.$router.replace('/login')
    }
  }
}
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  margin-top: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>