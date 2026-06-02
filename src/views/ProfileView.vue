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

          <!-- User Info Summary (Read-Only Mode) -->
          <div v-if="!isEditing" class="d-flex flex-column align-items-center text-center mb-5">
            <div class="profile-avatar-container mb-3">
              <img :src="userPicture || defaultAvatar" alt="User Profile" class="avatar-neon shadow-lg" />
              <div class="avatar-glow"></div>
            </div>
            <h3 class="text-white fw-bold mb-1">{{ userName }}</h3>
            <span class="badge rank-badge px-3 py-1.5 mb-2">RANK S • SUPERUSER</span>
            <p class="text-white-50 font-monospace small mb-0">{{ userEmail }}</p>
          </div>

          <!-- User Info Edit Form (Edit Mode) -->
          <div v-else class="mb-5">
            <h5 class="section-title text-neon-purple small fw-bold mb-4 text-uppercase font-monospace">Modify Identity Details</h5>
            
            <div class="mb-4">
              <label class="form-label text-white-50 small mb-1">SYSTEM CODENAME</label>
              <input 
                type="text" 
                v-model="editForm.name" 
                class="form-control form-control-sm bg-transparent text-white border-purple-30 focus-purple py-2 px-3" 
                placeholder="Enter system codename"
                required
              />
            </div>

            <div class="mb-4">
              <label class="form-label text-white-50 small mb-1">AVATAR TRANSMISSION LINK (URL)</label>
              <input 
                type="text" 
                v-model="editForm.picture" 
                class="form-control form-control-sm bg-transparent text-white border-purple-30 focus-purple py-2.5 px-3 mb-3" 
                placeholder="https://example.com/avatar.jpg"
              />
              <span class="text-white-50 fs-8 d-block mb-2 font-monospace">OR CHOOSE DB SYSTEM PRESETS:</span>
              <div class="d-flex gap-3 justify-content-center flex-wrap">
                <img 
                  v-for="(img, idx) in avatarPresets" 
                  :key="idx" 
                  :src="img" 
                  @click="editForm.picture = img" 
                  class="preset-avatar-thumbnail" 
                  :class="{ active: editForm.picture === img }" 
                  alt="Preset Avatar" 
                />
              </div>
            </div>
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

          <!-- Action buttons (Read Mode) -->
          <div v-if="!isEditing" class="d-flex flex-wrap gap-2 justify-content-center">
            <router-link to="/" class="btn btn-outline-cyber flex-grow-1 py-2 fw-bold text-decoration-none text-center">
              DASHBOARD
            </router-link>
            <button @click="startEditing" class="btn btn-edit-profile flex-grow-1 py-2 fw-bold">
              EDIT PROFILE
            </button>
            <button @click="handleLogout" class="btn btn-logout flex-grow-1 py-2 fw-bold">
              LOGOUT
            </button>
          </div>

          <!-- Action buttons (Edit Mode) -->
          <div v-else class="d-flex gap-3">
            <button @click="cancelEditing" class="btn btn-outline-cyber flex-grow-1 py-2 fw-bold">
              CANCEL
            </button>
            <button @click="saveProfile" class="btn btn-save-profile flex-grow-1 py-2 fw-bold">
              SAVE CHANGES
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

// Preset Avatars from StudentList image library
const avatarPresets = [
  "https://t3.ftcdn.net/jpg/16/06/80/78/360_F_1606807867_RlJNJoHBniGLT1a88UuAIfkEnALRwUoW.jpg",
  "https://img.freepik.com/free-photo/front-view-lawyer-portrait_23-2151202433.jpg?semt=ais_hybrid&w=740&q=80",
  "https://t4.ftcdn.net/jpg/07/89/65/59/360_F_789655932_ROzqiDLt4ea1sE3eks0LWyuYnkuZCata.jpg",
  "https://img.freepik.com/free-photo/closeup-young-female-professional-making-eye-contact-against-colored-background_662251-651.jpg?semt=ais_hybrid&w=740&q=80",
  "https://thumbs.dreamstime.com/b/profile-picture-caucasian-male-employee-posing-office-happy-young-worker-look-camera-workplace-headshot-portrait-smiling-190186649.jpg",
];

const isEditing = ref(false);
const editForm = ref({
  name: '',
  picture: ''
});

const startEditing = () => {
  editForm.value.name = userName.value;
  editForm.value.picture = userPicture.value || defaultAvatar;
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
};

const saveProfile = () => {
  if (!editForm.value.name.trim()) {
    toast.error('System codename cannot be empty');
    return;
  }
  
  userName.value = editForm.value.name.trim();
  userPicture.value = editForm.value.picture.trim();
  
  localStorage.setItem('google_user_name', userName.value);
  if (userPicture.value && userPicture.value !== defaultAvatar) {
    localStorage.setItem('google_user_picture', userPicture.value);
  } else {
    localStorage.removeItem('google_user_picture');
    userPicture.value = '';
  }
  
  toast.success('System credentials saved successfully!');
  isEditing.value = false;
};

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

.border-purple-30 {
  border: 1px solid rgba(168, 85, 247, 0.35) !important;
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

.btn-edit-profile {
  background: rgba(168, 85, 247, 0.15);
  border: 1px solid rgba(168, 85, 247, 0.35);
  color: #ffffff;
  border-radius: 20px;
  transition: all 0.3s;
}

.btn-edit-profile:hover {
  background: rgba(168, 85, 247, 0.3);
  border-color: #d946ef;
  text-shadow: 0 0 8px rgba(217, 70, 239, 0.5);
  transform: translateY(-1px);
}

.btn-save-profile {
  background: linear-gradient(135deg, #a855f7 0%, #d946ef 100%);
  color: #ffffff;
  border: none;
  border-radius: 20px;
  transition: all 0.3s;
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.3);
}

.btn-save-profile:hover {
  background: linear-gradient(135deg, #b866ff 0%, #e956ff 100%);
  box-shadow: 0 0 25px rgba(217, 70, 239, 0.5);
  transform: translateY(-1px);
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

.preset-avatar-thumbnail {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-avatar-thumbnail:hover {
  border-color: #a855f7;
  transform: scale(1.1);
}

.preset-avatar-thumbnail.active {
  border-color: #d946ef;
  box-shadow: 0 0 10px rgba(217, 70, 239, 0.6);
  transform: scale(1.1);
}

.focus-purple:focus {
  border-color: #d946ef !important;
  box-shadow: 0 0 8px rgba(217, 70, 239, 0.3) !important;
  outline: none;
}

.fs-8 {
  font-size: 0.72rem;
}
</style>
