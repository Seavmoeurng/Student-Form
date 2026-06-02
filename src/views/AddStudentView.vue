<template>
  <div class="mobile-register-page d-flex align-items-center justify-content-center min-vh-100 py-5">
    
    <!-- Mobile Screen Frame Card -->
    <div class="mobile-frame-blue shadow-lg position-relative overflow-hidden p-4 d-flex flex-column">
      
      <!-- Mount Revamped Form -->
      <div class="register-form-container mt-3 flex-grow-1">
        <StudentForm />
      </div>

      <!-- Bottom Footer Link -->
      <div class="bottom-footer text-end mt-3">
        <span class="text-white small opacity-75">Already have an account?</span>
        <router-link to="/login" class="text-white fw-bold ms-2 text-decoration-none hover-underline">Sign in</router-link>
      </div>

    </div>

  </div>
</template>

<script setup>
import StudentForm from '@/components/StudentForm.vue';
</script>

<style scoped>
.mobile-register-page {
  background: linear-gradient(135deg, #001f54 0%, #0044cc 50%, #0099ff 100%);
  width: 100%;
}

/* Mobile Screen Frame matching Screen 3 styling */
.mobile-frame-blue {
  width: 100%;
  max-width: 400px;
  height: 720px;
  background: linear-gradient(135deg, #003db8 0%, #0062ff 50%, #00a2ff 100%);
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
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

/* Responsive adjustments */
@media (max-height: 750px) {
  .mobile-frame-blue {
    height: 100%;
    border-radius: 0;
  }
  .mobile-register-page {
    padding: 0 !important;
  }
}
</style>