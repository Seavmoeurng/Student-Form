<template>
  <div class="card cyber-card shadow-lg border-0">
    <div class="card-body p-4">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h2 class="text-white fw-extrabold mb-0 list-title">STUDENT REGISTRY AUDIT</h2>
        <div class="d-flex align-items-center gap-3 flex-wrap">
          <!-- Page Size Selector -->
          <div class="d-flex align-items-center gap-2">
            <span class="text-white-50 small text-nowrap"><i class="bi bi-list-ol text-neon-pink"></i> Show:</span>
            <select v-model="itemsPerPage" @change="currentPage = 1" class="form-select select-cyber-sm">
              <option :value="20" class="dropdown-option">20</option>
              <option :value="40" class="dropdown-option">40</option>
              <option :value="100" class="dropdown-option">100</option>
            </select>
          </div>

          <!-- Sort Option Dropdown -->
          <div class="d-flex align-items-center gap-2">
            <span class="text-white-50 small text-nowrap"><i class="bi bi-sort-down text-neon-pink"></i> Sort:</span>
            <select v-model="sortBy" class="form-select select-cyber-sm">
              <option value="newest" class="dropdown-option">Newest Added</option>
              <option value="oldest" class="dropdown-option">Oldest Added</option>
              <option value="name-asc" class="dropdown-option">Name (A-Z)</option>
              <option value="name-desc" class="dropdown-option">Name (Z-A)</option>
            </select>
          </div>
          
          <button
            @click="fetchStudents"
            :disabled="loading"
            class="btn refresh-list-btn btn-sm px-3 text-white fw-bold"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-1 text-white"
            ></span>
            {{ loading ? "AUDITING..." : "REFRESH LOGS" }}
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead>
            <tr class="border-purple-20">
              <th style="width: 80px">ID</th>
              <th>Profile</th>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>Status</th>
              <th class="text-center">Action Console</th>
            </tr>
          </thead>
          <tbody>
            <!-- Loading State -->
            <tr v-if="loading">
              <td colspan="6" class="text-center py-5">
                <div class="spinner-border text-neon-pink" role="status"></div>
                <p class="mt-2 text-white-50">Auditing blockchain nodes...</p>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr
              v-for="(student, index) in paginatedStudents"
              :key="student._id || index"
              class="border-purple-10"
            >
              <td class="fw-bold text-white-50 font-monospace">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>
                <img
                  :src="getProfileImage(index)"
                  alt="Profile"
                  class="rounded-circle shadow-sm profile-image-cyber"
                />
              </td>
              <td class="fw-bold text-white">
                {{ student.firstName }} {{ student.lastName }}
              </td>
              <td class="text-white-50 font-monospace">{{ student.email }}</td>
              <td>
                <span
                  class="badge badge-cyber"
                  :style="student.active !== false ? 'background: rgba(0, 230, 118, 0.15); color: #00e676; border: 1px solid rgba(0, 230, 118, 0.3);' : 'background: rgba(244, 63, 94, 0.15); color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.3);'"
                >
                  {{ student.active !== false ? "ACTIVE" : "INACTIVE" }}
                </span>
              </td>
              <td class="text-center">
                <div class="d-flex justify-content-center gap-2">
                  <button
                    @click="editStudent(student)"
                    class="btn btn-sm btn-cyber-edit px-3"
                  >
                    <i class="bi bi-pencil-square"></i> EDIT
                  </button>

                  <button
                    @click="deleteStudent(student._id)"
                    class="btn btn-sm btn-cyber-delete px-3"
                  >
                    <i class="bi bi-trash"></i> DELETE
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="!loading && students.length === 0">
              <td colspan="6" class="text-center py-5 text-white-50">
                <i class="bi bi-people fs-1 text-neon-pink mb-2"></i>
                <p>No student registry nodes found in the database.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div v-if="sortedStudents.length > 0" class="d-flex flex-wrap justify-content-between align-items-center mt-4 pt-3 border-top border-purple-20 gap-3">
        <!-- Pagination Page Tabs and Arrows -->
        <nav v-if="totalPages > 1" aria-label="Page navigation">
          <ul class="pagination pagination-sm mb-0 align-items-center gap-1">
            <!-- Previous Arrow -->
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link shadow-none" @click="currentPage--" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>

            <!-- Page Number Tabs -->
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
              <button class="page-link shadow-none" @click="currentPage = page">{{ page }}</button>
            </li>

            <!-- Next Arrow -->
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link shadow-none" @click="currentPage++" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
        
        <!-- Info text -->
        <div class="text-white-50 small text-end flex-grow-1 font-monospace">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, sortedStudents.length) }} of {{ sortedStudents.length }} system logs
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();

// 1. Configuration & State
const students = ref([]);
const loading = ref(true);
const sortBy = ref("newest"); // Default sort: Newest Added on top
const currentPage = ref(1);
const itemsPerPage = ref(20); // Default to 20 per page
const url = "https://nodejsapi-wrcy.onrender.com/api/students";

// 2. Sorted Students computed property (list new added student on top by default)
const sortedStudents = computed(() => {
  let list = Array.isArray(students.value)
    ? students.value.filter(s => s && typeof s === 'object')
    : [];
  if (sortBy.value === "newest") {
    list.sort((a, b) => {
      if (a._id && b._id) return String(b._id).localeCompare(String(a._id));
      return 0;
    });
  } else if (sortBy.value === "oldest") {
    list.sort((a, b) => {
      if (a._id && b._id) return String(a._id).localeCompare(String(b._id));
      return 0;
    });
  } else if (sortBy.value === "name-asc") {
    list.sort((a, b) => {
      const nameA = `${a.firstName || ''} ${a.lastName || ''}`.trim().toLowerCase();
      const nameB = `${b.firstName || ''} ${b.lastName || ''}`.trim().toLowerCase();
      return nameA.localeCompare(nameB);
    });
  } else if (sortBy.value === "name-desc") {
    list.sort((a, b) => {
      const nameA = `${a.firstName || ''} ${a.lastName || ''}`.trim().toLowerCase();
      const nameB = `${b.firstName || ''} ${b.lastName || ''}`.trim().toLowerCase();
      return nameB.localeCompare(nameA);
    });
  }
  return list;
});

// 3. Computed properties for pagination
const totalPages = computed(() => {
  return Math.ceil(sortedStudents.value.length / itemsPerPage.value);
});

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sortedStudents.value.slice(start, end);
});

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
    toast.error("Unable to fetch data. Please check connection.");
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
    toast.error('No token found. Please log in first.');
    return;
  }

  try {
    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }
    const response = await axios.delete(`${url}/${id}`, config);
    if (response.status === 200 || response.status === 204) {
      toast.success('Student deleted successfully');
      fetchStudents(); // Refresh the list
    } else {
      toast.error('Failed to delete student');
    }
  } catch (error) {
    console.error("Delete Error:", error);
    toast.error(error.response?.data?.error || 'Error deleting student');
  }
};

// 6. Edit Student
const editStudent = (student) => {
  if (student && student._id) {
    router.push({ name: 'edit-student', params: { id: student._id } });
  } else {
    toast.error("Cannot edit: Student ID is missing");
  }
};

onMounted(() => {
  fetchStudents();
});

// Expose fetchStudents so parent components can refresh this list
defineExpose({
  fetchStudents
});
</script>

<style scoped>
.cyber-card {
  background: #121124;
  border: 1.5px solid rgba(168, 85, 247, 0.2);
  border-radius: 24px;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);
}

.list-title {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  letter-spacing: 0.5px;
  background: linear-gradient(90deg, #ffffff 0%, #d946ef 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-neon-pink {
  color: #f43f5e;
  text-shadow: 0 0 8px rgba(244, 63, 94, 0.4);
}

.border-purple-20 {
  border-color: rgba(168, 85, 247, 0.25) !important;
}

.border-purple-10 {
  border-color: rgba(168, 85, 247, 0.1) !important;
}

.profile-image-cyber {
  width: 42px;
  height: 42px;
  object-fit: cover;
  border: 2px solid rgba(168, 85, 247, 0.4);
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.25);
}

.badge-cyber {
  font-weight: 700;
  font-family: 'Space Grotesk', sans-serif;
  letter-spacing: 0.5px;
  padding: 0.45em 0.75em;
  font-size: 0.7rem;
  border-radius: 6px;
}

/* Custom dropdown select styling */
.select-cyber-sm {
  width: auto;
  min-width: 90px;
  background-color: rgba(7, 5, 14, 0.6);
  border: 1px solid rgba(168, 85, 247, 0.35);
  color: white;
  border-radius: 8px;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23d946ef' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
  font-size: 0.85rem;
  transition: all 0.3s;
}

.select-cyber-sm:focus {
  background-color: rgba(7, 5, 14, 0.8);
  border-color: #d946ef;
  color: white;
  box-shadow: 0 0 10px rgba(217, 70, 239, 0.25);
}

.dropdown-option {
  background-color: #121124;
  color: #ffffff;
}

.refresh-list-btn {
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 8px;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  transition: all 0.3s;
}

.refresh-list-btn:hover {
  background: rgba(168, 85, 247, 0.2);
  border-color: #d946ef;
}

/* Table styling */
.table {
  --bs-table-bg: transparent;
  --bs-table-color: #ffffff;
  --bs-table-hover-color: #ffffff;
  --bs-table-hover-bg: rgba(168, 85, 247, 0.08);
  --bs-table-border-color: rgba(168, 85, 247, 0.15);
}

thead th {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.9) !important;
  background-color: rgba(168, 85, 247, 0.05);
}

/* Action button consoles */
.btn-cyber-edit {
  background: rgba(0, 229, 255, 0.1);
  border: 1px solid rgba(0, 229, 255, 0.35);
  color: #00e5ff;
  font-weight: 700;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  transition: all 0.3s;
}

.btn-cyber-edit:hover {
  background: rgba(0, 229, 255, 0.2);
  border-color: #00e5ff;
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.3) !important;
  color: #ffffff;
}

.btn-cyber-delete {
  background: rgba(244, 63, 94, 0.1);
  border: 1px solid rgba(244, 63, 94, 0.35);
  color: #f43f5e;
  font-weight: 700;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  transition: all 0.3s;
}

.btn-cyber-delete:hover {
  background: rgba(244, 63, 94, 0.2);
  border-color: #f43f5e;
  box-shadow: 0 0 10px rgba(244, 63, 94, 0.3) !important;
  color: #ffffff;
}

/* Pagination custom deep purple design */
.pagination :deep(.page-link) {
  background-color: rgba(7, 5, 14, 0.6);
  border-color: rgba(168, 85, 247, 0.25);
  color: #9da2c0;
  border-radius: 6px;
  padding: 6px 12px;
}

.pagination :deep(.page-link:hover) {
  background-color: rgba(168, 85, 247, 0.1);
  color: #ffffff;
}

.pagination :deep(.page-item.active .page-link) {
  background: linear-gradient(135deg, #a855f7 0%, #d946ef 100%);
  border: none;
  color: #ffffff;
  font-weight: bold;
  box-shadow: 0 0 10px rgba(217, 70, 239, 0.3);
}

.pagination :deep(.page-item.disabled .page-link) {
  background-color: rgba(7, 5, 14, 0.3);
  border-color: rgba(168, 85, 247, 0.1);
  color: rgba(255, 255, 255, 0.15);
}
</style>
