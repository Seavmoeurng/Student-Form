import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/students',
      name: 'students',
      
      component: () => import('@/views/StudentsView.vue'), 
    },
    {
      path: '/add-student',
      name: 'add-student',
      component: () => import('@/views/AddStudentView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/edit-student/:id',
      name: 'edit-student',
      component: () => import('@/views/EditStudentView.vue'),
    },
  ],
})

export default router