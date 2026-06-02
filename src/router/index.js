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
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (to.name !== 'login' && to.name !== 'add-student' && !isAuthenticated) {
    next({ name: 'add-student' });
  } else {
    next();
  }
});

export default router