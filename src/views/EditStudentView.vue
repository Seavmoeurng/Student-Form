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
  <div class="cyber-edit-page d-flex align-items-center justify-content-center min-vh-100 py-5">
    
    <!-- Cyberpunk Edit Card -->
    <div class="card cyber-card shadow-lg border-0 p-4 p-md-5">
      
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="text-white fw-extrabold m-0 fs-3 system-form-title">EDIT STUDENT NODE</h2>
        <router-link to="/students" class="btn back-btn-cyber px-3 py-1.5 rounded-3 d-flex align-items-center gap-1">
          <i class="bi bi-arrow-left text-white"></i>
          <span class="text-white small">Back</span>
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-neon-pink" role="status"></div>
        <p class="mt-2 text-white-50">Configuring neural links...</p>
      </div>

      <form v-else @submit.prevent="updateStudent" class="student-form scrollable-form-fields">
        
        <!-- Email address (White Underline) -->
        <div class="input-line-group mb-4">
          <label class="form-label-cyber">SYSTEM EMAIL</label>
          <input 
            type="email" 
            v-model="student.email" 
            required 
            class="input-line-cyber" 
            placeholder="Email address" 
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

        <!-- Gender / Status (Side by Side select) -->
        <div class="row g-3">
          <div class="col-6 mb-4">
            <div class="input-line-group">
              <label class="form-label-cyber">GENDER</label>
              <select v-model="student.gender" class="select-line-cyber" required>
                <option value="" disabled>Gender</option>
                <option value="Male" class="dropdown-option">Male</option>
                <option value="Female" class="dropdown-option">Female</option>
              </select>
            </div>
          </div>
          <div class="col-6 mb-4">
            <div class="input-line-group">
              <label class="form-label-cyber">STATUS</label>
              <select v-model="student.studentStatus" class="select-line-cyber" required>
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
              <label class="form-label-cyber">ACTIVE NODE</label>
              <select v-model="student.active" class="select-line-cyber" required>
                <option value="true" class="dropdown-option">True (Active)</option>
                <option value="false" class="dropdown-option">False (Inactive)</option>
              </select>
            </div>
          </div>
          <div class="col-6 mb-4">
            <div class="input-line-group">
              <label class="form-label-cyber">SCORE (0-100)</label>
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

        <!-- Pill Shaped Update Button -->
        <button type="submit" class="btn update-cyber-btn w-100 py-2.5 shadow-sm">
          UPDATE SYSTEM NODE
        </button>

      </form>
    </div>
  </div>
</template>

<style scoped>
.cyber-edit-page {
  background: transparent;
  width: 100%;
}

.cyber-card {
  width: 100%;
  max-width: 520px;
  background: rgba(18, 17, 34, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1.5px solid rgba(168, 85, 247, 0.3);
  border-radius: 28px;
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.15) !important;
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

/* Custom Select styling to stay flat and white */
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
  background-color: #121124; /* Dark background so options are readable */
  color: #ffffff;
}

/* Date picker customization */
.date-input-cyber {
  color-scheme: dark;
}

/* Back button */
.back-btn-cyber {
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.3);
  transition: all 0.3s;
}

.back-btn-cyber:hover {
  background: rgba(168, 85, 247, 0.2);
  border-color: #d946ef;
}

/* Pill-shaped Button */
.update-cyber-btn {
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

.update-cyber-btn:hover {
  background: linear-gradient(135deg, #b866ff 0%, #e956ff 100%);
  box-shadow: 0 0 25px rgba(217, 70, 239, 0.5) !important;
  transform: translateY(-1px);
  color: #ffffff;
}
</style>
