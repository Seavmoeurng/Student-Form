<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();

const credentials = ref({
    email: '',
    password: ''
});

const loading = ref(false);

const handleLogin = async () => {
    loading.value = true;
    try {
        const url = 'https://nodejsapi-wrcy.onrender.com/api/auth/login';
        const response = await axios.post(url, credentials.value);
        
        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            toast.success('Login successful!');
            router.push('/');
        } else {
            toast.error('Invalid response from server');
        }
    } catch (error) {
        console.error('Login error:', error);
        toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
        loading.value = false;
    }
};

// Real Google Sign-in Configurations
const showSettings = ref(false);
const googleClientId = ref(localStorage.getItem('google_client_id') || '364372938834-tq0r7c0jtrc4csqe88chpvd5q1cgr64m.apps.googleusercontent.com');
const currentOrigin = ref(window.location.origin + '/login');

const saveGoogleSettings = () => {
  localStorage.setItem('google_client_id', googleClientId.value);
  toast.success('Google Client ID configuration saved!');
  showSettings.value = false;
};

const loginWithGoogle = () => {
  if (!googleClientId.value) {
    toast.error('Please configure your Google Client ID first');
    showSettings.value = true;
    return;
  }
  
  // Implicit OAuth 2.0 flow
  const clientId = googleClientId.value;
  const redirectUri = window.location.origin + '/login';
  const scope = 'email profile';
  const state = 'oauth-state-system';
  
  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
  
  window.location.href = googleUrl;
};

onMounted(() => {
  // Check for access token redirect from Google OAuth
  const hash = window.location.hash;
  if (hash) {
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    
    if (accessToken) {
      loading.value = true;
      axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`)
        .then(response => {
          const { email, name, picture } = response.data;
          
          // Login admin successfully with google session
          localStorage.setItem('token', 'google-oauth-access-token-' + accessToken);
          localStorage.setItem('google_user_email', email);
          localStorage.setItem('google_user_name', name);
          if (picture) {
            localStorage.setItem('google_user_picture', picture);
          }
          
          toast.success(`Google Sign-In successful! Welcome, ${name}`);
          router.push('/');
        })
        .catch(error => {
          console.error('Google Auth Fetch Error:', error);
          toast.error('Failed to authenticate with Google. Verify your Client ID credentials and authorized origins.');
        })
        .finally(() => {
          loading.value = false;
          // Clear hash fragment from address bar
          window.history.replaceState({}, document.title, window.location.pathname);
        });
    }
  }
});
</script>

<template>
  <div class="cyber-login-page d-flex align-items-center justify-content-center min-vh-100 py-5">
    
    <!-- Cyberpunk System Login Card -->
    <div class="card cyber-login-card shadow-lg border-0">
      <div class="card-body p-4 p-md-5">
        
        <!-- RULE Logo and System Title -->
        <div class="text-center mb-5">
          <img src="@/assets/logo.jpg" alt="RULE Logo" class="rule-logo mb-3 shadow-sm" />
          <h1 class="system-title fw-extrabold fs-3">SYSTEM ACCESS</h1>
          <p class="text-white-50 small mt-1">Solo Leveling Database Console</p>
        </div>

        <form @submit.prevent="handleLogin">
          
          <!-- Underline Email Input -->
          <div class="mb-4">
            <label class="form-label text-white-50 fw-semibold mb-1 small">SYSTEM IDENTITY (EMAIL)</label>
            <input 
              type="email" 
              v-model="credentials.email" 
              required 
              class="input-underline-cyber" 
              id="email-input" 
            />
          </div>

          <!-- Underline Password Input -->
          <div class="mb-4">
            <label class="form-label text-white-50 fw-semibold mb-1 small">ACCESS KEY (PASSWORD)</label>
            <input 
              type="password" 
              v-model="credentials.password" 
              required 
              class="input-underline-cyber" 
              id="password-input" 
            />
          </div>

          <!-- Action Links (Remember Me & Forgot Password) -->
          <div class="d-flex align-items-center justify-content-between mb-5">
            <div class="form-check m-0">
              <input type="checkbox" class="form-check-input" id="remember-me" />
              <label class="form-check-label text-white-50 small" for="remember-me">Remember Me</label>
            </div>
            <a href="#" class="text-white-50 small fw-bold text-decoration-none hover-neon">Forgot Password?</a>
          </div>

          <!-- Linear Gradient Cyber Log in Button -->
          <button 
            type="submit" 
            class="btn login-cyber-btn w-100 py-2.5 fw-bold shadow-sm mb-4"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-1 text-white"></span>
            LOG IN TO SYSTEM
          </button>
          
          <!-- Google Login (Styled to match cyberpunk theme) -->
          <button 
            @click="loginWithGoogle" 
            type="button" 
            class="btn google-cyber-btn w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 mb-4"
          >
            <svg class="google-icon" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
              <path fill="#d946ef" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.478 0-6.3-2.822-6.3-6.3s2.822-6.3 6.3-6.3c1.706 0 3.199.687 4.29 1.794l3.14-3.14C19.347 2.226 16.035 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.898 0 10.871-4.212 10.871-11.24 0-.648-.073-1.32-.2-1.955H12.24z"/>
            </svg>
            <span class="text-white fw-bold" style="font-size: 0.9rem;">Sign in with Google</span>
          </button>

          <!-- Config button and settings panel -->
          <div class="text-center mt-2 mb-4">
            <button 
              type="button" 
              @click="showSettings = !showSettings" 
              class="btn btn-link text-white-50 text-decoration-none small hover-neon"
              style="font-size: 0.8rem;"
            >
              <i class="bi bi-gear-fill me-1"></i> Configure Google Client ID
            </button>
            
            <div v-if="showSettings" class="mt-2 p-3 text-start rounded border border-purple-20 bg-dark-purple-90">
              <label class="form-label text-white-50 small mb-1">Google Client ID</label>
              <input 
                type="text" 
                v-model="googleClientId" 
                class="form-control form-control-sm bg-transparent text-white border-purple-30 focus-purple mb-2" 
                placeholder="xxxx-xxxx.apps.googleusercontent.com"
              />
              <button type="button" @click="saveGoogleSettings" class="btn btn-sm btn-neon-purple w-100 py-1.5 fw-bold">
                Save Config
              </button>
              <p class="text-white-50 fs-8 mt-2 mb-0">
                Note: Whitelist redirect <code>{{ currentOrigin }}</code> in Google Cloud Console.
              </p>
            </div>
          </div>

          <!-- Register Link -->
          <div class="text-center mt-3">
            <span class="text-white-50 small">New user?</span>
            <router-link to="/add-student" class="text-white fw-bold ms-2 text-decoration-none hover-neon small">Register Account</router-link>
          </div>

        </form>

      </div>
    </div>
  </div>
</template>

<style scoped>
.cyber-login-page {
  background: transparent;
  width: 100%;
}

.cyber-login-card {
  width: 100%;
  max-width: 440px;
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

.input-underline-cyber {
  width: 100%;
  border: none;
  border-bottom: 1.5px solid rgba(168, 85, 247, 0.35);
  background: transparent;
  padding: 8px 0;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s;
  outline: none;
}

.input-underline-cyber:focus {
  border-bottom-color: #d946ef;
  box-shadow: 0 4px 12px -4px rgba(217, 70, 239, 0.3);
}

.form-check-input {
  background-color: transparent;
  border-color: rgba(168, 85, 247, 0.4);
}

.form-check-input:checked {
  background-color: #a855f7;
  border-color: #a855f7;
  box-shadow: 0 0 8px rgba(168, 85, 247, 0.5);
}

.login-cyber-btn {
  background: linear-gradient(135deg, #a855f7 0%, #d946ef 100%);
  color: #ffffff;
  border: none;
  border-radius: 30px;
  padding: 10px 24px !important;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.3) !important;
}

.login-cyber-btn:hover {
  background: linear-gradient(135deg, #b866ff 0%, #e956ff 100%);
  transform: translateY(-1px);
  box-shadow: 0 0 25px rgba(217, 70, 239, 0.5) !important;
}

.google-cyber-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: #ffffff;
  border-radius: 30px;
  transition: all 0.3s;
}

.google-cyber-btn:hover {
  background: rgba(168, 85, 247, 0.12);
  border-color: #d946ef;
  transform: translateY(-1px);
}

.hover-neon:hover {
  color: #d946ef !important;
  text-shadow: 0 0 8px rgba(217, 70, 239, 0.5);
}

.border-purple-20 {
  border-color: rgba(168, 85, 247, 0.25) !important;
}

.border-purple-30 {
  border: 1px solid rgba(168, 85, 247, 0.35) !important;
}

.bg-dark-purple-90 {
  background: rgba(10, 8, 20, 0.95) !important;
}

.focus-purple:focus {
  border-color: #d946ef !important;
  box-shadow: 0 0 8px rgba(217, 70, 239, 0.3) !important;
  outline: none;
}

.btn-neon-purple {
  background: linear-gradient(135deg, #a855f7 0%, #d946ef 100%);
  color: #ffffff;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 0 8px rgba(168, 85, 247, 0.2);
}

.btn-neon-purple:hover {
  background: linear-gradient(135deg, #b866ff 0%, #e956ff 100%);
  box-shadow: 0 0 15px rgba(217, 70, 239, 0.4);
}

.fs-8 {
  font-size: 0.72rem;
}
</style>
