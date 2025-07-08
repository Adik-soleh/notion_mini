import api from "../utils/api"; 

export const getNotes = async () => {
  const res = await api.get("/notes");
  return res.data.data;
};

export const getNoteById = async (noteId) => {
  const res = await api.get(`/notes/${noteId}`);
  return res.data;
};

export const createNote = async (title) => {
  const res = await api.post("/notes", { title });
  return res.data.data;
};

export const updateNoteTitle = async (noteId, title) => {
  await api.put(`/notes/${noteId}`, { title });
};

export const deleteNote = async (noteId) => {
  await api.delete(`/notes/${noteId}`);
};

export const deleteBlock = async (blockId) => {
  await api.delete(`/blocks/${blockId}`);
};
