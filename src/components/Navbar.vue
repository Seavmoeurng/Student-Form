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
          <!-- Left: Brand / Logo -->
          <router-link class="navbar-brand d-flex align-items-center" to="/">
            <img src="@/assets/logo.jpg" alt="Logo" class="navbar-logo" />
            <span class="nav-brand-text fw-bold ms-2">Student Management</span>
          </router-link>

          <!-- Middle: Simulation Search Input (Visible when Authenticated) -->
          <div v-if="isAuthenticated" class="nav-search-bar d-none d-md-flex align-items-center px-3">
            <input type="text" placeholder="Search system..." class="nav-search-input" />
            <i class="bi bi-search text-white-50"></i>
          </div>

          <!-- Right: Navigation Links -->
          <div class="navbar-nav flex-row gap-2 gap-md-3 align-items-center">
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

              <span class="nav-user-badge ms-2 d-none d-sm-inline-block">System Admin</span>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.navbar-logo {
  height: 36px;
  width: auto;
  border-radius: 8px;
  object-fit: contain;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.navbar-wrapper {
  background: transparent;
  padding: 20px 24px 0 24px;
  margin-bottom: 10px;
}

.floating-navbar {
  padding: 0;
}

.nav-card {
  background: rgba(18, 17, 34, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 8px 24px;
  border-radius: 30px;
  min-height: 56px;
  border: 1px solid rgba(168, 85, 247, 0.25);
  box-shadow: 0 0 25px rgba(168, 85, 247, 0.15) !important;
}

.nav-brand-text {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1.15rem;
  background: linear-gradient(90deg, #ffffff 0%, #d946ef 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}

/* Center Search Bar style from mockup */
.nav-search-bar {
  background: rgba(7, 5, 14, 0.6);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 30px;
  width: 250px;
  height: 36px;
  transition: all 0.3s ease;
}

.nav-search-bar:focus-within {
  border-color: #d946ef;
  box-shadow: 0 0 10px rgba(217, 70, 239, 0.25);
}

.nav-search-input {
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 0.85rem;
  width: 100%;
  padding: 0 5px;
}

.nav-search-input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

/* Link styling */
.custom-link {
  color: #9da2c0 !important;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 6px 14px !important;
  position: relative;
  transition: all 0.3s ease;
  white-space: nowrap;
  border-radius: 20px;
}

.custom-link i {
  font-size: 1rem;
}

.custom-link:hover {
  color: #ffffff !important;
  text-shadow: 0 0 10px rgba(168, 85, 247, 0.8);
  background: rgba(168, 85, 247, 0.1);
}

/* Active Link configuration */
.custom-link.active {
  color: #ffffff !important;
  background: rgba(168, 85, 247, 0.15);
  border: 1px solid rgba(168, 85, 247, 0.3);
  text-shadow: 0 0 8px rgba(168, 85, 247, 0.6);
}

.nav-user-badge {
  background: rgba(217, 70, 239, 0.15);
  border: 1px solid rgba(217, 70, 239, 0.3);
  color: #d946ef;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(217, 70, 239, 0.4);
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .nav-card {
    padding: 8px 16px;
    border-radius: 20px;
  }
  .custom-link span {
    display: none;
  }
  .nav-brand-text {
    font-size: 1rem;
  }
}
</style>