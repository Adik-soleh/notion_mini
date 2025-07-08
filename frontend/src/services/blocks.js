import api from '../utils/api.js';

export const getBlocksByNote = async (noteId) => {
  const res = await api.get(`/notes/${noteId}/blocks`);
  return res.data.data;
};

export const createBlock = async (noteId, type, content) => {
  const payload = {
    type,
    content,
  };

  const res = await api.post(`/notes/${noteId}/blocks`, payload);
  return res.data.data;
};

export const updateBlock = async (blockId, content, file) => {
  const formData = new FormData();
  if (content) formData.append('content', content);
  if (file) formData.append('file', file);

  const res = await api.put(`/blocks/${blockId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data.data;
};

export const deleteBlock = async (blockId) => {
  await api.delete(`/blocks/${blockId}`);
};

export const updateBlockOrders = async (orders) => {
  await api.patch('/blocks/order', orders);
};

export const getNoteById = async (noteId) => {
  const res = await api.get(`/notes/${noteId}`);
  return res.data;
};

export const updateNoteTitle = async (noteId, title) => {
  await api.put(`/notes/${noteId}`, { title });
};

export const getNotes = async () => {
  const res = await api.get("/notes");
  return res.data.data;
};