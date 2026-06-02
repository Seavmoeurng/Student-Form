<template>
  <div class="home-page min-vh-100 pb-5">
    <div class="container-fluid px-lg-5 px-4 pt-4">
      
      <!-- Dashboard Title Block -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <span class="dashboard-badge-title px-4 py-2.5 fw-bold fs-5 shadow-sm text-white border-0">
          Student Dashboard
        </span>
        <button @click="fetchDashboardData" :disabled="loading" class="btn refresh-btn btn-sm px-3 rounded-3 shadow-sm">
          <span v-if="loading" class="spinner-border spinner-border-sm me-1 text-white"></span>
          <i v-else class="bi bi-arrow-clockwise me-1 text-white"></i> <span class="text-white">Refresh Stats</span>
        </button>
      </div>

      <!-- Loading Overlay for Stats -->
      <div v-if="loading && students.length === 0" class="d-flex justify-content-center align-items-center py-5 my-5">
        <div class="spinner-border text-white" style="width: 3rem; height: 3rem;" role="status"></div>
        <span class="ms-3 text-white opacity-75 fs-5">Calculating statistics...</span>
      </div>

      <div v-else>
        <!-- Stats Cards Grid -->
        <div class="row g-4 mb-4">
          <!-- Total Students -->
          <div class="col-xl-3 col-md-6">
            <div class="card glass-dashboard-card shadow-sm border-0 rounded-4 overflow-hidden h-100 dashboard-card" style="border-left: 4px solid #00d2ff !important;">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="text-uppercase text-white-50 fw-bold mb-1 fs-7">Total Students</h6>
                    <h2 class="fw-bold mb-0 text-white">{{ stats.total }}</h2>
                  </div>
                  <div class="card-icon p-3 rounded-4" style="background: rgba(0, 210, 255, 0.15); color: #00d2ff;">
                    <i class="bi bi-people fs-3"></i>
                  </div>
                </div>
                <div class="mt-3 fs-7 text-white-50">
                  <i class="bi bi-graph-up text-success"></i> Registered in portal database
                </div>
              </div>
            </div>
          </div>

          <!-- Active & Inactive -->
          <div class="col-xl-3 col-md-6">
            <div class="card glass-dashboard-card shadow-sm border-0 rounded-4 overflow-hidden h-100 dashboard-card" style="border-left: 4px solid #00e676 !important;">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="text-uppercase text-white-50 fw-bold mb-1 fs-7">Student Status</h6>
                    <h2 class="fw-bold mb-0 text-white">{{ stats.active }} <span class="fs-6 text-white-50 fw-normal">Active</span></h2>
                  </div>
                  <div class="card-icon p-3 rounded-4" style="background: rgba(0, 230, 118, 0.15); color: #00e676;">
                    <i class="bi bi-person-check fs-3"></i>
                  </div>
                </div>
                <div class="mt-3 fs-7 text-white-50 d-flex justify-content-between">
                  <span>Active: <strong style="color: #00e676;">{{ stats.active }}</strong></span>
                  <span>Inactive: <strong style="color: #ff1744;">{{ stats.inactive }}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Average Score -->
          <div class="col-xl-3 col-md-6">
            <div class="card glass-dashboard-card shadow-sm border-0 rounded-4 overflow-hidden h-100 dashboard-card" style="border-left: 4px solid #ffd600 !important;">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="text-uppercase text-white-50 fw-bold mb-1 fs-7">Avg Score</h6>
                    <h2 class="fw-bold mb-0 text-white">{{ stats.avgScore }} <span class="fs-6 text-white-50 fw-normal">/ 100</span></h2>
                  </div>
                  <div class="card-icon p-3 rounded-4" style="background: rgba(255, 214, 0, 0.15); color: #ffd600;">
                    <i class="bi bi-award fs-3"></i>
                  </div>
                </div>
                <div class="mt-3 fs-7 text-white-50">
                  <i class="bi bi-calculator me-1"></i> Mean academic performance
                </div>
              </div>
            </div>
          </div>

          <!-- Gender Distribution -->
          <div class="col-xl-3 col-md-6">
            <div class="card glass-dashboard-card shadow-sm border-0 rounded-4 overflow-hidden h-100 dashboard-card" style="border-left: 4px solid #00e5ff !important;">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="text-uppercase text-white-50 fw-bold mb-1 fs-7">Gender Ratio</h6>
                    <h3 class="fw-bold mb-0 text-white">
                      {{ stats.male }} <span class="fs-6 text-white-50 fw-normal">M</span> /
                      {{ stats.female }} <span class="fs-6 text-white-50 fw-normal">F</span>
                    </h3>
                  </div>
                  <div class="card-icon p-3 rounded-4" style="background: rgba(0, 229, 255, 0.15); color: #00e5ff;">
                    <i class="bi bi-gender-ambiguous fs-3"></i>
                  </div>
                </div>
                <div class="mt-3 fs-7 text-white-50 d-flex justify-content-between">
                  <span>Male: <strong style="color: #00e5ff;">{{ ((stats.male / (stats.total || 1)) * 100).toFixed(0) }}%</strong></span>
                  <span>Female: <strong style="color: #ff4081;">{{ ((stats.female / (stats.total || 1)) * 100).toFixed(0) }}%</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Dashboard Body Content -->
        <div class="row g-4">
          <!-- Recent Added Students List (Left Column) -->
          <div class="col-lg-8">
            <div class="card glass-dashboard-card shadow-sm border-0 rounded-4 h-100">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 class="fw-bold text-white mb-0">Recent Registered Students</h5>
                    <p class="text-white-50 small mb-0">The last 5 student registrations in the portal</p>
                  </div>
                  <router-link to="/students" class="btn btn-sm btn-link fw-semibold text-decoration-none text-white opacity-75 hover-opacity-100">
                    View All Students <i class="bi bi-arrow-right"></i>
                  </router-link>
                </div>

                <div class="table-responsive">
                  <table class="table table-hover align-middle">
                    <thead class="text-white-50 fs-7 text-uppercase">
                      <tr class="border-white-10">
                        <th>Student</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>Score</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="student in recentStudents" :key="student._id" class="border-white-10">
                        <td>
                          <div class="d-flex align-items-center gap-2">
                            <div class="avatar-circle fw-bold text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; font-size: 0.8rem; background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.25);">
                              {{ student.firstName?.charAt(0) }}{{ student.lastName?.charAt(0) }}
                            </div>
                            <span class="fw-semibold text-white">{{ student.firstName }} {{ student.lastName }}</span>
                          </div>
                        </td>
                        <td class="text-white-50 small">{{ student.email }}</td>
                        <td>
                          <span class="badge" :style="student.gender === 'Male' ? 'background: rgba(0, 210, 255, 0.2); color: #00d2ff; border: 1px solid rgba(0, 210, 255, 0.3);' : 'background: rgba(255, 64, 129, 0.2); color: #ff4081; border: 1px solid rgba(255, 64, 129, 0.3);'">
                            {{ student.gender }}
                          </span>
                        </td>
                        <td>
                          <span class="fw-bold" :style="student.score >= 50 ? 'color: #00e676;' : 'color: #ff1744;'">
                            {{ student.score }}
                          </span>
                        </td>
                        <td>
                          <span class="badge" :style="student.active !== false ? 'background: rgba(0, 230, 118, 0.2); color: #00e676; border: 1px solid rgba(0, 230, 118, 0.3);' : 'background: rgba(255, 23, 68, 0.2); color: #ff1744; border: 1px solid rgba(255, 23, 68, 0.3);'">
                            {{ student.active !== false ? 'Active' : 'Inactive' }}
                          </span>
                        </td>
                      </tr>

                      <tr v-if="recentStudents.length === 0">
                        <td colspan="5" class="text-center py-4 text-white-50">
                          No student records available.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Shortcuts & Quick Actions (Right Column) -->
          <div class="col-lg-4">
            <div class="card glass-dashboard-card shadow-sm border-0 rounded-4 h-100">
              <div class="card-body p-4 d-flex flex-column">
                <h5 class="fw-bold text-white mb-4">Quick Actions</h5>

                <div class="d-grid gap-3 flex-grow-1">
                  <!-- Register New Student Shortcut -->
                  <router-link to="/add-student" class="btn action-btn py-3 rounded-3 d-flex align-items-center justify-content-start px-4 gap-3 text-start text-white">
                    <div class="text-white p-2 rounded-3 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.25);">
                      <i class="bi bi-person-plus-fill fs-5"></i>
                    </div>
                    <div>
                      <div class="fw-bold text-white">Register Student</div>
                      <div class="text-white-50 small fs-7">Add new student records to database</div>
                    </div>
                  </router-link>

                  <!-- View Student List Shortcut -->
                  <router-link to="/students" class="btn action-btn py-3 rounded-3 d-flex align-items-center justify-content-start px-4 gap-3 text-start text-white">
                    <div class="text-white p-2 rounded-3 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.25);">
                      <i class="bi bi-people-fill fs-5"></i>
                    </div>
                    <div>
                      <div class="fw-bold text-white">Manage Students</div>
                      <div class="text-white-50 small fs-7">Update, delete, and view all list</div>
                    </div>
                  </router-link>
                </div>

                <div class="mt-4 p-3 info-box rounded-3 text-white-50 fs-7">
                  <i class="bi bi-info-circle-fill text-white opacity-75 me-1"></i> Registered students must log in using their credentials to access protected features.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const students = ref([]);
const loading = ref(true);

const stats = ref({
  total: 0,
  active: 0,
  inactive: 0,
  male: 0,
  female: 0,
  avgScore: 0
});

// Computed property to show the 5 most recently added students
const recentStudents = computed(() => {
  // Sort by _id descending to get newest students first
  const sorted = [...students.value].sort((a, b) => {
    if (a._id && b._id) return b._id.localeCompare(a._id);
    return 0;
  });
  return sorted.slice(0, 5);
});

const fetchDashboardData = async () => {
  loading.value = true;
  try {
    const url = "https://nodejsapi-wrcy.onrender.com/api/students";
    const response = await axios.get(url);
    const data = Array.isArray(response.data)
      ? response.data
      : response.data.data || [];
    
    students.value = data;
    
    // Compute dashboard statistics
    let activeCount = 0;
    let maleCount = 0;
    let femaleCount = 0;
    let scoreSum = 0;
    let scoreCount = 0;
    
    data.forEach(student => {
      if (student.active !== false) activeCount++;
      if (student.gender === 'Male') maleCount++;
      if (student.gender === 'Female') femaleCount++;
      if (student.score !== null && student.score !== undefined) {
        const scoreVal = Number(student.score);
        if (!isNaN(scoreVal)) {
          scoreSum += scoreVal;
          scoreCount++;
        }
      }
    });
    
    stats.value = {
      total: data.length,
      active: activeCount,
      inactive: data.length - activeCount,
      male: maleCount,
      female: femaleCount,
      avgScore: scoreCount > 0 ? (scoreSum / scoreCount).toFixed(1) : 0
    };
  } catch (error) {
    console.error("API error fetching stats:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.home-page {
  background: transparent;
}

.dashboard-badge-title {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  cursor: default;
  pointer-events: none;
}

.refresh-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.35);
}

.glass-dashboard-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dashboard-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.dashboard-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
}

.card-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fs-7 {
  font-size: 0.8rem;
}

.avatar-circle {
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}

.badge {
  font-weight: 500;
  padding: 0.4em 0.6em;
  font-size: 0.75rem;
  border-radius: 6px;
}

.hover-opacity-100:hover {
  opacity: 1 !important;
}

.border-white-10 {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.table {
  --bs-table-bg: transparent;
  --bs-table-color: #ffffff;
  --bs-table-hover-color: #ffffff;
  --bs-table-hover-bg: rgba(255, 255, 255, 0.08);
  --bs-table-border-color: rgba(255, 255, 255, 0.1);
}

.action-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.info-box {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>