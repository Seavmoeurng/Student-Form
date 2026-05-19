<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isAuthenticated = ref(!!localStorage.getItem('token'));

// Watch for route changes to update authentication state
watch(() => router.currentRoute.value, () => {
    isAuthenticated.value = !!localStorage.getItem('token');
});

const handleLogout = () => {
    localStorage.removeItem('token');
    isAuthenticated.value = false;
    router.push('/login');
};
</script>

<template>
  <div class="navbar-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light floating-navbar">
      <div class="container-fluid justify-content-center">
        <div class="nav-card shadow-sm d-flex align-items-center">
          <router-link class="navbar-brand me-4 d-none d-lg-block" to="/">
            <span class="text-primary fw-bold">Student App</span>
          </router-link>

          <div class="navbar-nav flex-row gap-2 gap-md-4">
            <router-link class="nav-link custom-link d-flex align-items-center gap-2" active-class="active" to="/">
              <i class="bi bi-house-door"></i>
              <span>Home</span>
            </router-link>
            
            <router-link class="nav-link custom-link d-flex align-items-center gap-2" active-class="active" to="/add-student">
              <i class="bi bi-plus-square"></i>
              <span>Add Student</span>
            </router-link>
            
            <router-link class="nav-link custom-link d-flex align-items-center gap-2" active-class="active" to="/students">
              <i class="bi bi-people"></i>
              <span>Student List</span>
            </router-link>

            <router-link v-if="!isAuthenticated" class="nav-link custom-link d-flex align-items-center gap-2" active-class="active" to="/login">
              <i class="bi bi-person"></i>
              <span>Login</span>
            </router-link>
            
            <a v-else @click.prevent="handleLogout" href="#" class="nav-link custom-link d-flex align-items-center gap-2">
              <i class="bi bi-box-arrow-right"></i>
              <span>Logout</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.navbar-wrapper {
  background: linear-gradient(90deg, #0d6efd 0%, #003399 100%);
  padding: 30px 0;
  margin-bottom: 20px;
}

.floating-navbar {
  padding: 0;
}

.nav-card {
  background: #ffffff;
  padding: 10px 30px;
  border-radius: 12px;
  min-height: 60px;
}

.custom-link {
  color: #4a5568 !important;
  font-weight: 500;
  padding: 8px 12px !important;
  position: relative;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.custom-link i {
  font-size: 1.1rem;
}

.custom-link:hover {
  color: #0d6efd !important;
}

/* Active link indicator */
.custom-link.active {
  color: #0d6efd !important;
}

.custom-link.active::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 12px;
  right: 12px;
  height: 3px;
  background-color: #0d6efd;
  border-radius: 3px 3px 0 0;
}

@media (max-width: 768px) {
  .nav-card {
    padding: 10px 15px;
    width: 95%;
  }
  .custom-link span {
    display: none; /* Only icons on small screens if needed, or just let it scroll */
  }
}
</style>