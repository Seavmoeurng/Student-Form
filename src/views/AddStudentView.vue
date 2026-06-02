<template>
  <div class="cyber-register-page d-flex align-items-center justify-content-center min-vh-100 py-5">
    
    <!-- Cyber Register Card -->
    <div class="card cyber-register-card shadow-lg border-0 p-4 p-md-5">
      
      <!-- Mount Revamped Form -->
      <div class="register-form-container mt-3 flex-grow-1">
        <StudentForm />
      </div>

      <!-- Bottom Footer Link -->
      <div class="bottom-footer text-end mt-4">
        <span class="text-white-50 small">Already have a system profile?</span>
        <router-link to="/login" class="text-white fw-bold ms-2 text-decoration-none hover-neon small">Sign in</router-link>
      </div>

    </div>

  </div>
</template>

<script setup>
import StudentForm from '@/components/StudentForm.vue';
</script>

<style scoped>
.cyber-register-page {
  background: transparent;
  width: 100%;
}

/* Cyber card matching mockup Screen 3 styling */
.cyber-register-card {
  width: 100%;
  max-width: 520px;
  background: rgba(18, 17, 34, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1.5px solid rgba(168, 85, 247, 0.3);
  border-radius: 28px;
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.15) !important;
}

.register-form-container {
  overflow: hidden;
}

.bottom-footer {
  z-index: 2;
}

.hover-neon:hover {
  color: #d946ef !important;
  text-shadow: 0 0 8px rgba(217, 70, 239, 0.5);
}
</style>