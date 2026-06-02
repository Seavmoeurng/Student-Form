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
      toast.success('Student added successfully');
      
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
  <div class="student-form-card shadow-sm border-0 bg-white p-4 rounded-4">
    <h3 class="mb-4 text-primary fw-bold">Register Student</h3>

    <form @submit.prevent="addStudent" class="student-form">
      <div class="mb-3">
        <label class="form-label fw-semibold">Email address</label>
        <input type="email" v-model="student.email" required class="form-control" placeholder="example@email.com" />
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Password</label>
          <input type="password" v-model="student.password" required class="form-control" placeholder="••••••••" />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Confirm Password</label>
          <input type="password" v-model="student.confirmPassword" required class="form-control" placeholder="••••••••" />
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">First Name</label>
          <input type="text" v-model="student.firstName" required class="form-control" placeholder="First Name" />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Last Name</label>
          <input type="text" v-model="student.lastName" required class="form-control" placeholder="Last Name" />
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Gender</label>
          <select v-model="student.gender" class="form-select" required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Status</label>
          <select v-model="student.studentStatus" class="form-select" required>
            <option value="">Select Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
          </select>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Active</label>
          <select v-model="student.active" class="form-select" required>
            <option value="true">True (Active)</option>
            <option value="false">False (Inactive)</option>
          </select>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Score (0-100)</label>
          <input type="number" v-model="student.score" required class="form-control" min="0" max="100" placeholder="Score" />
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Date of Birth</label>
        <input type="date" v-model="student.DateOfBirth" required class="form-control" />
      </div>

      <button type="submit" class="btn btn-primary w-100 py-2.5 fw-semibold mt-3 shadow-sm">
        Add Student
      </button>
    </form>
  </div>
</template>

<style scoped>
.student-form-card {
  border-radius: 15px;
  background-color: #fff;
  transition: all 0.3s ease;
}

.student-form-card:hover {
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.08) !important;
}

.form-label {
  font-size: 0.9rem;
  color: #495057;
}

.form-control, .form-select {
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
  border: 1px solid #ced4da;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus, .form-select:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
}

.btn-primary {
  border-radius: 8px;
  background: linear-gradient(90deg, #0d6efd 0%, #0056b3 100%);
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3) !important;
}
</style>
