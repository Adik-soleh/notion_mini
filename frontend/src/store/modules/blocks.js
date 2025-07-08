import * as blocksApi from '../../services/blocks';

const state = {
  blocks: [],
  loading: false,
  error: null
};

const mutations = {
  SET_BLOCKS(state, blocks) {
    state.blocks = blocks;
  },
  ADD_BLOCK(state, block) {
    state.blocks.push(block);
  },
  UPDATE_BLOCK(state, updatedBlock) {
    const index = state.blocks.findIndex(block => block.id === updatedBlock.id);
    if (index !== -1) {
      state.blocks.splice(index, 1, updatedBlock);
    }
  },
  DELETE_BLOCK(state, blockId) {
    state.blocks = state.blocks.filter(block => block.id !== blockId);
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  UPDATE_BLOCKS_ORDER(state, orders) {
    orders.forEach(orderItem => {
      const block = state.blocks.find(b => b.id === orderItem.id);
      if (block) {
        block.order = orderItem.order;
      }
    });
    
    state.blocks.sort((a, b) => a.order - b.order);
  }
};

const actions = {
  async fetchBlocksByNote({ commit }, noteId) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    try {
      const blocks = await blocksApi.getBlocksByNote(noteId);
      commit('SET_BLOCKS', blocks);
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async createBlock({ commit }, { noteId, type, content }) {
    try {
      const newBlock = await blocksApi.createBlock(noteId, type, content);
      commit('ADD_BLOCK', newBlock);
      return newBlock;
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    }
  },

  async updateBlock({ commit }, { blockId, content, file }) {
    try {
      const updatedBlock = await blocksApi.updateBlock(blockId, content, file);
      commit('UPDATE_BLOCK', updatedBlock);
      return updatedBlock;
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    }
  },

  async deleteBlock({ commit }, blockId) {
    try {
      await blocksApi.deleteBlock(blockId);
      commit('DELETE_BLOCK', blockId);
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    }
  },

  async updateBlockOrders({ commit }, orders) {
    try {
      await blocksApi.updateBlockOrders(orders);
      commit('UPDATE_BLOCKS_ORDER', orders);
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    }
  }
};

const getters = {
  blocks: state => state.blocks,
  loading: state => state.loading,
  error: state => state.error,
  getBlockById: (state) => (id) => {
    return state.blocks.find(block => block.id === id);
  },
  blocksByType: (state) => (type) => {
    return state.blocks.filter(block => block.type === type);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};