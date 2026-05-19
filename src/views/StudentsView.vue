<template>
  <div class="container mt-4">
    <div class="card shadow-sm border-0">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="text-primary fw-bold mb-0">Student Management</h2>
          <button
            @click="fetchStudents"
            :disabled="loading"
            class="btn btn-primary btn-sm px-3"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-1"
            ></span>
            {{ loading ? "Updating..." : "Refresh List" }}
          </button>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle border">
            <thead class="table-primary">
              <tr>
                <th style="width: 80px">ID</th>
                <th>Profile</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Status</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <!-- Loading State -->
              <tr v-if="loading">
                <td colspan="6" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status"></div>
                  <p class="mt-2 text-muted">Loading student data...</p>
                </td>
              </tr>

              <!-- Data Rows -->
              <tr
                v-for="(student, index) in students"
                :key="student._id || index"
              >
                <td class="fw-bold text-muted">{{ index + 1 }}</td>
                <td>
                  <img
                    :src="getProfileImage(index)"
                    alt="Profile"
                    class="rounded-circle shadow-sm border"
                    style="width: 45px; height: 45px; object-fit: cover"
                  />
                </td>
                <td class="fw-semibold">
                  {{ student.firstName }} {{ student.lastName }}
                </td>
                <td>{{ student.email }}</td>
                <td>
                  <span
                    :class="
                      student.active !== false
                        ? 'badge bg-success'
                        : 'badge bg-danger'
                    "
                  >
                    {{ student.active !== false ? "Active" : "Inactive" }}
                  </span>
                </td>
                <td class="text-center">
                  <div class="d-flex justify-content-center gap-2">
                    <button
                      @click="editStudent(student)"
                      class="btn btn-sm btn-info text-white px-3 shadow-sm"
                    >
                      <i class="bi bi-pencil-square"></i> Edit
                    </button>

                    <button
                      @click="deleteStudent(student._id)"
                      class="btn btn-sm btn-danger px-3 shadow-sm"
                    >
                      <i class="bi bi-trash"></i> Delete
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="!loading && students.length === 0">
                <td colspan="6" class="text-center py-5 text-muted">
                  <i class="bi bi-people fs-1"></i>
                  <p>No students found in the database.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

// 1. Configuration & State
const students = ref([]);
const loading = ref(true);
const url = "https://nodejsapi-wrcy.onrender.com/api/students";

// 2. Image Library (Your provided URLs)
const profileImages = [
  "https://t3.ftcdn.net/jpg/16/06/80/78/360_F_1606807867_RlJNJoHBniGLT1a88UuAIfkEnALRwUoW.jpg",
  "https://img.freepik.com/free-photo/front-view-lawyer-portrait_23-2151202433.jpg?semt=ais_hybrid&w=740&q=80",
  "https://t4.ftcdn.net/jpg/07/89/65/59/360_F_789655932_ROzqiDLt4ea1sE3eks0LWyuYnkuZCata.jpg",
  "https://img.freepik.com/free-photo/closeup-young-female-professional-making-eye-contact-against-colored-background_662251-651.jpg?semt=ais_hybrid&w=740&q=80",
  "https://thumbs.dreamstime.com/b/profile-picture-caucasian-male-employee-posing-office-happy-young-worker-look-camera-workplace-headshot-portrait-smiling-190186649.jpg",
  "https://img.freepik.com/free-photo/close-up-portrait-young-bearded-man-white-shirt-jacket-posing-camera-with-broad-smile-isolated-gray_171337-629.jpg?semt=ais_hybrid&w=740&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=388&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1699899657680-421c2c2d5064?q=80&w=870&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1562788869-4ed32648eb72?q=80&w=872&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=387&auto=format&fit=crop",
];

// 3. Helper to pick an image based on index
const getProfileImage = (index) => {
  return profileImages[index % profileImages.length];
};

// 4. Fetch Data
const fetchStudents = async () => {
  loading.value = true;
  try {
    const response = await axios.get(url);
    students.value = Array.isArray(response.data)
      ? response.data
      : response.data.data || [];
  } catch (error) {
    console.error("API Error:", error);
    alert("Unable to fetch data. Please check connection.");
  } finally {
    loading.value = false;
  }
};

// 5. Delete Student
const deleteStudent = async (id) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  };

  if (!token) {
    alert('No token found. Please log in first.');
    return;
  }

  try {
    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }
    const response = await axios.delete(`${url}/${id}`, config);
    if (response.status === 200 || response.status === 204) {
      alert('Student deleted successfully');
      fetchStudents(); // Refresh the list
    } else {
      alert('Failed to delete student');
    }
  } catch (error) {
    console.error("Delete Error:", error);
    alert(error.response?.data?.error || 'Error deleting student');
    // If unauthorized, you might want to redirect:
    // window.location.href = '/login'; 
  }
};

// 6. Edit Student
const editStudent = (student) => {
  if (student && student._id) {
    router.push({ name: 'edit-student', params: { id: student._id } });
  } else {
    alert("Cannot edit: Student ID is missing");
  }
};

onMounted(() => {
  fetchStudents();
});
</script>


<style scoped>
.table-hover tbody tr:hover {
  background-color: #f1f4f9;
  transition: all 0.2s ease;
}

.badge {
  font-weight: 500;
  padding: 0.5em 0.75em;
}

.card {
  border-radius: 15px;
  overflow: hidden;
}

thead th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}
</style>
