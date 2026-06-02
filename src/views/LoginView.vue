<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
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

const loginWithGoogle = () => {
  // Open simulated Google login popup
  const width = 500;
  const height = 600;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;
  
  const popup = window.open(
    '',
    'GoogleSignIn',
    `width=${width},height=${height},left=${left},top=${top},status=no,location=no,toolbar=no,menubar=no`
  );
  
  if (!popup) {
    toast.error('Popup blocked. Please allow popups for this site.');
    return;
  }
  
  popup.document.write(`
    <html>
      <head>
        <title>Sign in - Google Accounts</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f0f4f9;
            height: 100vh;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .card {
            width: 450px;
            padding: 40px;
            border-radius: 28px;
            background: #fff;
            border: 1px solid #e0e0e0;
          }
          .google-logo {
            width: 74px;
            height: 24px;
            margin-bottom: 16px;
          }
          .account-row {
            padding: 16px;
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
            transition: background 0.2s;
            display: flex;
            align-items: center;
            gap: 12px;
            border-radius: 12px;
            margin-bottom: 8px;
          }
          .account-row:hover {
            background-color: #f8f9fa;
          }
          .avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: #0d6efd;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.1rem;
          }
        </style>
      </head>
      <body>
        <div class="card shadow-sm">
          <div class="text-center mb-4">
            <svg class="google-logo" viewBox="0 0 74 24" width="74" height="24">
              <path fill="#4285F4" d="M6 19.3c-3.1 0-5.7-2.5-5.7-5.7s2.5-5.7 5.7-5.7c1.5 0 2.9.6 3.9 1.6l2.1-2.1C10.4 5.9 8.3 5 6 5 2.1 5 0 8.1 0 13.6s2.1 8.6 6 8.6c3 0 5-1.7 5.6-4.1H6v-3.2h8.7c.1.5.2.9.2 1.5 0 5.4-3.5 7.9-8.9 7.9z"/>
              <path fill="#EA4335" d="M22.5 21.6c-2.8 0-4.9-2.2-4.9-4.9s2.1-4.9 4.9-4.9c2.8 0 4.9 2.2 4.9 4.9s-2.1 4.9-4.9 4.9zm0-2.8c1.3 0 2.1-1.1 2.1-2.1s-.8-2.1-2.1-2.1-2.1 1.1-2.1 2.1.8 2.1 2.1 2.1z"/>
              <path fill="#FBBC05" d="M34.5 21.6c-2.8 0-4.9-2.2-4.9-4.9s2.1-4.9 4.9-4.9c2.8 0 4.9 2.2 4.9 4.9s-2.1 4.9-4.9 4.9zm0-2.8c1.3 0 2.1-1.1 2.1-2.1s-.8-2.1-2.1-2.1-2.1 1.1-2.1 2.1.8 2.1 2.1 2.1z"/>
              <path fill="#4285F4" d="M46.5 21.6c-2.6 0-4.4-1.9-4.4-4.7V12h3v4.6c0 1.2.7 1.8 1.6 1.8s1.6-.6 1.6-1.8V12h3v9.3h-3v-1.1c-.5.9-1.5 1.4-2.8 1.4z"/>
              <path fill="#34A853" d="M54.5 21.6c-1.5 0-2.8-.7-3.4-1.8l2.6-1.1c.4.6.8.8 1.2.8.5 0 .9-.3.9-.7V12h3.1v6.8c0 2.8-2 2.8-4.4 2.8z"/>
              <path fill="#EA4335" d="M64.5 21.6c-2.7 0-4.5-1.9-4.5-4.7V12h3v4.6c0 1.2.7 1.8 1.5 1.8.8 0 1.5-.6 1.5-1.8V12h3v9.3h-3v-1.1c-.5.9-1.5 1.4-2.8 1.4z"/>
            </svg>
            <h4 class="fw-bold mb-1 mt-3">Choose an account</h4>
            <p class="text-muted small">to continue to Student Management</p>
          </div>
          
          <div class="account-row" onclick="selectAccount('seavmoeurng1122@gmail.com', 'Seavmoeurng')">
            <div class="avatar bg-primary">S</div>
            <div>
              <div class="fw-bold text-dark mb-0" style="font-size: 0.9rem;">Seavmoeurng</div>
              <div class="text-muted small">seavmoeurng1122@gmail.com</div>
            </div>
          </div>
          <div class="account-row" onclick="selectAccount('student.tester@gmail.com', 'Student Tester')">
            <div class="avatar bg-success">T</div>
            <div>
              <div class="fw-bold text-dark mb-0" style="font-size: 0.9rem;">Student Tester</div>
              <div class="text-muted small">student.tester@gmail.com</div>
            </div>
          </div>
          
          <div class="text-center mt-4">
            <p class="text-muted small mb-0">To continue, Google will share your name, email address, and profile picture with Student Management.</p>
          </div>
        </div>
        
        \x3Cscript\x3E
          function selectAccount(email, name) {
            window.opener.postMessage({
              type: 'GOOGLE_SIGNIN_SUCCESS',
              email: email,
              name: name,
              token: 'mock-google-token-xyz-123'
            }, window.location.origin);
            window.close();
          }
        \x3C/script\x3E
      </body>
    </html>
  `);
};

const handleMessage = (event) => {
  if (event.origin !== window.location.origin) return;
  
  if (event.data && event.data.type === 'GOOGLE_SIGNIN_SUCCESS') {
    localStorage.setItem('token', event.data.token);
    toast.success(`Google Sign-In successful! Welcome, ${event.data.name}`);
    router.push('/');
  }
};

onMounted(() => {
  window.addEventListener('message', handleMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
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
</style>
