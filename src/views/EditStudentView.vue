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
  <div class="container mt-3">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h3>Edit Student</h3>
        <router-link to="/students" class="btn btn-outline-secondary">Back to List</router-link>
    </div>

    <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">Loading student details...</p>
    </div>

    <form v-else @submit.prevent="updateStudent" class="student-form">
      <div class="mb-3 row">
        <label class="col-sm-3 col-form-label">Email:</label>
        <div class="col-sm-6">
          <input type="email" v-model="student.email" required class="form-control" />
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
          <button type="submit" class="btn btn-info text-white px-4">Update Student</button>
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
