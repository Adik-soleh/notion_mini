<template>
  <router-view />
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'App',
  methods: {
    ...mapActions('auth', ['checkAuth'])
  },
  async created() {
    await this.checkAuth()
  }
}
</script>