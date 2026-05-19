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
            router.push('/students');
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
        <div class="login-card card shadow-lg border-0">
            <div class="card-body p-5">
                <div class="text-center mb-4">
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
                    <p class="text-muted small">Don't have an account? <router-link to="/add-student" class="text-primary fw-bold text-decoration-none">Register here</router-link></p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-container {
    min-height: calc(100vh - 56px);
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 20px;
}

.login-card {
    width: 100%;
    max-width: 450px;
    border-radius: 20px;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.9);
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
</style>
