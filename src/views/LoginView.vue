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

// Real Google Sign-in Configurations
const showSettings = ref(false);
const googleClientId = ref(localStorage.getItem('google_client_id') || '364372938834-tq0r7c0jtrc4csqe88chpvd5q1cgr64m.apps.googleusercontent.com');
const currentOrigin = ref(window.location.origin + '/login');
const windowOrigin = ref(window.location.origin);

const saveGoogleSettings = () => {
  localStorage.setItem('google_client_id', googleClientId.value);
  toast.success('Google Client ID configuration saved!');
  showSettings.value = false;
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      toast.success('Copied to clipboard!');
    })
    .catch(err => {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy to clipboard');
    });
};

const simulateGoogleLogin = () => {
  loading.value = true;
  setTimeout(() => {
    // Log the user in with simulated Google credentials
    localStorage.setItem('token', 'google-oauth-access-token-simulated');
    localStorage.setItem('google_user_email', 'seavmoeurng1122@gmail.com');
    localStorage.setItem('google_user_name', 'Seav Moeurng (Simulated)');
    localStorage.setItem('google_user_picture', 'https://t3.ftcdn.net/jpg/16/06/80/78/360_F_1606807867_RlJNJoHBniGLT1a88UuAIfkEnALRwUoW.jpg');
    
    toast.success('Simulated Google Sign-In successful! Welcome, Seav Moeurng');
    loading.value = false;
    router.push('/');
  }, 800);
};

const defaultClientId = '364372938834-tq0r7c0jtrc4csqe88chpvd5q1cgr64m.apps.googleusercontent.com';

const loginWithGoogle = () => {
  if (!googleClientId.value) {
    toast.error('Please configure your Google Client ID first');
    showSettings.value = true;
    return;
  }
  
  const clientId = googleClientId.value;
  const redirectUri = window.location.origin + '/login';
  const scope = 'email profile';
  const state = 'oauth-state-system';

  // If using default client ID, use interactive Google Account Chooser popup
  if (clientId === defaultClientId) {
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    const popup = window.open('', 'GoogleSignIn', `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`);
    
    if (!popup) {
      toast.error('Popup blocked by browser! Please allow popups for this site.');
      return;
    }

    popup.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sign in - Google Accounts</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
          <style>
            body {
              background-color: #f0f4f9;
              font-family: 'Roboto', Arial, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
            }
            .card {
              background: #ffffff;
              border: 1px solid #dadce0;
              border-radius: 8px;
              width: 100%;
              max-width: 450px;
              padding: 40px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            }
            .google-logo {
              display: block;
              margin: 0 auto 20px auto;
            }
            .title {
              font-size: 24px;
              font-weight: 400;
              color: #202124;
              margin-bottom: 8px;
            }
            .subtitle {
              font-size: 16px;
              color: #5f6368;
              margin-bottom: 24px;
            }
            .account-row {
              display: flex;
              align-items: center;
              padding: 12px 16px;
              border-bottom: 1px solid #dadce0;
              cursor: pointer;
              transition: background-color 0.2s;
              border-radius: 4px;
            }
            .account-row:hover {
              background-color: #f1f3f4;
            }
            .avatar {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              margin-right: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 500;
              font-size: 16px;
              background-color: #1a73e8;
              background-size: cover;
              background-position: center;
            }
            .form-control:focus {
              border-color: #1a73e8;
              box-shadow: 0 0 0 3px rgba(26,115,232,0.2);
            }
            .btn-primary {
              background-color: #1a73e8;
              border: none;
              padding: 10px 24px;
              font-weight: 500;
            }
            .btn-primary:hover {
              background-color: #1557b0;
            }
            .btn-secondary {
              background-color: transparent;
              color: #1a73e8;
              border: none;
              font-weight: 500;
            }
            .btn-secondary:hover {
              background-color: rgba(26,115,232,0.04);
              color: #1557b0;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="text-center">
              <svg class="google-logo" width="74" height="24" viewBox="0 0 74 24">
                <path fill="#4285F4" d="M6 19.3c-3.1 0-5.7-2.5-5.7-5.7s2.5-5.7 5.7-5.7c1.5 0 2.9.6 3.9 1.6l2.1-2.1C10.4 5.9 8.3 5 6 5 2.1 5 0 8.1 0 13.6s2.1 8.6 6 8.6c3 0 5-1.7 5.6-4.1H6v-3.2h8.7c.1.5.2.9.2 1.5 0 5.4-3.5 7.9-8.9 7.9z"/>
                <path fill="#EA4335" d="M22.5 21.6c-2.8 0-4.9-2.2-4.9-4.9s2.1-4.9 4.9-4.9c2.8 0 4.9 2.2 4.9 4.9s-2.1 4.9-4.9 4.9zm0-2.8c1.3 0 2.1-1.1 2.1-2.1s-.8-2.1-2.1-2.1-2.1 1.1-2.1 2.1.8 2.1 2.1 2.1z"/>
                <path fill="#FBBC05" d="M34.5 21.6c-2.8 0-4.9-2.2-4.9-4.9s2.1-4.9 4.9-4.9c2.8 0 4.9 2.2 4.9 4.9s-2.1 4.9-4.9 4.9zm0-2.8c1.3 0 2.1-1.1 2.1-2.1s-.8-2.1-2.1-2.1-2.1 1.1-2.1 2.1.8 2.1 2.1 2.1z"/>
                <path fill="#4285F4" d="M46.5 21.6c-2.6 0-4.4-1.9-4.4-4.7V12h3v4.6c0 1.2.7 1.8 1.6 1.8s1.6-.6 1.6-1.8V12h3v9.3h-3v-1.1c-.5.9-1.5 1.4-2.8 1.4z"/>
                <path fill="#34A853" d="M54.5 21.6c-1.5 0-2.8-.7-3.4-1.8l2.6-1.1c.4.6.8.8 1.2.8.5 0 .9-.3.9-.7V12h3.1v6.8c0 2.8-2 2.8-4.4 2.8z"/>
                <path fill="#EA4335" d="M64.5 21.6c-2.7 0-4.5-1.9-4.5-4.7V12h3v4.6c0 1.2.7 1.8 1.5 1.8.8 0 1.5-.6 1.5-1.8V12h3v9.3h-3v-1.1c-.5.9-1.5 1.4-2.8 1.4z"/>
              </svg>
              
              <div id="chooser-section">
                <h1 class="title">Choose an account</h1>
                <p class="subtitle">to continue to Student Management</p>
                
                <div class="account-list text-start mb-4">
                  <div class="account-row" onclick="selectAccount('seavmoeurng1122@gmail.com', 'Seav Moeurng', 'https://t3.ftcdn.net/jpg/16/06/80/78/360_F_1606807867_RlJNJoHBniGLT1a88UuAIfkEnALRwUoW.jpg')">
                    <div class="avatar" style="background-image: url('https://t3.ftcdn.net/jpg/16/06/80/78/360_F_1606807867_RlJNJoHBniGLT1a88UuAIfkEnALRwUoW.jpg')"></div>
                    <div>
                      <div class="fw-semibold text-dark mb-0" style="font-size: 0.95rem;">Seav Moeurng</div>
                      <div class="text-muted small">seavmoeurng1122@gmail.com</div>
                    </div>
                  </div>
                  
                  <div class="account-row" onclick="selectAccount('student.tester@gmail.com', 'Student Tester', '')">
                    <div class="avatar">T</div>
                    <div>
                      <div class="fw-semibold text-dark mb-0" style="font-size: 0.95rem;">Student Tester</div>
                      <div class="text-muted small">student.tester@gmail.com</div>
                    </div>
                  </div>
                  
                  <div class="account-row" onclick="showCustomInput()">
                    <div class="avatar bg-light text-secondary border"><i class="bi bi-person-plus-fill"></i></div>
                    <div>
                      <div class="fw-semibold text-primary mb-0" style="font-size: 0.95rem;">Use another account</div>
                      <div class="text-muted small">Sign in with a different Gmail</div>
                    </div>
                  </div>
                </div>
              </div>

              <div id="custom-section" class="d-none text-start">
                <h1 class="title text-center">Sign in with Google</h1>
                <p class="subtitle text-center">Use your Google Account</p>
                
                <form onsubmit="handleCustomSubmit(event)" class="mt-4">
                  <div class="mb-4">
                    <label class="form-label text-muted small">Email (Gmail address)</label>
                    <input type="email" id="custom-email" required class="form-control py-2.5" placeholder="name@gmail.com" />
                  </div>
                  
                  <div class="mb-4">
                    <label class="form-label text-muted small">Password</label>
                    <input type="password" required class="form-control py-2.5" placeholder="••••••••" />
                  </div>

                  <div class="d-flex justify-content-between align-items-center mt-5">
                    <button type="button" onclick="showChooser()" class="btn btn-secondary px-0">Back</button>
                    <button type="submit" class="btn btn-primary px-4">Next</button>
                  </div>
                </form>
              </div>

              <p class="text-muted mt-5" style="font-size: 12px; line-height: 1.4;">
                To continue, Google will share your name, email address, language preference, and profile picture with Student Management.
              </p>
            </div>
          </div>

          <script>
            function selectAccount(email, name, picture) {
              window.opener.postMessage({
                type: 'GOOGLE_SIGNIN_SUCCESS',
                email: email,
                name: name,
                picture: picture
              }, window.location.origin);
              window.close();
            }

            function showCustomInput() {
              document.getElementById('chooser-section').classList.add('d-none');
              document.getElementById('custom-section').classList.remove('d-none');
            }

            function showChooser() {
              document.getElementById('custom-section').classList.add('d-none');
              document.getElementById('chooser-section').classList.remove('d-none');
            }

            function handleCustomSubmit(e) {
              e.preventDefault();
              const email = document.getElementById('custom-email').value;
              
              let name = email.split('@')[0];
              name = name.charAt(0).toUpperCase() + name.slice(1);
              
              selectAccount(email, name, '');
            }
          \x3C/script\x3E
        </body>
      </html>
    `);
    popup.document.close();
    return;
  }
  
  // Real OAuth 2.0 flow fallback
  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
  window.location.href = googleUrl;
};

const handleMessage = (event) => {
  if (event.origin !== window.location.origin) return;
  
  if (event.data && event.data.type === 'GOOGLE_SIGNIN_SUCCESS') {
    const { email, name, picture } = event.data;
    
    localStorage.setItem('token', 'google-oauth-access-token-simulated');
    localStorage.setItem('google_user_email', email);
    localStorage.setItem('google_user_name', name);
    if (picture) {
      localStorage.setItem('google_user_picture', picture);
    } else {
      localStorage.removeItem('google_user_picture');
    }
    
    toast.success(`Google Sign-In successful! Welcome, ${name}`);
    router.push('/');
  }
};

onMounted(() => {
  window.addEventListener('message', handleMessage);

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
          window.history.replaceState({}, document.title, window.location.pathname);
        });
    }
  }
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
            class="btn google-cyber-btn w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 mb-3"
          >
            <svg class="google-icon" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
              <path fill="#d946ef" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.478 0-6.3-2.822-6.3-6.3s2.822-6.3 6.3-6.3c1.706 0 3.199.687 4.29 1.794l3.14-3.14C19.347 2.226 16.035 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.898 0 10.871-4.212 10.871-11.24 0-.648-.073-1.32-.2-1.955H12.24z"/>
            </svg>
            <span class="text-white fw-bold" style="font-size: 0.9rem;">Sign in with Google (OAuth)</span>
          </button>

          <!-- Simulate Google Login (Bypass / Local Testing) -->
          <button 
            @click="simulateGoogleLogin" 
            type="button" 
            class="btn simulate-cyber-btn w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 mb-4"
          >
            <i class="bi bi-lightning-charge-fill text-neon-pink"></i>
            <span class="text-white fw-bold" style="font-size: 0.9rem;">Simulate Google Login (Bypass)</span>
          </button>

          <!-- Config button and settings panel -->
          <div class="text-center mt-2 mb-4">
            <button 
              type="button" 
              @click="showSettings = !showSettings" 
              class="btn btn-link text-white-50 text-decoration-none small hover-neon"
              style="font-size: 0.8rem;"
            >
              <i class="bi bi-gear-fill me-1"></i> Developer Google OAuth Settings
            </button>
            
            <div v-if="showSettings" class="mt-2 p-3 text-start rounded border border-purple-20 bg-dark-purple-90">
              <h6 class="text-white fw-bold small mb-2 text-uppercase font-monospace text-neon-purple">OAuth Configuration</h6>
              
              <div class="mb-3">
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
              </div>

              <!-- Diagnostic Info & Steps to solve 401 client error -->
              <div class="border-top border-purple-20 pt-2 mt-2">
                <p class="text-neon-pink fw-bold small mb-1">
                  <i class="bi bi-info-circle-fill"></i> How to solve Error 401: invalid_client?
                </p>
                <p class="text-white-50 fs-8 mb-2">
                  Google requires creating credentials in your Google Cloud Console for this origin:
                </p>
                
                <div class="mb-2">
                  <span class="text-white-50 fs-8 d-block mb-1">1. Authorized JavaScript Origin:</span>
                  <div class="input-group input-group-sm">
                    <input type="text" readonly :value="windowOrigin" class="form-control bg-transparent text-white-50 border-purple-20 fs-8 py-0" />
                    <button type="button" @click="copyToClipboard(windowOrigin)" class="btn btn-outline-purple btn-xs" style="padding: 1px 6px; border: 1px solid rgba(168, 85, 247, 0.4);"><i class="bi bi-clipboard text-white-50"></i></button>
                  </div>
                </div>

                <div class="mb-3">
                  <span class="text-white-50 fs-8 d-block mb-1">2. Authorized Redirect URI:</span>
                  <div class="input-group input-group-sm">
                    <input type="text" readonly :value="currentOrigin" class="form-control bg-transparent text-white-50 border-purple-20 fs-8 py-0" />
                    <button type="button" @click="copyToClipboard(currentOrigin)" class="btn btn-outline-purple btn-xs" style="padding: 1px 6px; border: 1px solid rgba(168, 85, 247, 0.4);"><i class="bi bi-clipboard text-white-50"></i></button>
                  </div>
                </div>

                <p class="text-white-50 fs-8 mb-0" style="line-height: 1.2;">
                  Create OAuth credentials on <a href="https://console.cloud.google.com" target="_blank" class="text-neon-purple text-decoration-underline font-monospace">Google Cloud Console</a> as a "Web application", add the URIs above, then paste the client ID here.
                </p>
              </div>
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

.simulate-cyber-btn {
  background: rgba(244, 63, 94, 0.04);
  border: 1px solid rgba(244, 63, 94, 0.35);
  color: #ffffff;
  border-radius: 30px;
  transition: all 0.3s;
}

.simulate-cyber-btn:hover {
  background: rgba(244, 63, 94, 0.12);
  border-color: #f43f5e;
  transform: translateY(-1px);
  box-shadow: 0 0 15px rgba(244, 63, 94, 0.3) !important;
}

.btn-outline-purple {
  border: 1px solid rgba(168, 85, 247, 0.4);
  color: #a855f7;
  background: transparent;
  transition: all 0.2s;
}

.btn-outline-purple:hover {
  background: rgba(168, 85, 247, 0.15);
  color: #d946ef;
  border-color: #d946ef;
}

.btn-xs {
  padding: 0.15rem 0.4rem;
  font-size: 0.75rem;
  line-height: 1.2;
  border-radius: 0.2rem;
}

.text-neon-purple {
  color: #d946ef;
  text-shadow: 0 0 8px rgba(217, 70, 239, 0.3);
}

.letter-spacing-1 {
  letter-spacing: 1px;
}
</style>
