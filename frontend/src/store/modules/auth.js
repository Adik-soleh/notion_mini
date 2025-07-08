import api from '../../utils/api.js';

const state = {
  user: null,
  isLoading: true
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_LOADING(state, isLoading) {
    state.isLoading = isLoading;
  }
};

const actions = {
  async checkAuth({ commit }) {
    try {
      const res = await api.get('/users/me', { withCredentials: true });
      commit('SET_USER', res.data.data);
    } catch {
      commit('SET_USER', null);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  setUser({ commit }, user) {
    commit('SET_USER', user);
  }
};

const getters = {
  user: state => state.user,
  isLoading: state => state.isLoading,
  isAuthenticated: state => !!state.user
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};