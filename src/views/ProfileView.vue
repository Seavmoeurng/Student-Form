<template>
  <div class="profile-page min-vh-100 py-5 d-flex align-items-center justify-content-center">
    <div class="container d-flex justify-content-center">
      
      <!-- Cyberpunk System Identity Card -->
      <div class="card profile-card shadow-lg border-0">
        <div class="card-body p-4 p-md-5">
          
          <!-- RULE Logo and Profile Title -->
          <div class="text-center mb-5">
            <img src="@/assets/logo.jpg" alt="RULE Logo" class="rule-logo mb-3 shadow-sm" />
            <h1 class="system-title fw-extrabold fs-3">SYSTEM IDENTITY CONSOLE</h1>
            <p class="text-white-50 small mt-1">Admin Profile Credentials</p>
          </div>

          <!-- User Info Summary -->
          <div class="d-flex flex-column align-items-center text-center mb-5">
            <div class="profile-avatar-container mb-3">
              <img :src="userPicture || defaultAvatar" alt="User Profile" class="avatar-neon shadow-lg" />
              <div class="avatar-glow"></div>
            </div>
            <h3 class="text-white fw-bold mb-1">{{ userName }}</h3>
            <span class="badge rank-badge px-3 py-1.5 mb-2">RANK S • SUPERUSER</span>
            <p class="text-white-50 font-monospace small mb-0">{{ userEmail }}</p>
          </div>

          <!-- Console Detail Metrics -->
          <div class="details-section rounded p-4 bg-dark-purple-90 border border-purple-20 mb-4">
            <h5 class="section-title text-neon-purple small fw-bold mb-3 text-uppercase">Console Credentials</h5>
            
            <div class="d-flex justify-content-between py-2 border-bottom border-purple-10 small">
              <span class="text-white-50">System Role:</span>
              <span class="text-white fw-bold">Database Administrator</span>
            </div>
            
            <div class="d-flex justify-content-between py-2 border-bottom border-purple-10 small">
              <span class="text-white-50">Authentication Link:</span>
              <span class="text-neon-cyan fw-bold">Linked to Gmail Account</span>
            </div>

            <div class="d-flex justify-content-between py-2 border-bottom border-purple-10 small">
              <span class="text-white-50">Status:</span>
              <span class="text-success fw-bold"><i class="bi bi-shield-check-fill me-1"></i> ACTIVE & SECURE</span>
            </div>

            <div class="d-flex justify-content-between py-2 small">
              <span class="text-white-50">Session Encryption:</span>
              <span class="text-white fw-bold font-monospace">AES-256 GCM</span>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="d-flex gap-3">
            <router-link to="/" class="btn btn-outline-cyber flex-grow-1 py-2 fw-bold text-decoration-none text-center">
              RETURN TO DASHBOARD
            </router-link>
            <button @click="handleLogout" class="btn btn-logout py-2 fw-bold flex-grow-1">
              LOGOUT ACCESS
            </button>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();

const userName = ref('System Admin');
const userEmail = ref('admin@system.com');
const userPicture = ref('');
const defaultAvatar = 'https://t3.ftcdn.net/jpg/16/06/80/78/360_F_1606807867_RlJNJoHBniGLT1a88UuAIfkEnALRwUoW.jpg';

const handleLogout = () => {
  if (confirm('Are you sure you want to log out of the system?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('google_user_email');
    localStorage.removeItem('google_user_name');
    localStorage.removeItem('google_user_picture');
    toast.success('Successfully logged out.');
    router.push('/login');
  }
};

onMounted(() => {
  const name = localStorage.getItem('google_user_name');
  const email = localStorage.getItem('google_user_email');
  const picture = localStorage.getItem('google_user_picture');
  
  if (name) userName.value = name;
  if (email) userEmail.value = email;
  if (picture) userPicture.value = picture;
});
</script>

<style scoped>
.profile-page {
  background: transparent;
  width: 100%;
}

.profile-card {
  width: 100%;
  max-width: 500px;
  background: rgba(18, 17, 34, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1.5px solid rgba(168, 85, 247, 0.3);
  border-radius: 28px;
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.15) !important;
}

.rule-logo {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(217, 70, 239, 0.4);
  box-shadow: 0 0 15px rgba(217, 70, 239, 0.25);
}

.system-title {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #ffffff 0%, #d946ef 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.profile-avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
}

.avatar-neon {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #d946ef;
  position: relative;
  z-index: 2;
}

.avatar-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #d946ef;
  filter: blur(14px);
  opacity: 0.45;
  z-index: 1;
}

.rank-badge {
  background: rgba(217, 70, 239, 0.15);
  border: 1px solid rgba(217, 70, 239, 0.3);
  color: #d946ef;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
  font-size: 0.75rem;
  text-shadow: 0 0 8px rgba(217, 70, 239, 0.4);
}

.bg-dark-purple-90 {
  background: rgba(10, 8, 20, 0.95) !important;
}

.border-purple-20 {
  border-color: rgba(168, 85, 247, 0.25) !important;
}

.border-purple-10 {
  border-color: rgba(168, 85, 247, 0.15) !important;
}

.text-neon-purple {
  color: #d946ef;
  text-shadow: 0 0 8px rgba(217, 70, 239, 0.4);
}

.text-neon-cyan {
  color: #00e5ff;
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.4);
}

.btn-outline-cyber {
  background: transparent;
  border: 1.5px solid rgba(168, 85, 247, 0.4);
  color: #ffffff;
  border-radius: 20px;
  transition: all 0.3s;
}

.btn-outline-cyber:hover {
  background: rgba(168, 85, 247, 0.1);
  border-color: #d946ef;
  text-shadow: 0 0 8px rgba(217, 70, 239, 0.5);
  color: #ffffff;
}

.btn-logout {
  background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
  color: #ffffff;
  border: none;
  border-radius: 20px;
  transition: all 0.3s;
  box-shadow: 0 0 15px rgba(244, 63, 94, 0.3);
}

.btn-logout:hover {
  background: linear-gradient(135deg, #ff4d6d 0%, #f43f5e 100%);
  box-shadow: 0 0 25px rgba(244, 63, 94, 0.5);
  transform: translateY(-1px);
}
</style>
