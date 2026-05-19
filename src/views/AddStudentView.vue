<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

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
  let passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\|`~-]).{8,}$/;

  if (!passwordPattern.test(student.value.password)) {
    toast.error('Password must be strong!!!');
    return;
  }

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
    
    // Ensure active is sent as a boolean if the API expects it, 
    // or keep as string if that's what the user's form provides.
    // Given the previous version, I'll send the payload as is (minus confirmPassword).
    
    const response = await axios.post(url, payload);
    
    if (response.status === 201 || response.status === 200) {
      toast.success('Student added successfully');
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
  <div class="container mt-3">
    <h3 class="mb-4">Add new Student</h3>

    <form @submit.prevent="addStudent" class="student-form">
      <div class="mb-3 row">
        <label class="col-sm-3 col-form-label">Email:</label>
        <div class="col-sm-6">
          <input type="email" v-model="student.email" required class="form-control" />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-3 col-form-label">Password:</label>
        <div class="col-sm-6">
          <input type="password" v-model="student.password" required class="form-control" />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-3 col-form-label">Confirm Password:</label>
        <div class="col-sm-6">
          <input type="password" v-model="student.confirmPassword" required class="form-control" />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-3 col-form-label">First Name:</label>
        <div class="col-sm-6">
          <input type="text" v-model="student.firstName" required class="form-control" />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-3 col-form-label">Last Name:</label>
        <div class="col-sm-6">
          <input type="text" v-model="student.lastName" required class="form-control" />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-3 col-form-label">Gender:</label>
        <div class="col-sm-6">
          <select v-model="student.gender" class="form-select" required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-3 col-form-label">Status:</label>
        <div class="col-sm-6">
          <select v-model="student.studentStatus" class="form-select" required>
            <option value="">Select Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
          </select>
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-3 col-form-label">Active:</label>
        <div class="col-sm-6">
          <select v-model="student.active" class="form-select" required>
            <option value="true">True (Active)</option>
            <option value="false">False (Inactive)</option>
          </select>
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-3 col-form-label">Score:</label>
        <div class="col-sm-6">
          <input type="number" v-model="student.score" required class="form-control" min="0" max="100" />
        </div>
      </div>

      <div class="mb-3 row">
        <label class="col-sm-3 col-form-label">Date of Birth:</label>
        <div class="col-sm-6">
          <input type="date" v-model="student.DateOfBirth" required class="form-control" />
        </div>
      </div>

      <div class="row">
        <div class="col-sm-3"></div>
        <div class="col-sm-6">
          <button type="submit" class="btn btn-primary px-4">Add Student</button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.student-form {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}
</style>