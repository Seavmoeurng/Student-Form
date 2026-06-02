<template>
  <div class="purple-register-page d-flex align-items-center justify-content-center min-vh-100 py-5">
    
    <!-- Glassmorphic Register Card -->
    <div class="card glass-register-card shadow-lg border-0 p-4 p-md-5">
      
      <!-- Mount Revamped Form -->
      <div class="register-form-container mt-3 flex-grow-1">
        <StudentForm />
      </div>

      <!-- Bottom Footer Link -->
      <div class="bottom-footer text-end mt-4">
        <span class="text-white opacity-75 small">Already have an account?</span>
        <router-link to="/login" class="text-white fw-bold ms-2 text-decoration-none hover-underline small">Sign in</router-link>
      </div>

    </div>

  </div>
</template>

<script setup>
import StudentForm from '@/components/StudentForm.vue';
</script>

<style scoped>
.purple-register-page {
  background-image: url('@/assets/purple_night_forest.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
}

/* Glassmorphic card matching Screen 3 styling but with purple background image */
.glass-register-card {
  width: 100%;
  max-width: 520px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  border-radius: 28px;
}

.register-form-container {
  overflow: hidden;
}

.bottom-footer {
  z-index: 2;
}

.hover-underline:hover {
  text-decoration: underline !important;
}
</style>