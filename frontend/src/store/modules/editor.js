import api from "../../services/api"
export default {
  namespaced: true,
  state: () => ({
    activeNote: {
      id: null,
      title: '',
      blocks: []
    },
    isLoading: false
  }),
  mutations: {
    setActiveNote(state, note) {
      state.activeNote = note
    },
    setLoading(state, status) {
      state.isLoading = status
    },
    setBlocks(state, blocks) {
      state.activeNote.blocks = blocks
    }
  },
  actions: {
    async fetchNoteById({ commit }, noteId) {
      commit('setLoading', true)
      const response = await api.get(`/notes/${noteId}`)
      commit('setActiveNote', response.data)
      commit('setLoading', false)
    },
    async updateNoteContent({ state }) {
      await api.put(`/notes/${state.activeNote.id}`, {
        title: state.activeNote.title,
        blocks: state.activeNote.blocks
      })
    },
    async updateBlockOrder({ state }) {
      await api.put('/blocks/reorder', {
        noteId: state.activeNote.id,
        blockOrder: state.activeNote.blocks.map(block => block.id)
      })
    }
  },
  getters: {
    activeNote: (state) => state.activeNote
  }
}
