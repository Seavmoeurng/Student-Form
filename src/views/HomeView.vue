<template>
  <div class="home-page min-vh-100 pb-5">
    <div class="container-fluid px-lg-5 px-4 pt-4">
      
      <!-- Dashboard Title Block -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <span class="dashboard-badge-title px-4 py-2 fw-bold fs-5 text-white border-0">
          SYSTEM DASHBOARD
        </span>
        <button @click="fetchDashboardData" :disabled="loading" class="btn refresh-btn btn-sm px-3 rounded-3 shadow-sm">
          <span v-if="loading" class="spinner-border spinner-border-sm me-1 text-white"></span>
          <i v-else class="bi bi-arrow-clockwise me-1 text-white"></i> <span class="text-white">Refresh Database</span>
        </button>
      </div>

      <!-- Loading Overlay -->
      <div v-if="loading && students.length === 0" class="d-flex justify-content-center align-items-center py-5 my-5">
        <div class="spinner-border text-primary-glow" style="width: 3rem; height: 3rem;" role="status"></div>
        <span class="ms-3 text-white opacity-75 fs-5">Configuring neural links...</span>
      </div>

      <div v-else>
        <!-- First Row: Profile Card & Habits Tracker -->
        <div class="row g-4 mb-4">
          
          <!-- Widget 1: Solo Leveling Profile System Card -->
          <div class="col-xl-6">
            <div class="card cyber-card h-100">
              <div class="card-body d-flex flex-column justify-content-between p-4">
                <div>
                  <h5 class="system-widget-title fw-bold mb-4">SOLO LEVELING System</h5>
                  
                  <div class="d-flex align-items-center gap-4 mb-4">
                    <div class="profile-avatar-container">
                      <img src="@/assets/logo.jpg" alt="Logo" class="avatar-neon" />
                      <div class="avatar-glow"></div>
                    </div>
                    <div class="flex-grow-1">
                      <h4 class="text-white fw-bold mb-1">DATABASE ADMIN</h4>
                      <p class="text-neon-pink small mb-3">Level: {{ adminLevel }} (Superuser)</p>
                      
                      <!-- Level / XP Progress Bar -->
                      <div class="d-flex justify-content-between small text-white-50 mb-1">
                        <span>XP Progress</span>
                        <span>{{ currentLevelRecords }} / 10 records</span>
                      </div>
                      <div class="cyber-progress-track">
                        <div class="cyber-progress-fill" :style="{ width: xpProgressBarWidth + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Profile Specs Grid -->
                <div class="row g-2 border-top border-purple-20 pt-3">
                  <div class="col-6 col-sm-3 text-center border-end border-purple-10">
                    <div class="text-white-50 fs-8">Active Users</div>
                    <div class="text-white fw-bold fs-6 mt-1">{{ stats.active }}</div>
                  </div>
                  <div class="col-6 col-sm-3 text-center border-end border-purple-10">
                    <div class="text-white-50 fs-8">Inactive</div>
                    <div class="text-white fw-bold fs-6 mt-1">{{ stats.inactive }}</div>
                  </div>
                  <div class="col-6 col-sm-3 text-center border-end border-purple-10">
                    <div class="text-white-50 fs-8">Avg Performance</div>
                    <div class="text-white fw-bold fs-6 mt-1">{{ stats.avgScore }}</div>
                  </div>
                  <div class="col-6 col-sm-3 text-center">
                    <div class="text-white-50 fs-8">Total Load</div>
                    <div class="text-white fw-bold fs-6 mt-1">{{ stats.total }}</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- Widget 2: Habit Tracker (Academic Score Bracket Bar Chart) -->
          <div class="col-xl-6">
            <div class="card cyber-card h-100">
              <div class="card-body p-4">
                <h5 class="system-widget-title fw-bold mb-3">HABIT TRACKER: SCORE DISTRIBUTION</h5>
                
                <!-- Bracket counts header -->
                <div class="d-flex justify-content-around text-center mb-2">
                  <div v-for="(count, bracket) in scoreBrackets" :key="bracket">
                    <div class="text-white-50 fs-8">Grade {{ bracket }}</div>
                    <div class="text-neon-purple fw-bold">{{ count }}</div>
                  </div>
                </div>

                <!-- Custom HTML/CSS Bar Chart -->
                <div class="bar-chart-container">
                  <div v-for="(count, bracket) in scoreBrackets" :key="bracket" class="bar-column-wrapper">
                    <div class="bar-pill-wrapper flex-grow-1 d-flex align-items-end w-100">
                      <div 
                        class="bar-pill w-100" 
                        :style="{ height: getBracketHeight(count) + '%' }"
                        v-b-tooltip.hover="count + ' students'"
                      >
                        <div class="bar-glow"></div>
                      </div>
                    </div>
                    <div class="bar-label">Grade {{ bracket }}</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        <!-- Second Row: Skill Tracker & Goal Completion Arc -->
        <div class="row g-4 mb-4">
          
          <!-- Widget 3: Skill Tracker (Metrics Tracker) -->
          <div class="col-xl-6 col-lg-7">
            <div class="card cyber-card h-100">
              <div class="card-body p-4">
                <h5 class="system-widget-title fw-bold mb-4">SKILL TRACKER: PERFORMANCE METRICS</h5>
                
                <div class="d-flex flex-column gap-3">
                  <!-- Skill item 1 -->
                  <div class="skill-row">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <div class="d-flex align-items-center gap-2">
                        <span class="skill-badge bg-cyber-pink">1</span>
                        <span class="fw-bold text-white fs-7">Academic Average</span>
                      </div>
                      <span class="text-neon-pink fw-bold fs-7">{{ stats.avgScore }} / 100</span>
                    </div>
                    <div class="cyber-progress-track">
                      <div class="cyber-progress-fill bg-cyber-pink" :style="{ width: stats.avgScore + '%' }"></div>
                    </div>
                  </div>

                  <!-- Skill item 2 -->
                  <div class="skill-row">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <div class="d-flex align-items-center gap-2">
                        <span class="skill-badge bg-cyber-purple">2</span>
                        <span class="fw-bold text-white fs-7">Active Student Ratio</span>
                      </div>
                      <span class="text-neon-purple fw-bold fs-7">{{ activeRatio }}%</span>
                    </div>
                    <div class="cyber-progress-track">
                      <div class="cyber-progress-fill bg-cyber-purple" :style="{ width: activeRatio + '%' }"></div>
                    </div>
                  </div>

                  <!-- Skill item 3 -->
                  <div class="skill-row">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <div class="d-flex align-items-center gap-2">
                        <span class="skill-badge bg-cyber-cyan">3</span>
                        <span class="fw-bold text-white fs-7">Male Balance Index</span>
                      </div>
                      <span class="text-neon-cyan fw-bold fs-7">{{ maleRatio }}%</span>
                    </div>
                    <div class="cyber-progress-track">
                      <div class="cyber-progress-fill bg-cyber-cyan" :style="{ width: maleRatio + '%' }"></div>
                    </div>
                  </div>

                  <!-- Skill item 4 -->
                  <div class="skill-row">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <div class="d-flex align-items-center gap-2">
                        <span class="skill-badge bg-cyber-gold">4</span>
                        <span class="fw-bold text-white fs-7">Female Balance Index</span>
                      </div>
                      <span class="text-neon-gold fw-bold fs-7">{{ femaleRatio }}%</span>
                    </div>
                    <div class="cyber-progress-track">
                      <div class="cyber-progress-fill bg-cyber-gold" :style="{ width: femaleRatio + '%' }"></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- Widget 4: Goal Completion Circular Arc -->
          <div class="col-xl-6 col-lg-5">
            <div class="card cyber-card h-100">
              <div class="card-body p-4 d-flex flex-column align-items-center justify-content-center">
                <h5 class="system-widget-title fw-bold mb-4 align-self-start">Goal Completion</h5>
                
                <div class="circle-progress-container mb-3">
                  <!-- SVG Circular Progress Ring -->
                  <svg viewBox="0 0 100 100" class="circle-ring">
                    <circle cx="50" cy="50" r="42" stroke="rgba(168, 85, 247, 0.1)" stroke-width="8" fill="transparent" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="42" 
                      stroke="#d946ef" 
                      stroke-width="8" 
                      fill="transparent" 
                      stroke-dasharray="264" 
                      :stroke-dashoffset="dashOffset" 
                      stroke-linecap="round"
                    />
                  </svg>
                  <div class="circle-text">
                    <span class="text-white fs-4 fw-bold">XP</span>
                    <span class="text-neon-pink fs-6 fw-bold">{{ capacityPercentage }}%</span>
                    <span class="text-white-50 fs-8">{{ stats.total }} / 100</span>
                  </div>
                </div>
                <p class="text-white-50 text-center small m-0">Target load capacity of 100 active student records</p>
              </div>
            </div>
          </div>

        </div>

        <!-- Third Row: Recent Added Students Table & Shortcuts + Potion Status Indicators -->
        <div class="row g-4">
          
          <!-- Widget 5: Recent Added Students Table (Marketplace layout) -->
          <div class="col-xl-8">
            <div class="card cyber-card h-100">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 class="system-widget-title fw-bold mb-0">System Log: Registrations</h5>
                    <p class="text-white-50 small mb-0">Newly registered profiles verified on the blockchain</p>
                  </div>
                  <router-link to="/students" class="btn btn-sm view-all-btn text-white opacity-75 hover-neon text-decoration-none">
                    View All Registry <i class="bi bi-arrow-right"></i>
                  </router-link>
                </div>

                <div class="table-responsive">
                  <table class="table table-hover align-middle">
                    <thead class="text-white-50 fs-7 text-uppercase border-bottom border-purple-20">
                      <tr>
                        <th>Identity</th>
                        <th>Email Code</th>
                        <th>Gender</th>
                        <th>Academic Score</th>
                        <th>Node State</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="student in recentStudents" :key="student._id" class="border-purple-10">
                        <td>
                          <div class="d-flex align-items-center gap-2">
                            <div class="avatar-circle-cyber fw-bold text-white rounded-circle d-flex align-items-center justify-content-center">
                              {{ student.firstName?.charAt(0) }}{{ student.lastName?.charAt(0) }}
                            </div>
                            <span class="fw-bold text-white">{{ student.firstName }} {{ student.lastName }}</span>
                          </div>
                        </td>
                        <td class="text-white-50 small font-monospace">{{ student.email }}</td>
                        <td>
                          <span class="badge badge-cyber" :style="student.gender === 'Male' ? 'background: rgba(0, 229, 255, 0.15); color: #00e5ff; border: 1px solid rgba(0, 229, 255, 0.3);' : 'background: rgba(244, 63, 94, 0.15); color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.3);'">
                            {{ student.gender }}
                          </span>
                        </td>
                        <td>
                          <span class="fw-bold fs-6" :style="student.score >= 50 ? 'color: #00e676; text-shadow: 0 0 8px rgba(0,230,118,0.3);' : 'color: #f43f5e; text-shadow: 0 0 8px rgba(244,63,94,0.3);'">
                            {{ student.score }}
                          </span>
                        </td>
                        <td>
                          <span class="badge badge-cyber" :style="student.active !== false ? 'background: rgba(0, 230, 118, 0.15); color: #00e676; border: 1px solid rgba(0, 230, 118, 0.3);' : 'background: rgba(244, 63, 94, 0.15); color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.3);'">
                            {{ student.active !== false ? 'ONLINE' : 'OFFLINE' }}
                          </span>
                        </td>
                      </tr>

                      <tr v-if="recentStudents.length === 0">
                        <td colspan="5" class="text-center py-4 text-white-50">
                          Empty grid. No nodes registered in student system.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Widget 6: Shortcuts & Potion Status Indicators (Ah Iwet / Bottles mockup) -->
          <div class="col-xl-4">
            <div class="d-flex flex-column gap-4 h-100">
              
              <!-- Quick Actions -->
              <div class="card cyber-card">
                <div class="card-body p-4">
                  <h5 class="system-widget-title fw-bold mb-4">Quick Actions</h5>
                  
                  <div class="d-grid gap-3">
                    <router-link to="/add-student" class="btn cyber-action-btn py-3 rounded-3 d-flex align-items-center justify-content-start px-4 gap-3 text-start text-white">
                      <div class="btn-icon-wrapper text-white p-2 rounded-3 d-flex align-items-center justify-content-center">
                        <i class="bi bi-person-plus-fill fs-5"></i>
                      </div>
                      <div>
                        <div class="fw-bold text-white">Register Student</div>
                        <div class="text-white-50 small fs-7">Add student nodes to system database</div>
                      </div>
                    </router-link>

                    <router-link to="/students" class="btn cyber-action-btn py-3 rounded-3 d-flex align-items-center justify-content-start px-4 gap-3 text-start text-white">
                      <div class="btn-icon-wrapper text-white p-2 rounded-3 d-flex align-items-center justify-content-center">
                        <i class="bi bi-people-fill fs-5"></i>
                      </div>
                      <div>
                        <div class="fw-bold text-white">Manage Students</div>
                        <div class="text-white-50 small fs-7">Audit, configure, and edit list</div>
                      </div>
                    </router-link>
                  </div>
                </div>
              </div>

              <!-- Widget 7: Potion Bottles Widget (Ah Iwet / Status indicators) -->
              <div class="card cyber-card flex-grow-1">
                <div class="card-body p-4 d-flex flex-column justify-content-between">
                  <h5 class="system-widget-title fw-bold mb-4">System Core Resources</h5>
                  
                  <!-- Liquid Flask / Bottle Grid -->
                  <div class="d-flex justify-content-around align-items-end mb-4 pt-3">
                    <!-- Potion 1: API Online -->
                    <div class="potion-wrapper" v-b-tooltip.hover="'API Link: Online'">
                      <div class="potion-flask fill-100">
                        <div class="potion-liquid bg-cyber-cyan"></div>
                      </div>
                      <div class="potion-label mt-2">API</div>
                    </div>

                    <!-- Potion 2: DB State -->
                    <div class="potion-wrapper" v-b-tooltip.hover="'Database Sync: Active'">
                      <div class="potion-flask fill-100">
                        <div class="potion-liquid bg-cyber-pink"></div>
                      </div>
                      <div class="potion-label mt-2">SYNC</div>
                    </div>

                    <!-- Potion 3: Auth Session -->
                    <div class="potion-wrapper" v-b-tooltip.hover="'Admin Token: Stable'">
                      <div class="potion-flask fill-100">
                        <div class="potion-liquid bg-cyber-purple"></div>
                      </div>
                      <div class="potion-label mt-2">AUTH</div>
                    </div>

                    <!-- Potion 4: Network Latency -->
                    <div class="potion-wrapper" v-b-tooltip.hover="'Client Response Latency: 32ms'">
                      <div class="potion-flask fill-75">
                        <div class="potion-liquid bg-cyber-gold"></div>
                      </div>
                      <div class="potion-label mt-2">LAT</div>
                    </div>

                    <!-- Potion 5: Storage Load -->
                    <div class="potion-wrapper" v-b-tooltip.hover="'Storage Load Percentage'">
                      <div class="potion-flask" :class="'fill-' + Math.min(100, Math.max(0, Math.floor(stats.total / 10) * 10))">
                        <div class="potion-liquid bg-cyber-magenta"></div>
                      </div>
                      <div class="potion-label mt-2">LOAD</div>
                    </div>
                  </div>

                  <div class="mt-3 p-3 info-box-cyber rounded-3 text-white-50 fs-8 font-monospace">
                    <i class="bi bi-shield-lock-fill text-neon-pink me-1"></i> Firewall neural links verified. Encryption key active.
                  </div>
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

// Compute ratios
const activeRatio = computed(() => {
  if (stats.value.total === 0) return 0;
  return ((stats.value.active / stats.value.total) * 100).toFixed(0);
});

const maleRatio = computed(() => {
  if (stats.value.total === 0) return 0;
  return ((stats.value.male / stats.value.total) * 100).toFixed(0);
});

const femaleRatio = computed(() => {
  if (stats.value.total === 0) return 0;
  return ((stats.value.female / stats.value.total) * 100).toFixed(0);
});

// Compute dynamic level system (e.g. 10 records per level)
const adminLevel = computed(() => {
  return Math.floor(stats.value.total / 10) + 1;
});

const currentLevelRecords = computed(() => {
  return stats.value.total % 10;
});

const xpProgressBarWidth = computed(() => {
  return (currentLevelRecords.value / 10) * 100;
});

// Goal completion circle progress ring formula
const capacityPercentage = computed(() => {
  return Math.min(100, stats.value.total);
});

const dashOffset = computed(() => {
  // Stroke array total is 264
  const pct = capacityPercentage.value;
  return 264 - (264 * pct) / 100;
});

// Score Brackets (Grade A to F)
const scoreBrackets = computed(() => {
  const brackets = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  students.value.forEach(student => {
    if (!student || student.score === null || student.score === undefined) return;
    const scoreVal = Number(student.score);
    if (isNaN(scoreVal)) return;

    if (scoreVal >= 85) brackets.A++;
    else if (scoreVal >= 70) brackets.B++;
    else if (scoreVal >= 60) brackets.C++;
    else if (scoreVal >= 50) brackets.D++;
    else brackets.F++;
  });
  return brackets;
});

const maxBracketCount = computed(() => {
  return Math.max(1, scoreBrackets.value.A, scoreBrackets.value.B, scoreBrackets.value.C, scoreBrackets.value.D, scoreBrackets.value.F);
});

const getBracketHeight = (count) => {
  return (count / maxBracketCount.value) * 100;
};

// Computed property to show the 5 most recently added students
const recentStudents = computed(() => {
  // Safe filtering
  const valid = students.value.filter(s => s && typeof s === 'object');
  // Sort by _id descending to get newest students first
  const sorted = [...valid].sort((a, b) => {
    if (a._id && b._id) return String(b._id).localeCompare(String(a._id));
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
      if (!student) return;
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
  background: rgba(168, 85, 247, 0.15);
  border: 1px solid rgba(168, 85, 247, 0.35);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 12px;
  letter-spacing: 0.5px;
  cursor: default;
  pointer-events: none;
  font-family: 'Space Grotesk', sans-serif;
  text-shadow: 0 0 8px rgba(168, 85, 247, 0.5);
}

.refresh-btn {
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.3);
  transition: all 0.3s;
}

.refresh-btn:hover {
  background: rgba(168, 85, 247, 0.2);
  border-color: #d946ef;
}

.text-primary-glow {
  color: #d946ef;
  text-shadow: 0 0 10px rgba(217, 70, 239, 0.6);
}

.cyber-card {
  background: #121124;
  border: 1.5px solid rgba(168, 85, 247, 0.2);
  border-radius: 24px;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.cyber-card:hover {
  border-color: rgba(217, 70, 239, 0.35);
  box-shadow: 0 0 30px rgba(217, 70, 239, 0.1) !important;
}

.system-widget-title {
  font-family: 'Space Grotesk', sans-serif;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.5px;
  font-size: 0.95rem;
  text-transform: uppercase;
}

.profile-avatar-container {
  position: relative;
  width: 90px;
  height: 90px;
}

.avatar-neon {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #d946ef;
  position: relative;
  z-index: 2;
}

.avatar-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: #d946ef;
  filter: blur(12px);
  opacity: 0.45;
  z-index: 1;
}

.text-neon-pink {
  color: #f43f5e;
  text-shadow: 0 0 8px rgba(244, 63, 94, 0.4);
}

.text-neon-purple {
  color: #d946ef;
  text-shadow: 0 0 8px rgba(217, 70, 239, 0.4);
}

.text-neon-cyan {
  color: #00e5ff;
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.4);
}

.text-neon-gold {
  color: #ffd600;
  text-shadow: 0 0 8px rgba(255, 214, 0, 0.4);
}

.border-purple-20 {
  border-color: rgba(168, 85, 247, 0.25) !important;
}

.border-purple-10 {
  border-color: rgba(168, 85, 247, 0.15) !important;
}

.fs-8 {
  font-size: 0.72rem;
}

.fs-7 {
  font-size: 0.85rem;
}

/* Progress track and fill */
.cyber-progress-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  height: 8px;
  width: 100%;
  overflow: hidden;
}

.cyber-progress-fill {
  background: linear-gradient(90deg, #a855f7 0%, #d946ef 100%);
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(217, 70, 239, 0.6);
  transition: width 0.5s ease;
}

.bg-cyber-pink {
  background: linear-gradient(90deg, #f43f5e 0%, #ff79b0 100%) !important;
  box-shadow: 0 0 10px rgba(244, 63, 94, 0.6) !important;
}

.bg-cyber-purple {
  background: linear-gradient(90deg, #a855f7 0%, #d946ef 100%) !important;
  box-shadow: 0 0 10px rgba(217, 70, 239, 0.6) !important;
}

.bg-cyber-cyan {
  background: linear-gradient(90deg, #00e5ff 0%, #00b0ff 100%) !important;
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.6) !important;
}

.bg-cyber-gold {
  background: linear-gradient(90deg, #ffd600 0%, #ff8f00 100%) !important;
  box-shadow: 0 0 10px rgba(255, 214, 0, 0.6) !important;
}

.bg-cyber-magenta {
  background: linear-gradient(90deg, #ec4899 0%, #f43f5e 100%) !important;
  box-shadow: 0 0 10px rgba(236, 72, 153, 0.6) !important;
}

/* Custom CSS vertical columns bar chart style */
.bar-chart-container {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 175px;
  padding-top: 15px;
}

.bar-column-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 15%;
  height: 100%;
}

.bar-pill-wrapper {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  width: 18px;
  height: 100%;
}

.bar-pill {
  border-radius: 12px;
  background: linear-gradient(180deg, #d946ef 0%, #701a75 100%);
  box-shadow: 0 0 12px rgba(217, 70, 239, 0.35);
  position: relative;
}

.bar-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  background: #d946ef;
  filter: blur(4px);
  opacity: 0.35;
}

.bar-label {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 8px;
  font-weight: 700;
}

/* Skill track indicators */
.skill-badge {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Circular ring */
.circle-progress-container {
  position: relative;
  width: 150px;
  height: 150px;
}

.circle-ring {
  transform: rotate(-90deg);
  width: 150px;
  height: 150px;
}

.circle-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1.2;
}

/* Cyber Table styling */
.table {
  --bs-table-bg: transparent;
  --bs-table-color: #ffffff;
  --bs-table-hover-bg: rgba(168, 85, 247, 0.08);
  --bs-table-border-color: rgba(168, 85, 247, 0.15);
}

.table th {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  border-bottom-width: 1.5px;
}

.avatar-circle-cyber {
  width: 32px;
  height: 32px;
  font-size: 0.8rem;
  background: rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.4);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.badge-cyber {
  font-weight: 700;
  font-family: 'Space Grotesk', sans-serif;
  letter-spacing: 0.5px;
  padding: 0.45em 0.75em;
  font-size: 0.7rem;
  border-radius: 6px;
}

.view-all-btn:hover {
  color: #d946ef !important;
  text-shadow: 0 0 8px rgba(217, 70, 239, 0.6);
}

.hover-neon:hover {
  text-shadow: 0 0 8px rgba(217, 70, 239, 0.6);
}

/* Action button shortcuts */
.cyber-action-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(168, 85, 247, 0.2);
  transition: all 0.3s ease;
}

.cyber-action-btn:hover {
  background: rgba(168, 85, 247, 0.08);
  border-color: #d946ef;
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgba(217, 70, 239, 0.15) !important;
}

.btn-icon-wrapper {
  background: rgba(168, 85, 247, 0.15);
  border: 1px solid rgba(168, 85, 247, 0.3);
  width: 40px;
  height: 40px;
}

.info-box-cyber {
  background: rgba(168, 85, 247, 0.04);
  border: 1px solid rgba(168, 85, 247, 0.15);
}

/* Flasks / Potion Bottles styling */
.potion-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.potion-flask {
  width: 32px;
  height: 48px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-radius: 6px 6px 14px 14px;
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  overflow: hidden;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.05);
}

.potion-flask::before {
  content: '';
  position: absolute;
  top: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 5px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  background: #121124;
  border-radius: 2px;
}

.potion-liquid {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  transition: height 0.5s ease;
  height: 20%; /* Default load */
}

/* Potion dynamic heights matching flask capacities */
.fill-100 .potion-liquid { height: 90%; }
.fill-90 .potion-liquid { height: 80%; }
.fill-80 .potion-liquid { height: 72%; }
.fill-75 .potion-liquid { height: 68%; }
.fill-70 .potion-liquid { height: 63%; }
.fill-60 .potion-liquid { height: 54%; }
.fill-50 .potion-liquid { height: 45%; }
.fill-40 .potion-liquid { height: 36%; }
.fill-30 .potion-liquid { height: 27%; }
.fill-20 .potion-liquid { height: 18%; }
.fill-10 .potion-liquid { height: 9%; }
.fill-0 .potion-liquid { height: 0%; }

.potion-label {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 700;
}
</style>