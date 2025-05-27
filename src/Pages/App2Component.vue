<template>
  <div class="study-room-wrapper">
    <div class="study-room-container">
      <!-- En-tête avec navigation et paramètres -->
      <div class="room-header">
        <button class="back-button">
          <span>←</span>
        </button>
        <h1 class="room-title">Espace d'étude</h1>
        <button class="settings-button">
          <span>⚙</span>
        </button>
      </div>
      
      <!-- Info bannière -->
      <div class="info-banner">
        <span class="info-icon">ℹ️</span>
        <span class="info-text">Règles du groupe / Introduction</span>
        <span class="arrow-icon">→</span>
      </div>
      
      <!-- Statut d'étude -->
      <div class="status-pill">
        <span class="status-dot"></span>
        <span class="status-label">En étude</span>
        <span class="member-count">{{ activeMembers }} membres</span>
      </div>
      
      <!-- Grille des participants -->
      <div class="participants-grid">
        <!-- Votre espace -->
        <div class="participant-card active">
          <div class="user-avatar">
            <div class="avatar-placeholder"></div>
          </div>
          <div class="participant-info">
            <div class="participant-name">Vous</div>
            <div class="study-time">00:00:00</div>
          </div>
        </div>
        
        <!-- Espaces vides pour d'autres participants -->
        <div v-for="i in 11" :key="i" class="participant-card empty">
          <div class="user-avatar">
            <div class="avatar-placeholder empty"></div>
          </div>
          <div class="participant-info">
            <div class="placeholder-name"></div>
            <div class="placeholder-time"></div>
          </div>
        </div>
      </div>
      
      <!-- Boutons de contrôle -->
      <div class="main-controls">
        <button class="main-btn start-study-btn" @click="startStudy">
          <span class="btn-icon">▶</span>
          <span class="btn-text">Commencer l'étude</span>
        </button>
        <button class="main-btn view-courses-btn" @click="viewCourses">
          <span class="btn-icon">📚</span>
          <span class="btn-text">Voir les cours</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeMembers: 1,
      studyTime: 0,
      timerInterval: null
    }
  },
  methods: {
    startStudy() {
      if (!this.timerInterval) {
        this.timerInterval = setInterval(() => {
          this.studyTime++;
        }, 1000);
      }
    },
    pauseStudy() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },
    viewCourses() {
      // Naviguer vers la page des cours
      this.$emit('view-courses');
    }
  },
  beforeUnmount() {
    this.pauseStudy();
  }
}
</script>

<style scoped>
.study-room-wrapper {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter', 'Roboto', sans-serif;
}

.study-room-container {
  width: 100%;
  max-width: 1000px;
  background-color: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  position: relative;
  height: 85vh;
  display: flex;
  flex-direction: column;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
}

.back-button, .settings-button {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid #eaeaea;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  cursor: pointer;
  color: #555;
}

.back-button:hover, .settings-button:hover {
  background-color: rgba(211, 168, 252, 0.1);
}

.room-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.info-banner {
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  margin: 20px 0;
  border-left: 3px solid rgb(211, 168, 252);
}

.info-icon {
  font-size: 16px;
  margin-right: 12px;
  color: rgb(211, 168, 252);
}

.info-text {
  flex-grow: 1;
  font-size: 14px;
  color: #555;
}

.arrow-icon {
  font-size: 14px;
  color: #777;
}

.status-pill {
  background-color: #f1f3f5;
  border-radius: 4px;
  padding: 8px 12px;
  display: inline-flex;
  align-items: center;
  margin-bottom: 20px;
  align-self: flex-start;
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: #fc76a1;
  border-radius: 50%;
  margin-right: 8px;
}

.status-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.member-count {
  font-size: 14px;
  color: #fc76a1;
  margin-left: 8px;
  font-weight: 400;
}

.participants-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 80px;
}

.participant-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 6px;
  padding: 16px;
  border: 1px solid #eaeaea;
}

.participant-card.active {
  background-color: rgba(211, 168, 252, 0.05);
  border-color: rgba(211, 168, 252, 0.2);
}

.user-avatar {
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
}

.avatar-placeholder {
  width: 64px;
  height: 64px;
  background: linear-gradient(to right, rgb(211, 168, 252), #fcc7d3);
  border-radius: 50%;
}

.avatar-placeholder.empty {
  background-color: #eaeaea;
  background: #eaeaea;
}

.participant-info {
  text-align: center;
}

.participant-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.study-time {
  font-size: 13px;
  color: #666;
}

.placeholder-name {
  width: 60px;
  height: 10px;
  background-color: #eee;
  border-radius: 2px;
  margin-bottom: 6px;
}

.placeholder-time {
  width: 40px;
  height: 8px;
  background-color: #eee;
  border-radius: 2px;
  margin: 0 auto;
}

/* Styles pour les boutons principaux */
.main-controls {
  position: absolute;
  bottom: 25px;
  left: 25px;
  right: 25px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.main-btn {
  flex: 1;
  height: 50px;
  border-radius: 4px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.start-study-btn {
  background: linear-gradient(to right, rgb(211, 168, 252), #fcc7d3);
  color: white;
  box-shadow: 0 5px 15px rgba(211, 168, 252, 0.3);
}

.view-courses-btn {
  background-color: #f1f3f5;
  color: #333;
  border: 1px solid #ddd;
}

.btn-icon {
  font-size: 18px;
  margin-right: 10px;
}

.main-btn:hover {
  filter: brightness(1.05);
}

.main-btn:active {
  transform: translateY(1px);
}
</style>