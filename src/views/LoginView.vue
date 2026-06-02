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
            <p class="text-muted small">to continue to Student App</p>
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
            <p class="text-muted small mb-0">To continue, Google will share your name, email address, and profile picture with Student App.</p>
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
  <div class="mobile-login-page d-flex align-items-center justify-content-center min-vh-100 py-5">
    
    <!-- Mobile Frame Screen Card -->
    <div class="mobile-frame shadow-lg position-relative overflow-hidden">
      
      <!-- Top Organic Wave Section -->
      <div class="top-wave-container">
        <svg viewBox="0 0 500 240" preserveAspectRatio="none" class="top-wave-svg">
          <path d="M0,0 L500,0 L500,150 C380,210 260,80 0,180 Z" fill="url(#wave-grad)"></path>
          <defs>
            <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00d2ff" />
              <stop offset="100%" stop-color="#0066ff" />
            </linearGradient>
          </defs>
        </svg>
        <div class="wave-text text-start px-4">
          <h1 class="fw-bold text-white mb-0 fs-2 leading-tight">Hello,</h1>
          <h1 class="fw-bold text-white fs-2 leading-tight">Sign in!</h1>
        </div>
      </div>

      <!-- Login Form Content -->
      <div class="login-form-container px-4">
        <form @submit.prevent="handleLogin">
          
          <!-- Underline Email Input -->
          <div class="input-line-group mb-4">
            <input 
              type="email" 
              v-model="credentials.email" 
              required 
              class="input-line" 
              placeholder="Enter your Email" 
              id="email-input" 
            />
          </div>

          <!-- Underline Password Input -->
          <div class="input-line-group mb-4">
            <input 
              type="password" 
              v-model="credentials.password" 
              required 
              class="input-line" 
              placeholder="Password" 
              id="password-input" 
            />
          </div>

          <!-- Action Buttons / Links -->
          <div class="d-flex align-items-center justify-content-between mt-5">
            <button 
              type="submit" 
              class="btn sign-in-pill-btn shadow-sm"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
              Sign in
            </button>
            <a href="#" class="text-muted small text-decoration-none fw-medium">Forgot Password</a>
          </div>
        </form>

        <!-- Social login divider -->
        <div class="d-flex align-items-center my-4">
          <hr class="flex-grow-1 text-muted opacity-25 m-0">
          <span class="px-3 text-muted small" style="font-size: 0.75rem;">Or Sign In With</span>
          <hr class="flex-grow-1 text-muted opacity-25 m-0">
        </div>

        <!-- Google button styled to match pill design -->
        <div class="text-center">
          <button 
            @click="loginWithGoogle" 
            type="button" 
            class="btn google-pill-btn w-100 py-2 d-flex align-items-center justify-content-center gap-2"
          >
            <svg class="google-icon" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
              <path fill="#EA4335" d="M12 5.04c1.67 0 3.2.58 4.38 1.69l3.27-3.27C17.67 1.54 15.01 1 12 1 7.24 1 3.2 3.73 1.25 7.72l3.88 3C6.07 7.75 8.78 5.04 12 5.04z"/>
              <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2 3.7-4.96 3.7-8.64z"/>
              <path fill="#FBBC05" d="M5.13 14.72c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.25 7.14C.45 8.74 0 10.53 0 12.43s.45 3.69 1.25 5.29l3.88-3z"/>
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89c-1.1.74-2.5 1.18-4.23 1.18-3.22 0-5.93-2.71-6.87-5.68l-3.88 3C3.2 20.27 7.24 23 12 23z"/>
            </svg>
            <span class="text-dark fw-medium" style="font-size: 0.85rem;">Google</span>
          </button>
        </div>

      </div>

      <!-- Bottom Organic Wave Section -->
      <div class="bottom-wave-container">
        <svg viewBox="0 0 500 150" preserveAspectRatio="none" class="bottom-wave-svg">
          <path d="M0,80 C180,30 320,130 500,40 L500,150 L0,150 Z" fill="url(#bottom-grad)"></path>
          <defs>
            <linearGradient id="bottom-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00d2ff" />
              <stop offset="100%" stop-color="#0056ff" />
            </linearGradient>
          </defs>
        </svg>
        <div class="bottom-text px-4">
          <span class="text-white small opacity-75">Don't have account?</span>
          <router-link to="/add-student" class="text-white fw-bold ms-2 text-decoration-none hover-underline">Sign up</router-link>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
.mobile-login-page {
  background: linear-gradient(135deg, #001f54 0%, #0044cc 50%, #0099ff 100%);
  width: 100%;
}

/* Mobile Screen Frame simulation */
.mobile-frame {
  width: 100%;
  max-width: 400px;
  height: 720px;
  background-color: #dbe1f1;
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}

/* Top Wave Container */
.top-wave-container {
  position: relative;
  width: 100%;
  height: 230px;
}

.top-wave-svg {
  width: 100%;
  height: 100%;
}

.wave-text {
  position: absolute;
  top: 60px;
  left: 10px;
  z-index: 2;
}

/* Form Underline Inputs styling */
.login-form-container {
  margin-top: 20px;
  flex-grow: 1;
}

.input-line-group {
  position: relative;
}

.input-line {
  width: 100%;
  border: none;
  border-bottom: 1.5px solid #a0a8bf;
  background: transparent;
  padding: 10px 0;
  color: #333333;
  font-size: 1rem;
  transition: border-color 0.3s;
  outline: none;
}

.input-line::placeholder {
  color: #a0a8bf;
}

.input-line:focus {
  border-bottom-color: #0066ff;
}

/* Pill buttons design */
.sign-in-pill-btn {
  background: linear-gradient(90deg, #00d2ff 0%, #0066ff 100%);
  color: #ffffff;
  border: none;
  border-radius: 30px;
  padding: 8px 36px !important;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 102, 255, 0.25) !important;
}

.sign-in-pill-btn:hover {
  box-shadow: 0 6px 15px rgba(0, 102, 255, 0.35) !important;
  transform: translateY(-1px);
  color: #ffffff;
}

.google-pill-btn {
  background-color: #ffffff;
  border: 1px solid #c8cedf;
  border-radius: 30px;
  transition: all 0.2s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.03) !important;
}

.google-pill-btn:hover {
  background-color: #f3f5fa;
  border-color: #b0b8d0;
  transform: translateY(-1px);
}

/* Bottom Wave Container */
.bottom-wave-container {
  position: relative;
  width: 100%;
  height: 120px;
}

.bottom-wave-svg {
  width: 100%;
  height: 100%;
}

.bottom-text {
  position: absolute;
  bottom: 24px;
  right: 15px;
  z-index: 2;
}

.hover-underline:hover {
  text-decoration: underline !important;
}

/* Responsive adjustments */
@media (max-height: 750px) {
  .mobile-frame {
    height: 100%;
    border-radius: 0;
  }
  .mobile-login-page {
    padding: 0 !important;
  }
}
</style>
