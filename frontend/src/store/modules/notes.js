
import { createStore } from 'vuex'
import api from '../../services/notes' 
const notesModule = {
  namespaced: true,
  state: {
    notes: []
  },
  mutations: {
    SET_NOTES(state, notes) {
      state.notes = notes
    },
    ADD_NOTE(state, note) {
      state.notes.push(note)
    },
    REMOVE_NOTE(state, noteId) {
      state.notes = state.notes.filter(note => note.id !== noteId)
    }
  },
  actions: {
    async fetchNotes({ commit }) {
      try {
        const response = await api.get('/notes')
        commit('SET_NOTES', response.data.data)
      } catch (error) {
        console.error('Error fetching notes:', error)
      }
    },
    async createNote({ commit }, title) {
      try {
        const response = await api.post('/notes', { title })
        commit('ADD_NOTE', response.data.data)
        return response.data.data
      } catch (error) {
        console.error('Error creating note:', error)
        throw error
      }
    },
    async deleteNote({ commit }, noteId) {
      try {
        await api.delete(`/notes/${noteId}`)
        commit('REMOVE_NOTE', noteId)
      } catch (error) {
        console.error('Error deleting note:', error)
        throw error
      }
    }
  },
  getters: {
    allNotes: state => state.notes
  }
}

const authModule = {
  namespaced: true,
  state: {
    user: null,
    isLoading: true
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    }
  },
  actions: {
    async checkAuth({ commit }) {
      try {
        const res = await api.get('/users/me', { withCredentials: true })
        commit('SET_USER', res.data.data)
      } catch {
        commit('SET_USER', null)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    setUser({ commit }, user) {
      commit('SET_USER', user)
    }
  },
  getters: {
    user: state => state.user,
    isLoading: state => state.isLoading,
    isAuthenticated: state => !!state.user
  }
}

export default createStore({
  modules: {
    notes: notesModule,
    auth: authModule
  }
})