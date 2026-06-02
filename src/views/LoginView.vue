<script setup>
import { ref } from 'vue';
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
</script>

<template>
    <div class="login-container d-flex align-items-center justify-content-center">
        <div class="login-wrapper w-100">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-xl-10 col-lg-12">
                        <div class="card login-card shadow-lg border-0 overflow-hidden">
                            <div class="row g-0">
                                <!-- Left side with illustration -->
                                <div class="col-lg-6 d-none d-lg-block bg-image-container">
                                    <img src="@/assets/login-illustration.jpg" alt="Login Illustration" class="login-illustration" />
                                    <div class="overlay">
                                        <div class="overlay-content text-white p-5 text-center">
                                            <h2 class="fw-bold mb-3">Welcome to Student App</h2>
                                            <p class="lead">Manage your student information easily and efficiently.</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Right side with form -->
                                <div class="col-lg-6">
                                    <div class="card-body p-4 p-md-5">
                                        <div class="text-center mb-4">
                                            <img src="@/assets/logo.jpg" alt="Logo" class="login-logo mb-3 shadow-sm" />
                                            <h2 class="fw-bold text-primary">Welcome Back</h2>
                                            <p class="text-muted">Login to manage your students</p>
                                        </div>
                                        
                                        <form @submit.prevent="handleLogin">
                                            <div class="mb-4">
                                                <label class="form-label fw-semibold">Email Address</label>
                                                <div class="input-group">
                                                    <span class="input-group-text bg-light border-end-0">
                                                        <i class="bi bi-envelope text-muted"></i>
                                                    </span>
                                                    <input 
                                                        type="email" 
                                                        v-model="credentials.email" 
                                                        class="form-control bg-light border-start-0" 
                                                        placeholder="name@example.com"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div class="mb-4">
                                                <label class="form-label fw-semibold">Password</label>
                                                <div class="input-group">
                                                    <span class="input-group-text bg-light border-end-0">
                                                        <i class="bi bi-lock text-muted"></i>
                                                    </span>
                                                    <input 
                                                        type="password" 
                                                        v-model="credentials.password" 
                                                        class="form-control bg-light border-start-0" 
                                                        placeholder="••••••••"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div class="d-grid gap-2 mt-5">
                                                <button 
                                                    type="submit" 
                                                    class="btn btn-primary btn-lg shadow-sm"
                                                    :disabled="loading"
                                                >
                                                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                                                    {{ loading ? 'Signing in...' : 'Sign In' }}
                                                </button>
                                            </div>
                                        </form>
                                        
                                        <div class="text-center mt-4">
                                            <p class="text-muted small">Don't have an account? <router-link to="/add-student" class="text-primary fw-bold text-decoration-none hover-scale">Register here</router-link></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-container {
    min-height: calc(100vh - 56px);
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 20px 0;
}

.login-card {
    border-radius: 20px;
    background: #ffffff;
}

.bg-image-container {
    position: relative;
    overflow: hidden;
    background-color: #0d6efd;
}

.login-illustration {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.5s ease;
}

.bg-image-container:hover .login-illustration {
    transform: scale(1.05);
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(13, 110, 253, 0.4), rgba(0, 51, 153, 0.8));
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-logo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #fff;
}

.input-group-text {
    border-radius: 10px 0 0 10px;
}

.form-control {
    border-radius: 0 10px 10px 0;
    padding: 12px;
}

.form-control:focus {
    box-shadow: none;
    border-color: #dee2e6;
    background-color: #fff !important;
}

.btn-primary {
    border-radius: 10px;
    padding: 12px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(13, 110, 253, 0.3);
}

.hover-scale {
    display: inline-block;
    transition: transform 0.2s ease;
}

.hover-scale:hover {
    transform: scale(1.05);
}
</style>
