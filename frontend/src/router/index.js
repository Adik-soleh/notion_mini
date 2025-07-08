import { createRouter, createWebHistory } from 'vue-router'

import Register from '../views/auth/Register.vue'
import Login from '../views/auth/Login.vue'
import NoteList from '../views/notes/NoteList.vue'
import NoteEditor from '../views/notes/NoteEditor.vue'
import ProtectedRoute from '../components/ProtectedRoute.vue'

const routes = [
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Home',
    component: ProtectedRoute,
    children: [
      {
        path: '',
        component: NoteList
      }
    ]
  },
  {
    path: '/notes/new',
    name: 'NewNote',
    component: ProtectedRoute,
    children: [
      {
        path: '',
        component: NoteEditor
      }
    ]
  },
  {
    path: '/notes/:noteId',
    name: 'EditNote',
    component: ProtectedRoute,
    children: [
      {
        path: '',
        component: NoteEditor,
        props: true 
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router