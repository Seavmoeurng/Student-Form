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
    <h2 class="mb-4 text-white fw-extrabold text-start fs-3 system-form-title">REGISTER SYSTEM IDENTITY</h2>

    <form @submit.prevent="addStudent" class="student-form scrollable-form-fields">
      
      <!-- Email address (White Underline) -->
      <div class="input-line-group mb-4">
        <label class="form-label-cyber">SYSTEM EMAIL</label>
        <input 
          type="email" 
          v-model="student.email" 
          required 
          class="input-line-cyber" 
          placeholder="Enter system email" 
        />
      </div>

      <!-- First Name / Last Name (Side by Side) -->
      <div class="row g-3">
        <div class="col-6 mb-4">
          <div class="input-line-group">
            <label class="form-label-cyber">FIRST NAME</label>
            <input 
              type="text" 
              v-model="student.firstName" 
              required 
              class="input-line-cyber" 
              placeholder="First Name" 
            />
          </div>
        </div>
        <div class="col-6 mb-4">
          <div class="input-line-group">
            <label class="form-label-cyber">LAST NAME</label>
            <input 
              type="text" 
              v-model="student.lastName" 
              required 
              class="input-line-cyber" 
              placeholder="Last Name" 
            />
          </div>
        </div>
      </div>

      <!-- Password / Confirm Password (Side by side) -->
      <div class="row g-3">
        <div class="col-6 mb-4">
          <div class="input-line-group">
            <label class="form-label-cyber">SECURITY PASSWORD</label>
            <input 
              type="password" 
              v-model="student.password" 
              required 
              class="input-line-cyber" 
              placeholder="Password" 
            />
          </div>
        </div>
        <div class="col-6 mb-4">
          <div class="input-line-group">
            <label class="form-label-cyber">CONFIRM PASSWORD</label>
            <input 
              type="password" 
              v-model="student.confirmPassword" 
              required 
              class="input-line-cyber" 
              placeholder="Confirm Password" 
            />
          </div>
        </div>
      </div>

      <!-- Gender / Status (Side by Side select) -->
      <div class="row g-3">
        <div class="col-6 mb-4">
          <div class="input-line-group">
            <label class="form-label-cyber">IDENTITY GENDER</label>
            <select v-model="student.gender" class="select-line-cyber" required>
              <option value="" disabled selected>Select Gender</option>
              <option value="Male" class="dropdown-option">Male</option>
              <option value="Female" class="dropdown-option">Female</option>
            </select>
          </div>
        </div>
        <div class="col-6 mb-4">
          <div class="input-line-group">
            <label class="form-label-cyber">CIVIL STATUS</label>
            <select v-model="student.studentStatus" class="select-line-cyber" required>
              <option value="" disabled selected>Select Status</option>
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
            <label class="form-label-cyber">SYSTEM STATUS</label>
            <select v-model="student.active" class="select-line-cyber" required>
              <option value="true" class="dropdown-option">True (Active)</option>
              <option value="false" class="dropdown-option">False (Inactive)</option>
            </select>
          </div>
        </div>
        <div class="col-6 mb-4">
          <div class="input-line-group">
            <label class="form-label-cyber">ACADEMIC SCORE (0-100)</label>
            <input 
              type="number" 
              v-model="student.score" 
              required 
              class="input-line-cyber" 
              min="0" 
              max="100" 
              placeholder="Score (0-100)" 
            />
          </div>
        </div>
      </div>

      <!-- Date of Birth -->
      <div class="input-line-group mb-5">
        <label class="form-label-cyber">DATE OF BIRTH</label>
        <input 
          type="date" 
          v-model="student.DateOfBirth" 
          required 
          class="input-line-cyber date-input-cyber" 
        />
      </div>

      <!-- Pill Shaped Sign Up Button -->
      <button type="submit" class="btn sign-up-pill-btn w-100 py-2.5 shadow-sm">
        INITIALIZE REGISTRATION
      </button>

    </form>
  </div>
</template>

<style scoped>
.student-register-container {
  width: 100%;
}

.system-form-title {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  letter-spacing: 0.5px;
  background: linear-gradient(90deg, #ffffff 0%, #d946ef 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.scrollable-form-fields {
  max-height: 480px;
  overflow-y: auto;
  padding-right: 8px;
}

/* Custom Scrollbar */
.scrollable-form-fields::-webkit-scrollbar {
  width: 4px;
}
.scrollable-form-fields::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.scrollable-form-fields::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.3);
  border-radius: 10px;
}
.scrollable-form-fields::-webkit-scrollbar-thumb:hover {
  background: rgba(217, 70, 239, 0.6);
}

.form-label-cyber {
  font-family: 'Space Grotesk', sans-serif;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 2px;
  display: block;
  letter-spacing: 0.5px;
}

/* Line Inputs styled to match Mockup */
.input-line-group {
  position: relative;
  width: 100%;
}

.input-line-cyber {
  width: 100%;
  border: none;
  border-bottom: 1.5px solid rgba(168, 85, 247, 0.35);
  background: transparent;
  padding: 6px 0;
  color: #ffffff;
  font-size: 0.95rem;
  transition: all 0.3s;
  outline: none;
}

.input-line-cyber::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.input-line-cyber:focus {
  border-bottom-color: #d946ef;
}

/* Custom Select styling to stay flat and cyber */
.select-line-cyber {
  width: 100%;
  border: none;
  border-bottom: 1.5px solid rgba(168, 85, 247, 0.35);
  background: transparent;
  padding: 6px 0;
  color: #ffffff;
  font-size: 0.95rem;
  transition: all 0.3s;
  outline: none;
}

.select-line-cyber:focus {
  border-bottom-color: #d946ef;
}

.dropdown-option {
  background-color: #121124; /* Dark void color matching cards */
  color: #ffffff;
}

/* Date picker customization */
.date-input-cyber {
  color-scheme: dark;
}

/* Sign up Pill-shaped Button in Mockup */
.sign-up-pill-btn {
  background: linear-gradient(135deg, #a855f7 0%, #d946ef 100%);
  color: #ffffff;
  border: none;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.3) !important;
  letter-spacing: 0.5px;
}

.sign-up-pill-btn:hover {
  background: linear-gradient(135deg, #b866ff 0%, #e956ff 100%);
  box-shadow: 0 0 25px rgba(217, 70, 239, 0.5) !important;
  transform: translateY(-1px);
  color: #ffffff;
}
</style>
