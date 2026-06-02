<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const studentId = route.params.id;

const student = ref({
  email: '',
  firstName: '',
  lastName: '',
  gender: '',
  studentStatus: '',
  active: 'true',
  score: null,
  DateOfBirth: ''
});

const loading = ref(true);

const fetchStudentData = async () => {
  try {
    const url = `https://nodejsapi-wrcy.onrender.com/api/students/${studentId}`;
    const response = await axios.get(url);
    if (response.data) {
      const data = response.data;
      // Map data to ref
      student.value = {
        email: data.email || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        gender: data.gender || '',
        studentStatus: data.studentStatus || '',
        active: String(data.active),
        score: data.score || 0,
        DateOfBirth: data.DateOfBirth ? data.DateOfBirth.split('T')[0] : ''
      };
    }
  } catch (error) {
    console.error('Error fetching student:', error);
    toast.error('Failed to load student data');
  } finally {
    loading.value = false;
  }
};

const updateStudent = async () => {
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

  try {
    const url = `https://nodejsapi-wrcy.onrender.com/api/students/${studentId}`;
    const token = localStorage.getItem('token');
    
    if (!token) {
        toast.error('You must be logged in to edit a student');
        return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.put(url, student.value, config);
    
    if (response.status === 200 || response.status === 204) {
      toast.success('Student updated successfully');
      router.push('/students');
    } else {
      toast.error('Failed to update student');
    }
  } catch (error) {
    console.error('Error updating student:', error);
    toast.error(error.response?.data?.message || 'Failed to update student');
  }
};

onMounted(() => {
  fetchStudentData();
});
</script>

<template>
  <div class="purple-edit-page d-flex align-items-center justify-content-center min-vh-100 py-5">
    
    <!-- Glassmorphic Edit Card -->
    <div class="card glass-edit-card shadow-lg border-0 p-4 p-md-5">
      
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="text-white fw-bold m-0 fs-3">Edit Student</h2>
        <router-link to="/students" class="btn back-btn px-3 py-1.5 rounded-3 d-flex align-items-center gap-1">
          <i class="bi bi-arrow-left text-white"></i>
          <span class="text-white small">Back</span>
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-white" role="status"></div>
        <p class="mt-2 text-white-50">Loading student details...</p>
      </div>

      <form v-else @submit.prevent="updateStudent" class="student-form scrollable-form-fields">
        
        <!-- Email address (White Underline) -->
        <div class="input-line-group mb-4">
          <label class="input-label small opacity-75 text-white mb-1 d-block">Email address</label>
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
              <label class="input-label small opacity-75 text-white mb-1 d-block">First Name</label>
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
              <label class="input-label small opacity-75 text-white mb-1 d-block">Last Name</label>
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

        <!-- Gender / Status (Side by Side select) -->
        <div class="row g-3">
          <div class="col-6 mb-4">
            <div class="input-line-group">
              <label class="input-label small opacity-75 text-white mb-1 d-block">Gender</label>
              <select v-model="student.gender" class="select-line-white" required>
                <option value="" disabled>Gender</option>
                <option value="Male" class="dropdown-option">Male</option>
                <option value="Female" class="dropdown-option">Female</option>
              </select>
            </div>
          </div>
          <div class="col-6 mb-4">
            <div class="input-line-group">
              <label class="input-label small opacity-75 text-white mb-1 d-block">Status</label>
              <select v-model="student.studentStatus" class="select-line-white" required>
                <option value="" disabled>Status</option>
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
              <label class="input-label small opacity-75 text-white mb-1 d-block">Active</label>
              <select v-model="student.active" class="select-line-white" required>
                <option value="true" class="dropdown-option">True (Active)</option>
                <option value="false" class="dropdown-option">False (Inactive)</option>
              </select>
            </div>
          </div>
          <div class="col-6 mb-4">
            <div class="input-line-group">
              <label class="input-label small opacity-75 text-white mb-1 d-block">Score (0-100)</label>
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

        <!-- Pill Shaped Update Button -->
        <button type="submit" class="btn update-pill-btn w-100 py-2.5 shadow-sm">
          Update Student
        </button>

      </form>
    </div>
  </div>
</template>

<style scoped>
.purple-edit-page {
  background: transparent;
  width: 100%;
}

.glass-edit-card {
  width: 100%;
  max-width: 520px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  border-radius: 28px;
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

/* Line Inputs styled to match StudentForm */
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
  color-scheme: dark;
}

/* Back button */
.back-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.35);
}

/* Pill-shaped Button */
.update-pill-btn {
  background-color: #ffffff;
  color: #511874; /* deep purple text */
  border: none;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2) !important;
}

.update-pill-btn:hover {
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 6px 18px rgba(255, 255, 255, 0.35) !important;
  transform: translateY(-1px);
  color: #511874;
}
</style>
