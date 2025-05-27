<script setup>
import MainContainer from '@/Components/src/MainContainer.vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import { UserGroupIcon, BookOpenIcon } from '@heroicons/vue/20/solid';
import TabBar from '@/Components/Common/TabBar/TabBar.vue';
import TabBarItem from '@/Components/Common/TabBar/TabBarItem.vue';
import { ref, onBeforeUnmount, computed, onMounted } from 'vue';
import PageTitle from '@/Components/Common/PageTitle.vue';
import { storeToRefs } from 'pinia';
import { useMinuteursStore } from '@/store/minuteurs';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';

defineProps({
	availableRoles: Array,
});

const selectedCourse = ref(null);
const importedCourses = ref([]);
const activeTab = ref('study');
function isActiveTab(tab) {
	return activeTab.value === tab;
}

// Router pour la navigation
const router = useRouter();

// Utilisation du store minuteurs pour synchronisation
const { minuteurs, currentMinuteur, clock } = storeToRefs(useMinuteursStore());
const { toggleStartStopMinuteur } = useMinuteursStore();

// Variables pour la fonctionnalité d'étude
const activeMembers = ref(1);
const showImportedCourses = ref(false);

// Simuler le chargement des cours importés
onMounted(() => {
	// Dans une implémentation réelle, vous devriez charger ces données depuis votre API
	importedCourses.value = [
		{ id: 1, title: 'Introduction à la programmation', date: '2025-05-15', pages: 45 },
		{ id: 2, title: 'Mathématiques avancées', date: '2025-05-10', pages: 32 },
		{ id: 3, title: 'Littérature française', date: '2025-05-05', pages: 67 },
		{ id: 4, title: 'Sciences physiques', date: '2025-04-30', pages: 28 },
		{ id: 5, title: 'Histoire contemporaine', date: '2025-04-25', pages: 53 },
	];
});

// Méthodes pour l'espace d'étude synchronisées avec le système de minuteurs
function pauseStudy() {
	if (currentMinuteur.value.id) {
		// Arrêt du minuteur en cours
		toggleStartStopMinuteur(false, currentMinuteur.value);
	}
}

function viewCourses() {
	// Afficher la liste des cours importés
	showImportedCourses.value = !showImportedCourses.value;
}

function goToImport() {
	router.push({ name: 'import' });
}

function selectCourse(course) {
	selectedCourse.value = course;
	showImportedCourses.value = false;
}

function closeCourse() {
	selectedCourse.value = null;
}

// Utiliser l'horloge du système de minuteurs pour afficher le temps écoulé
const formattedStudyTime = computed(() => {
	if (!currentMinuteur.value.id || !clock.value) return '00:00:00';

	const startTime = dayjs(currentMinuteur.value.start);
	const currentTime = clock.value || dayjs();
	const diffSeconds = currentTime.diff(startTime, 'second');

	const hours = Math.floor(diffSeconds / 3600);
	const minutes = Math.floor((diffSeconds % 3600) / 60);
	const seconds = diffSeconds % 60;

	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}`;
});

// État de l'étude basé sur le minuteur actuel
const studyActive = computed(() => !!currentMinuteur.value.id);

// Nettoyer si nécessaire
onBeforeUnmount(() => {
	if (currentMinuteur.value.id) {
		// Option: arrêter automatiquement le minuteur lors de la fermeture
		// toggleStartStopMinuteur(false, currentMinuteur.value);
	}
});
</script>

<template>
	<AppLayout title="Members" data-testid="members_view">
		<MainContainer class="py-5 border-b border-default-background-separator flex justify-between items-center">
			<div class="flex items-center space-x-4 sm:space-x-6">
				<PageTitle :icon="UserGroupIcon" title="Members"> </PageTitle>
				<TabBar>
					<TabBarItem :active="isActiveTab('study')" @click="activeTab = 'study'">Espace d'étude</TabBarItem>
				</TabBar>
			</div>
		</MainContainer>

		<!-- Intégration de l'espace d'étude -->
		<div v-if="activeTab === 'study'" class="study-room-wrapper">
			<div class="flex-container" :class="{ 'with-course': selectedCourse }">
				<!-- Conteneur de l'espace d'étude -->
				<div class="study-room-container" :class="{ 'with-course': selectedCourse }">
					<!-- En-tête simplifié -->
					<div class="room-header">
						<h1 class="room-title">Espace d'étude</h1>
						<button class="view-courses-btn-header" @click="viewCourses">
							<span class="courses-icon">📚</span>
							<span class="courses-text">{{ showImportedCourses ? 'Masquer les cours' : 'Voir les cours' }}</span>
						</button>
					</div>

					<!-- Statut d'étude -->
					<div class="status-pill">
						<span class="status-dot" :class="{ 'active-dot': studyActive }"></span>
						<span class="status-label">{{ studyActive ? 'En étude' : 'En pause' }}</span>
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
								<div class="study-time">{{ formattedStudyTime }}</div>
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

					<!-- Bouton de contrôle principal -->
					<div class="main-controls">
						<button v-if="studyActive" class="main-btn pause-study-btn" @click="pauseStudy()">
							<span class="btn-icon">⏸</span>
							<span class="btn-text">Mettre en pause</span>
						</button>
					</div>
				</div>

				<!-- Affichage du cours sélectionné -->
				<div v-if="selectedCourse" class="course-display-container">
					<div class="course-header">
						<h2 class="course-title">{{ selectedCourse.title }}</h2>
						<button class="close-course-btn" @click="closeCourse">×</button>
					</div>
					<div class="course-details">
						<div class="course-meta">
							<p><strong>Date d'import:</strong> {{ selectedCourse.date }}</p>
							<p><strong>Pages:</strong> {{ selectedCourse.pages }}</p>
						</div>
						<div class="course-content">
							<!-- Contenu du cours ici -->
							<div class="course-placeholder">
								<div class="course-placeholder-icon">
									<BookOpenIcon class="h-8 w-8 text-gray-400 dark:text-gray-500" />
								</div>
								<p class="course-placeholder-text">Contenu du cours disponible</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Liste des cours importés -->
			<div v-if="showImportedCourses" class="imported-courses-overlay">
				<div class="imported-courses-container">
					<div class="imported-courses-header">
						<h2 class="imported-courses-title">Cours importés</h2>
						<button class="close-courses-btn" @click="showImportedCourses = false">×</button>
					</div>
					<div class="courses-list">
						<div v-if="importedCourses.length === 0" class="no-courses">
							<p>Aucun cours importé. Veuillez importer des cours d'abord.</p>
							<button class="import-btn" @click="goToImport">Importer des cours</button>
						</div>
						<div v-else class="courses-grid">
							<div v-for="course in importedCourses" :key="course.id" class="course-card" @click="selectCourse(course)">
								<div class="course-card-icon">
									<BookOpenIcon class="h-6 w-6 text-gray-500 dark:text-gray-400" />
								</div>
								<div class="course-card-content">
									<h3 class="course-card-title">{{ course.title }}</h3>
									<p class="course-card-date">Importé le {{ course.date }}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</AppLayout>
</template>

<style scoped>
/* Variables CSS pour la gestion des thèmes */
:root {
	--color-bg-primary: #ffffff;
	--color-bg-secondary: #f9fafb;
	--bg-tertiary: #f3f4f6;
	--text-primary: #111827;
	--text-secondary: #4b5563;
	--text-tertiary: #6b7280;
	--border-primary: #e5e7eb;
	--border-secondary: #d1d5db;
	--shadow-light: rgba(0, 0, 0, 0.1);
	--shadow-medium: rgba(0, 0, 0, 0.15);
	--accent-blue: #1f93ff;
	--accent-green: #22c55e;
	--accent-red: #ef4444;
}

/* Mode sombre */
.dark {
	--color-bg-primary: #1f2937;
	--color-bg-secondary: #111827;
	--bg-tertiary: #374151;
	--text-primary: #f9fafb;
	--text-secondary: #d1d5db;
	--text-tertiary: #9ca3af;
	--border-primary: #374151;
	--border-secondary: #4b5563;
	--shadow-light: rgba(0, 0, 0, 0.3);
	--shadow-medium: rgba(0, 0, 0, 0.4);
	--accent-blue: #3b82f6;
	--accent-green: #10b981;
	--accent-red: #f87171;
}

@media (prefers-color-scheme: dark) {
	:root {
		--bg-tertiary: #2a2c32;
		--text-primary: #f9fafb;
		--text-secondary: #d1d5db;
		--text-tertiary: #9ca3af;
		--border-primary: #374151;
		--border-secondary: #4b5563;
		--shadow-light: rgba(0, 0, 0, 0.3);
		--shadow-medium: rgba(0, 0, 0, 0.4);
		--accent-blue: #3b82f6;
		--accent-green: #10b981;
		--accent-red: #f87171;
	}
	.status-label {
		color: #f9fafb !important;
	}
}

.study-room-wrapper {
	min-height: calc(100vh - 200px);
	background-color: var(--color-bg-secondary);
	padding: 20px;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	font-family: 'Inter', 'Roboto', sans-serif;
	position: relative;
}

.flex-container {
	display: flex;
	width: 100%;
	gap: 20px;
	max-width: 1600px;
}

.flex-container.with-course .study-room-container {
	width: 50%;
}

.study-room-container {
	width: 100%;
	max-width: 1400px;
	background-color: var(--color-bg-primary);
	border-radius: 8px;
	padding: 25px;
	box-shadow: 0 1px 3px var(--shadow-light);
	position: relative;
	height: 85vh;
	display: flex;
	flex-direction: column;
	transition: width 0.3s ease;
	margin: 0 auto;
	border: 1px solid var(--border-primary);
}

.course-display-container {
	width: 50%;
	background-color: var(--color-bg-primary);
	border-radius: 8px;
	padding: 25px;
	box-shadow: 0 1px 3px var(--shadow-light);
	height: 85vh;
	display: flex;
	flex-direction: column;
	border: 1px solid var(--border-primary);
}

.course-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid var(--border-primary);
	padding-bottom: 15px;
	margin-bottom: 15px;
}

.course-title {
	font-size: 20px;
	font-weight: 600;
	color: var(--text-primary);
}

.close-course-btn {
	width: 30px;
	height: 30px;
	border-radius: 15px;
	border: none;
	background-color: var(--bg-tertiary);
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 20px;
	cursor: pointer;
	color: var(--text-secondary);
	transition: background-color 0.2s ease;
}

.close-course-btn:hover {
	background-color: var(--border-secondary);
}

.course-details {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
}

.course-meta {
	margin-bottom: 20px;
	color: var(--text-secondary);
	font-size: 14px;
}

.course-content {
	flex-grow: 1;
	border: 1px solid var(--border-primary);
	border-radius: 6px;
	padding: 15px;
	overflow-y: auto;
	background-color: var(--color-bg-secondary);
}

.course-placeholder {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	color: var(--text-tertiary);
}

.course-placeholder-icon {
	margin-bottom: 10px;
}

.course-placeholder-text {
	font-size: 16px;
}

.room-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 20px;
	border-bottom: 1px solid var(--border-primary);
	margin-bottom: 20px;
}

.room-title {
	font-size: 22px;
	font-weight: 600;
	margin: 0;
	color: var(--text-primary);
}

.view-courses-btn-header {
	display: flex;
	align-items: center;
	padding: 8px 16px;
	background-color: var(--bg-tertiary);
	border: 1px solid var(--border-primary);
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
	color: var(--text-secondary);
	transition: all 0.2s ease;
}

.view-courses-btn-header:hover {
	background-color: var(--border-primary);
	transform: translateY(-1px);
}

.courses-icon {
	font-size: 16px;
	margin-right: 8px;
}

.courses-text {
	font-weight: 500;
}

.status-pill {
	background-color: var(--bg-tertiary);
	border-radius: 4px;
	padding: 8px 12px;
	display: inline-flex;
	align-items: center;
	margin-bottom: 20px;
	align-self: flex-start;
	border: 1px solid var(--border-primary);
}

.status-dot {
	width: 8px;
	height: 8px;
	background-color: var(--accent-red);
	border-radius: 50%;
	margin-right: 8px;
}

.status-dot.active-dot {
	background-color: var(--accent-green);
}

.status-label {
	font-size: 14px;
	font-weight: 500;
	color: var(--text-primary);
}

.member-count {
	font-size: 14px;
	color: var(--text-secondary);
	margin-left: 8px;
	font-weight: 400;
}

.participants-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 20px;
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
	border: 1px solid var(--border-primary);
	background-color: var(--color-bg-primary);
}

.participant-card.active {
	background-color: var(--color-bg-secondary);
	border-color: var(--border-secondary);
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
	background-color: var(--text-secondary);
	border-radius: 50%;
}

.avatar-placeholder.empty {
	background-color: var(--border-primary);
}

.participant-info {
	text-align: center;
}

.participant-name {
	font-size: 14px;
	font-weight: 500;
	color: var(--text-primary);
	margin-bottom: 4px;
}

.study-time {
	font-size: 13px;
	color: var(--text-tertiary);
}

.placeholder-name {
	width: 60px;
	height: 10px;
	background-color: var(--border-primary);
	border-radius: 2px;
	margin-bottom: 6px;
}

.placeholder-time {
	width: 40px;
	height: 8px;
	background-color: var(--border-primary);
	border-radius: 2px;
	margin: 0 auto;
}

/* Styles pour le bouton principal de contrôle */
.main-controls {
	position: absolute;
	bottom: 25px;
	left: 25px;
	right: 25px;
	display: flex;
	justify-content: center;
}

.main-btn {
	height: 50px;
	padding: 0 30px;
	border-radius: 6px;
	border: none;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	font-size: 15px;
	font-weight: 500;
	transition: all 0.2s ease;
	box-shadow: 0 2px 4px var(--shadow-light);
}

.pause-study-btn {
	background-color: var(--accent-blue);
	color: white;
}

.btn-icon {
	font-size: 18px;
	margin-right: 10px;
}

.main-btn:hover {
	filter: brightness(1.05);
	transform: translateY(-1px);
}

.main-btn:active {
	transform: translateY(1px);
}

/* Styles pour la liste des cours importés */
.imported-courses-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 10;
}

.imported-courses-container {
	width: 80%;
	max-width: 900px;
	background-color: var(--color-bg-primary);
	border-radius: 8px;
	padding: 25px;
	box-shadow: 0 4px 6px var(--shadow-medium);
	max-height: 80vh;
	display: flex;
	flex-direction: column;
	border: 1px solid var(--border-primary);
}

.imported-courses-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 15px;
	border-bottom: 1px solid var(--border-primary);
	margin-bottom: 20px;
}

.imported-courses-title {
	font-size: 20px;
	font-weight: 600;
	margin: 0;
	color: var(--text-primary);
}

.close-courses-btn {
	width: 30px;
	height: 30px;
	border-radius: 15px;
	border: none;
	background-color: var(--bg-tertiary);
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 20px;
	cursor: pointer;
	color: var(--text-secondary);
	transition: background-color 0.2s ease;
}

.close-courses-btn:hover {
	background-color: var(--border-secondary);
}

.courses-list {
	flex-grow: 1;
	overflow-y: auto;
}

.no-courses {
	text-align: center;
	padding: 30px;
	color: var(--text-tertiary);
}

.import-btn {
	margin-top: 15px;
	padding: 8px 15px;
	background-color: var(--bg-tertiary);
	border: 1px solid var(--border-primary);
	border-radius: 4px;
	cursor: pointer;
	font-size: 14px;
	color: var(--text-secondary);
	transition: background-color 0.2s ease;
}

.import-btn:hover {
	background-color: var(--border-primary);
}

.courses-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	gap: 15px;
}

.course-card {
	border: 1px solid var(--border-primary);
	border-radius: 6px;
	padding: 15px;
	cursor: pointer;
	transition: all 0.2s ease;
	display: flex;
	align-items: center;
	background-color: var(--color-bg-primary);
}

.course-card:hover {
	background-color: var(--color-bg-secondary);
	border-color: var(--border-secondary);
}

.course-card-icon {
	margin-right: 12px;
}

.course-card-content {
	flex-grow: 1;
}

.course-card-title {
	font-size: 15px;
	font-weight: 500;
	color: var(--text-primary);
	margin: 0 0 5px;
}

.course-card-date {
	font-size: 12px;
	color: var(--text-tertiary);
	margin: 0;
}

/* Ajout d'un style pour les conteneurs de table dans les onglets All et Invitations */
.member-table-container,
.invitation-table-container {
	width: 100%;
	max-width: 1400px;
	margin: 0 auto;
}

/* Responsive design */
@media (max-width: 768px) {
	.flex-container.with-course {
		flex-direction: column;
	}

	.flex-container.with-course .study-room-container,
	.course-display-container {
		width: 100%;
	}

	.participants-grid {
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 15px;
	}

	.main-controls {
		position: relative;
		bottom: auto;
		left: auto;
		right: auto;
		margin-top: 20px;
	}

	.courses-grid {
		grid-template-columns: 1fr;
	}

	.room-header {
		flex-direction: column;
		gap: 15px;
		align-items: flex-start;
	}

	.view-courses-btn-header {
		align-self: flex-end;
	}
}
</style>
