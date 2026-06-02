<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const emit = defineEmits(['student-added']);

const student = ref({
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  gender: '',
  studentStatus: '',
  active: 'true',
  score: null,
  DateOfBirth: ''
});

const toast = useToast();

const addStudent = async () => {
  if (student.value.password !== student.value.confirmPassword) {
    toast.error('Passwords do not match');
    return;
  }

  if (student.value.gender !== 'Male' && student.value.gender !== 'Female') {
    toast.error('Gender must be either Male or Female');
    return;
  }

  if (student.value.studentStatus !== 'Single' && student.value.studentStatus !== 'Married') {
    toast.error('Status must be either Single or Married');
    return;
  }

  if (student.value.score < 0 || student.value.score > 100) {
    toast.error('Score must be between 0 and 100');
    return;
  }

  if (student.value.DateOfBirth > new Date().toISOString().split('T')[0]) {
    toast.error('Date of Birth cannot be in the future');
    return;
  }

  try {
    const url = 'https://nodejsapi-wrcy.onrender.com/api/auth/register';
    // Create a copy of the student data and remove confirmPassword before sending to API
    const { confirmPassword, ...payload } = student.value;
    
    const response = await axios.post(url, payload);
    
    if (response.status === 201 || response.status === 200) {
      toast.success('Student registered successfully');
      
      // Emit event so parent component can react
      emit('student-added');

      // Reset form
      student.value = {
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        gender: '',
        studentStatus: '',
        active: 'true',
        score: null,
        DateOfBirth: ''
      };
    } else {
      toast.error('Failed to insert a new student');
    }
  } catch (error) {
    console.error('Error adding student:', error);
    toast.error(error.response?.data?.message || 'Failed to add student');
  }
}
</script>

<template>
  <div class="student-register-container">
    <h2 class="mb-4 text-white fw-bold text-start fs-3">Create Your Account</h2>

    <form @submit.prevent="addStudent" class="student-form scrollable-form-fields">
      
      <!-- Email address (White Underline) -->
      <div class="input-line-group mb-4">
        <input 
          type="email" 
          v-model="student.email" 
          required 
          class="input-line-white" 
          placeholder="Email address" 
        />
      </div>

      <!-- First Name / Last Name (Side by Side) -->
      <div class="row g-3">
        <div class="col-6 mb-4">
          <div class="input-line-group">
            <input 
              type="text" 
              v-model="student.firstName" 
              required 
              class="input-line-white" 
              placeholder="First Name" 
            />
          </div>
        </div>
        <div class="col-6 mb-4">
          <div class="input-line-group">
            <input 
              type="text" 
              v-model="student.lastName" 
              required 
              class="input-line-white" 
              placeholder="Last Name" 
            />
          </div>
        </div>
      </div>

      <!-- Password / Confirm Password (Side by side) -->
      <div class="row g-3">
        <div class="col-6 mb-4">
          <div class="input-line-group">
            <input 
              type="password" 
              v-model="student.password" 
              required 
              class="input-line-white" 
              placeholder="Password" 
            />
          </div>
        </div>
        <div class="col-6 mb-4">
          <div class="input-line-group">
            <input 
              type="password" 
              v-model="student.confirmPassword" 
              required 
              class="input-line-white" 
              placeholder="Confirm Password" 
            />
          </div>
        </div>
      </div>

      <!-- Gender / Status (Side by Side select) -->
      <div class="row g-3">
        <div class="col-6 mb-4">
          <div class="input-line-group">
            <select v-model="student.gender" class="select-line-white" required>
              <option value="" disabled selected>Gender</option>
              <option value="Male" class="dropdown-option">Male</option>
              <option value="Female" class="dropdown-option">Female</option>
            </select>
          </div>
        </div>
        <div class="col-6 mb-4">
          <div class="input-line-group">
            <select v-model="student.studentStatus" class="select-line-white" required>
              <option value="" disabled selected>Status</option>
              <option value="Single" class="dropdown-option">Single</option>
              <option value="Married" class="dropdown-option">Married</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Active / Score (Side by Side) -->
      <div class="row g-3">
        <div class="col-6 mb-4">
          <div class="input-line-group">
            <select v-model="student.active" class="select-line-white" required>
              <option value="true" class="dropdown-option">True (Active)</option>
              <option value="false" class="dropdown-option">False (Inactive)</option>
            </select>
          </div>
        </div>
        <div class="col-6 mb-4">
          <div class="input-line-group">
            <input 
              type="number" 
              v-model="student.score" 
              required 
              class="input-line-white" 
              min="0" 
              max="100" 
              placeholder="Score (0-100)" 
            />
          </div>
        </div>
      </div>

      <!-- Date of Birth -->
      <div class="input-line-group mb-5">
        <label class="date-label small opacity-75 text-white mb-1 d-block">Date of Birth</label>
        <input 
          type="date" 
          v-model="student.DateOfBirth" 
          required 
          class="input-line-white date-input-white" 
        />
      </div>

      <!-- Pill Shaped Sign Up Button -->
      <button type="submit" class="btn sign-up-pill-btn w-100 py-2.5 shadow-sm">
        Sign up
      </button>

    </form>
  </div>
</template>

<style scoped>
.student-register-container {
  width: 100%;
}

.scrollable-form-fields {
  max-height: 480px;
  overflow-y: auto;
  padding-right: 8px;
}

/* Custom Scrollbar for better UI inside the mobile-frame card */
.scrollable-form-fields::-webkit-scrollbar {
  width: 4px;
}
.scrollable-form-fields::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.scrollable-form-fields::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

/* Line Inputs styled to match Mockup Screen 3 */
.input-line-group {
  position: relative;
  width: 100%;
}

.input-line-white {
  width: 100%;
  border: none;
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.4);
  background: transparent;
  padding: 8px 0;
  color: #ffffff;
  font-size: 0.95rem;
  transition: all 0.3s;
  outline: none;
}

.input-line-white::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.input-line-white:focus {
  border-bottom-color: #00d2ff;
}

/* Custom Select styling to stay flat and white */
.select-line-white {
  width: 100%;
  border: none;
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.4);
  background: transparent;
  padding: 8px 0;
  color: #ffffff;
  font-size: 0.95rem;
  transition: all 0.3s;
  outline: none;
}

.select-line-white:focus {
  border-bottom-color: #00d2ff;
}

.dropdown-option {
  background-color: #002266; /* Dark background so options are readable */
  color: #ffffff;
}

/* Date picker customization */
.date-input-white {
  color-scheme: dark; /* Makes the native date browser popup dark themed and text white */
}

/* Sign up Pill-shaped Button in Mockup */
.sign-up-pill-btn {
  background-color: #ffffff;
  color: #511874; /* deep purple text */
  border: none;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2) !important;
}

.sign-up-pill-btn:hover {
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 6px 18px rgba(255, 255, 255, 0.35) !important;
  transform: translateY(-1px);
  color: #511874;
}
</style>
