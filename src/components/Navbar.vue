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
      <div class="container-fluid">
        <div class="nav-card shadow-sm d-flex justify-content-between align-items-center w-100">
          <router-link class="navbar-brand d-flex align-items-center" to="/">
            <img src="@/assets/logo.jpg" alt="Logo" class="navbar-logo" />
            <span class="text-white fw-bold ms-2">Student Management</span>
          </router-link>

          <div class="navbar-nav flex-row gap-2 gap-md-4">
            <!-- Unauthenticated Links -->
            <template v-if="!isAuthenticated">
              <router-link class="nav-link custom-link d-flex align-items-center gap-2" active-class="active" to="/add-student">
                <i class="bi bi-person-plus"></i>
                <span>Register</span>
              </router-link>
              <router-link class="nav-link custom-link d-flex align-items-center gap-2" active-class="active" to="/login">
                <i class="bi bi-box-arrow-in-right"></i>
                <span>Login</span>
              </router-link>
            </template>

            <!-- Authenticated Links -->
            <template v-else>
              <router-link class="nav-link custom-link d-flex align-items-center gap-2" active-class="active" to="/">
                <i class="bi bi-house-door"></i>
                <span>Home</span>
              </router-link>
              
              <router-link class="nav-link custom-link d-flex align-items-center gap-2" active-class="active" to="/students">
                <i class="bi bi-people"></i>
                <span>Student List</span>
              </router-link>
              
              <a @click.prevent="handleLogout" href="#" class="nav-link custom-link d-flex align-items-center gap-2">
                <i class="bi bi-box-arrow-right"></i>
                <span>Logout</span>
              </a>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.navbar-logo {
  height: 40px;
  width: auto;
  border-radius: 8px;
  object-fit: contain;
}

.navbar-wrapper {
  background: transparent;
  padding: 24px 0 0 0;
  margin-bottom: 20px;
}

.floating-navbar {
  padding: 0;
}

.nav-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  padding: 10px 30px;
  border-radius: 16px;
  min-height: 60px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.custom-link {
  color: rgba(255, 255, 255, 0.85) !important;
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
  color: #ffffff !important;
}

/* Active link indicator */
.custom-link.active {
  color: #ffffff !important;
}

.custom-link.active::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 12px;
  right: 12px;
  height: 3px;
  background-color: #ffffff;
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