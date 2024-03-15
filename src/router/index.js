// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import NoteEdit from '@/views/NoteEdit.vue'; 

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/note/:id',
    name: 'NoteEdit',
    component: NoteEdit,
    props: route => ({ id: route.params.id })
  },
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
