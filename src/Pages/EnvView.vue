<script setup>
import dayjs from 'dayjs';
import { ref, onBeforeUnmount, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useMinuteursStore } from '@/store/minuteurs';
import { useEnvStore } from '@/store/env';
import { fetch, getCredentials } from '@/store/axios';
import { UserGroupIcon, BookOpenIcon } from '@heroicons/vue/20/solid';
import MainContainer from '@/Components/src/MainContainer.vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import PageTitle from '@/Components/Common/PageTitle.vue';

const router = useRouter();
const { currentMinuteur } = storeToRefs(useMinuteursStore());
const { participants } = storeToRefs(useEnvStore());
const { loadStudyData } = useEnvStore();

const checkInterval = ref(null);
const selectedCourse = ref(null);
const isLoadingCourses = ref(false);
const isLoadingContent = ref(false);
const showImportedCourses = ref(false);
const selectedCourseContent = ref('');
const importedCourses = ref([]);

const studyStatus = computed(() => {
	return !!(currentMinuteur.value.id && !currentMinuteur.value.end);
});

const sortedParticipants = computed(() => {
	return participants.value.slice(1).sort((a, b) => (b.duration_today > a.duration_today ? 1 : -1));
});

async function loadImportedCourses() {
	isLoadingCourses.value = true;
	try {
		const credentials = getCredentials();
		const response = await fetch(`import/getCourses`, {
			credentials,
		});

		if (response.success) {
			importedCourses.value = response.data.map((course) => ({
				...course,
				date: dayjs(course.created_at).format('YYYY-MM-DD'),
			}));
		} else {
			console.error('Erreur API:', response.message);
			importedCourses.value = [];
		}
	} catch (error) {
		console.error('Erreur réseau:', error);
		importedCourses.value = [];
	} finally {
		isLoadingCourses.value = false;
	}
}

async function loadCourseContent(courseId) {
	isLoadingContent.value = true;
	selectedCourseContent.value = null;
	selectedCourse.value = importedCourses.value.find((c) => c.id === courseId);

	try {
		const credentials = getCredentials();
		const response = await fetch(`import/getFileContent`, {
			import_id: courseId,
			credentials,
		});

		if (response.success) {
			selectedCourseContent.value = {
				...response.data,
				file_url: response.data.is_pdf ? response.data.file_url : '',
				can_download: true,
			};
		} else {
			throw new Error(response.message || 'Impossible de charger le fichier');
		}
	} catch (error) {
		console.error('Erreur détaillée:', error);
		selectedCourseContent.value = {
			error: true,
			message: error.message || 'Erreur lors du chargement du fichier',
		};
	} finally {
		isLoadingContent.value = false;
	}
}

function closeCourse() {
	selectedCourse.value = null;
	selectedCourseContent.value = null;
}

function viewCourses() {
	showImportedCourses.value = !showImportedCourses.value;
	if (showImportedCourses.value) {
		loadImportedCourses();
	}
}

function formatFileSize(bytes) {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileIcon(type) {
	const typeMapping = {
		pdf: '📄',
		document: '📝',
		spreadsheet: '📊',
		csv: '📊',
		json: '📋',
		xml: '🗂️',
		ical: '📅',
		text: '📄',
		markdown: '📄',
	};
	return typeMapping[type?.toLowerCase()] || '📁';
}

onMounted(() => {
	loadStudyData();
	checkInterval.value = setInterval(loadStudyData, 1000);
});

onBeforeUnmount(() => {
	clearInterval(checkInterval.value);
	closeCourse();
});
</script>

<template>
	<AppLayout title="Espace d'étude" data-testid="env_view">
		<MainContainer class="py-5 border-b border-default-background-separator flex justify-between items-center">
			<div class="flex items-center space-x-4 sm:space-x-6">
				<PageTitle :icon="UserGroupIcon" title="Espace d'étude"></PageTitle>
			</div>

			<button class="view-courses-btn-header" @click="viewCourses">
				<span class="courses-icon">📚</span>
				<span class="courses-text">{{ showImportedCourses ? 'Masquer les cours' : 'Voir les cours' }}</span>
			</button>
		</MainContainer>

		<div class="study-room-wrapper">
			<div class="flex-container" :class="{ 'with-course': selectedCourse }">
				<!-- Espace d'étude principal -->
				<div class="study-room-container" :class="{ 'with-course': selectedCourse }">
					<div class="status-pill">
						<span class="status-dot" :class="{ 'active-dot': studyStatus, 'paused-dot': !studyStatus }"></span>
						<span class="status-label">
							{{ studyStatus ? 'En étude |' : 'En pause |' }}
						</span>
						<span class="member-count">{{ participants.length }} étudiants</span>
					</div>

					<!-- Grille des participants -->
					<div class="participants-grid">
						<!-- Utilisateur actuel -->
						<div class="participant-card active">
							<div class="user-avatar">
								<div class="avatar-placeholder"></div>
							</div>
							<div class="participant-info">
								<div class="participant-name">{{ participants[0]?.name }}</div>
								<div class="study-time">{{ participants[0]?.duration_today }}</div>
								<div v-if="participants[0]?.is_active" class="live-status">
									<span class="live-dot"></span>
									En direct
								</div>
								<div v-else-if="participants[0]?.duration_today_seconds" class="paused-status">En pause</div>
								<div v-else class="paused-status">Suspendu</div>
							</div>
						</div>

						<!-- Autres participants -->
						<div
							class="participant-card"
							v-for="participant in sortedParticipants"
							:key="participant.user_id"
							:class="{ paused: !participant.is_active, active: participant.is_active }"
						>
							<div class="user-avatar">
								<div class="avatar-placeholder"></div>
								<div v-if="participant.is_active" class="active-indicator"></div>
							</div>
							<div class="participant-info">
								<div class="participant-name">{{ participant.name }}</div>
								<div class="study-time">{{ participant.duration_today }}</div>
								<div v-if="participant.is_active" class="live-status">
									<span class="live-dot"></span>
									En direct
								</div>
								<div v-else-if="participant.duration_today_seconds" class="paused-status">En pause</div>
								<div v-else class="paused-status">Suspendu</div>
							</div>
						</div>

						<!-- Espaces vides -->
						<div v-for="i in Math.max(0, 12 - participants.length)" :key="'empty-' + i" class="participant-card empty">
							<div class="user-avatar">
								<div class="avatar-placeholder empty"></div>
							</div>
							<div class="participant-info">
								<div class="placeholder-name"></div>
								<div class="placeholder-time"></div>
							</div>
						</div>
					</div>

					<div class="study-status-indicator">
						<span class="status-dot" :class="{ 'active-dot': studyStatus, 'paused-dot': !studyStatus }"></span>
						<span class="status-text">
							{{ studyStatus ? "Session d'étude en cours" : 'Session en pause' }}
						</span>
					</div>
				</div>

				<!-- Affichage du cours sélectionné -->
				<div v-if="selectedCourseContent" class="file-display">
					<div class="file-header">
						<div class="file-info">
							<span class="file-icon">{{ getFileIcon(selectedCourseContent.file_type) }}</span>
							<div>
								<h3 class="file-name">{{ selectedCourseContent.file_name }}</h3>
								<p class="file-meta">
									{{ selectedCourseContent.file_type?.toUpperCase() }} •
									{{ formatFileSize(selectedCourseContent.file_size) }}
								</p>
							</div>
						</div>
						<button @click="closeCourse" class="close-btn">
							<XMarkIcon class="w-5 h-5" />
						</button>
					</div>

					<div v-if="isLoadingContent" class="loading-content">Chargement du contenu...</div>

					<div v-else-if="selectedCourseContent.error" class="error-message">
						{{ selectedCourseContent.message }}
					</div>

					<div v-else-if="selectedCourseContent.is_pdf" class="pdf-container">
						<iframe
							v-if="selectedCourseContent.file_url"
							:src="selectedCourseContent.file_url"
							class="pdf-viewer"
							title="Aperçu du PDF"
						></iframe>
					</div>

					<div v-else-if="!selectedCourseContent.can_display" class="display-message">
						{{ selectedCourseContent.display_message }}
						<a
							v-if="selectedCourseContent.file_path"
							:href="'/etutime/' + selectedCourseContent.file_path"
							download
							class="download-btn"
						>
							<ArrowDownTrayIcon class="w-4 h-4 mr-2" />
							Télécharger le fichier
						</a>
					</div>

					<pre v-else class="file-content">{{ selectedCourseContent.content }}</pre>
				</div>
			</div>

			<!-- Modal des cours importés -->
			<div v-if="showImportedCourses" class="imported-courses-overlay" @click.self="showImportedCourses = false">
				<div class="imported-courses-container">
					<div class="imported-courses-header">
						<h2 class="imported-courses-title">Cours importés</h2>
						<button class="close-courses-btn" @click="showImportedCourses = false">×</button>
					</div>

					<div class="courses-list">
						<div v-if="isLoadingCourses" class="courses-loading">
							<div class="loading-spinner"></div>
							<p>Chargement des cours...</p>
						</div>

						<div v-else-if="importedCourses.length > 0" class="courses-grid">
							<div
								v-for="course in importedCourses"
								:key="course.id"
								class="course-card"
								@click="loadCourseContent(course.id)"
							>
								<div class="course-card-icon">
									<span class="file-icon">{{ getFileIcon(course.file_type) }}</span>
								</div>
								<div class="course-card-content">
									<h3 class="course-card-title">{{ course.title }}</h3>
									<p class="course-card-date">{{ course.date }}</p>
									<p class="course-card-type">{{ course.file_type?.toUpperCase() }}</p>
								</div>
							</div>
						</div>

						<div v-else class="no-courses">
							<BookOpenIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
							<p>Aucun cours importé pour le moment</p>
							<button class="import-btn" @click="router.push('/import')">Importer des cours</button>
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

.file-display {
	flex: 1;
	height: 85vh;
	background-color: var(--color-bg-primary);
	border-radius: 8px;
	padding: 25px;
	box-shadow: 0 1px 3px var(--shadow-light);
	display: flex;
	flex-direction: column;
	border: 1px solid var(--border-primary);
}

.file-viewer {
	width: 100%;
	height: 100%;
	min-height: 500px;
	border: none;
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

.status-dot.paused-dot {
	background-color: var(--accent-red);
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

.participant-card.paused {
	opacity: 0.7;
	border-left: 4px solid var(--accent-red);
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

.study-status-indicator {
	padding: 10px 15px;
	background-color: var(--bg-tertiary);
	border-radius: 6px;
	display: inline-flex;
	align-items: center;
	margin: 15px 0;
}

.status-text {
	margin-left: 8px;
	font-weight: 500;
}

/* Styles pour l'overlay et la liste des cours importés */
.imported-courses-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
}

.imported-courses-container {
	width: 90%;
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

.courses-loading {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40px;
	color: var(--text-secondary);
}

.loading-spinner {
	width: 32px;
	height: 32px;
	border: 3px solid var(--border-primary);
	border-top: 3px solid var(--accent-blue);
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin-bottom: 16px;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.courses-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	gap: 15px;
	padding: 10px 0;
}

.course-card {
	border: 1px solid var(--border-primary);
	border-radius: 6px;
	padding: 15px;
	cursor: pointer;
	transition: all 0.2s ease;
	display: flex;
	align-items: flex-start;
	background-color: var(--color-bg-primary);
}

.course-card:hover {
	background-color: var(--color-bg-secondary);
	border-color: var(--border-secondary);
	transform: translateY(-2px);
	box-shadow: 0 2px 8px var(--shadow-light);
}

.course-card-icon {
	margin-right: 12px;
	flex-shrink: 0;
}

.course-card-content {
	flex-grow: 1;
}

.course-card-title {
	font-size: 15px;
	font-weight: 500;
	color: var(--text-primary);
	margin: 0 0 5px;
	line-height: 1.4;
}

.course-card-date {
	font-size: 12px;
	color: var(--text-tertiary);
	margin: 0 0 3px;
}

.course-card-type {
	font-size: 11px;
	color: var(--text-tertiary);
	background-color: var(--bg-tertiary);
	padding: 2px 6px;
	border-radius: 3px;
	display: inline-block;
	margin: 0;
}

.no-courses {
	text-align: center;
	padding: 40px 20px;
	color: var(--text-tertiary);
}

.import-btn {
	margin-top: 15px;
	padding: 10px 20px;
	background-color: var(--accent-blue);
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
	font-weight: 500;
	transition: all 0.2s ease;
}

.import-btn:hover {
	background-color: var(--accent-blue);
	filter: brightness(1.1);
	transform: translateY(-1px);
}

.error-message,
.other-file {
	padding: 20px;
	text-align: center;
	color: var(--text-primary);
}

.download-btn {
	display: inline-block;
	padding: 10px 15px;
	background: var(--accent-green);
	color: white;
	text-decoration: none;
	border-radius: 4px;
	margin-top: 10px;
	transition: all 0.2s ease;
}

.download-btn:hover {
	background: var(--accent-blue);
}

/* Responsive pour les cours */
@media (max-width: 768px) {
	.flex-container {
		flex-direction: column;
	}

	.flex-container.with-course .study-room-container,
	.file-display {
		width: 100%;
	}

	.imported-courses-container {
		width: 95%;
		padding: 20px;
		max-height: 90vh;
	}

	.courses-grid {
		grid-template-columns: 1fr;
	}

	.course-card {
		padding: 12px;
	}
}
.participant-card.active {
	border-left: 4px solid var(--accent-green);
	background-color: rgba(34, 197, 94, 0.05);
}

.active-indicator {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 12px;
	height: 12px;
	background-color: var(--accent-green);
	border-radius: 50%;
	border: 2px solid var(--color-bg-primary);
}

.live-status {
	display: flex;
	align-items: center;
	font-size: 12px;
	color: var(--accent-green);
	margin-top: 4px;
}

.live-dot {
	width: 8px;
	height: 8px;
	background-color: var(--accent-green);
	border-radius: 50%;
	margin-right: 4px;
	animation: pulse 1.5s infinite;
}

@keyframes pulse {
	0% {
		opacity: 1;
	}
	50% {
		opacity: 0.5;
	}
	100% {
		opacity: 1;
	}
}
/* Ajouter ces styles */
.participant-card.active {
	border-left: 4px solid var(--accent-green);
	background-color: rgba(34, 197, 94, 0.05);
}

.active-indicator {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 12px;
	height: 12px;
	background-color: var(--accent-green);
	border-radius: 50%;
	border: 2px solid var(--color-bg-primary);
}

.live-status {
	display: flex;
	align-items: center;
	font-size: 12px;
	color: var(--accent-green);
	margin-top: 4px;
}

.paused-status {
	font-size: 12px;
	color: var(--accent-red);
	margin-top: 4px;
}

.live-dot {
	width: 8px;
	height: 8px;
	background-color: var(--accent-green);
	border-radius: 50%;
	margin-right: 4px;
	animation: pulse 1.5s infinite;
}

@keyframes pulse {
	0% {
		opacity: 1;
	}
	50% {
		opacity: 0.5;
	}
	100% {
		opacity: 1;
	}
}

.study-time {
	font-family: 'Courier New', monospace;
	font-weight: bold;
}
/* Styles inchangés de l'espace d'étude */
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

.file-display {
	flex: 1;
	height: 85vh;
	background-color: var(--color-bg-primary);
	border-radius: 8px;
	padding: 25px;
	box-shadow: 0 1px 3px var(--shadow-light);
	display: flex;
	flex-direction: column;
	border: 1px solid var(--border-primary);
}

.file-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 20px;
	border-bottom: 1px solid var(--border-primary);
	margin-bottom: 20px;
}

.file-info {
	display: flex;
	align-items: center;
	gap: 12px;
}

.file-icon {
	font-size: 24px;
}

.file-name {
	font-size: 18px;
	font-weight: 600;
	margin: 0;
	color: var(--text-primary);
}

.file-meta {
	font-size: 14px;
	color: var(--text-secondary);
	margin: 4px 0 0;
}

.close-btn {
	background: none;
	border: none;
	cursor: pointer;
	color: var(--text-secondary);
	padding: 8px;
	border-radius: 50%;
	transition: all 0.2s ease;
}

.close-btn:hover {
	background-color: var(--bg-tertiary);
	color: var(--text-primary);
}

.loading-content {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40px;
	color: var(--text-secondary);
	font-style: italic;
}

.error-message {
	color: var(--accent-red);
	padding: 20px;
	text-align: center;
}

.pdf-container {
	flex: 1;
	min-height: 600px;
}

.pdf-viewer {
	width: 100%;
	height: 100%;
	min-height: 600px;
	border: none;
	border-radius: 0.5rem;
}

.display-message {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 3rem;
	color: var(--text-secondary);
	font-style: italic;
	text-align: center;
	background-color: var(--bg-secondary);
	border-radius: 0.5rem;
	margin: 1.5rem;
}

.download-btn {
	display: inline-flex;
	align-items: center;
	padding: 10px 15px;
	background: var(--accent-blue);
	color: white;
	text-decoration: none;
	border-radius: 4px;
	margin-top: 15px;
	transition: all 0.2s ease;
}

.download-btn:hover {
	background: var(--accent-blue-dark);
}

.file-content {
	flex: 1;
	margin: 0;
	padding: 1.5rem;
	background-color: var(--bg-secondary);
	color: var(--text-primary);
	font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
	font-size: 0.875rem;
	line-height: 1.5;
	overflow: auto;
	white-space: pre-wrap;
	word-wrap: break-word;
	border: none;
}

/* Styles pour la modal des cours importés */
.imported-courses-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
}

.imported-courses-container {
	width: 90%;
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

.courses-loading {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40px;
	color: var(--text-secondary);
}

.loading-spinner {
	width: 32px;
	height: 32px;
	border: 3px solid var(--border-primary);
	border-top: 3px solid var(--accent-blue);
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin-bottom: 16px;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.courses-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	gap: 15px;
	padding: 10px 0;
}

.course-card {
	border: 1px solid var(--border-primary);
	border-radius: 6px;
	padding: 15px;
	cursor: pointer;
	transition: all 0.2s ease;
	display: flex;
	align-items: flex-start;
	background-color: var(--color-bg-primary);
}

.course-card:hover {
	background-color: var(--color-bg-secondary);
	border-color: var(--border-secondary);
	transform: translateY(-2px);
	box-shadow: 0 2px 8px var(--shadow-light);
}

.course-card-icon {
	margin-right: 12px;
	flex-shrink: 0;
	font-size: 24px;
}

.course-card-content {
	flex-grow: 1;
}

.course-card-title {
	font-size: 15px;
	font-weight: 500;
	color: var(--text-primary);
	margin: 0 0 5px;
	line-height: 1.4;
}

.course-card-date {
	font-size: 12px;
	color: var(--text-tertiary);
	margin: 0 0 3px;
}

.course-card-type {
	font-size: 11px;
	color: var(--text-tertiary);
	background-color: var(--bg-tertiary);
	padding: 2px 6px;
	border-radius: 3px;
	display: inline-block;
	margin: 0;
}

.no-courses {
	text-align: center;
	padding: 40px 20px;
	color: var(--text-tertiary);
}

.import-btn {
	margin-top: 15px;
	padding: 10px 20px;
	background-color: var(--accent-blue);
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
	font-weight: 500;
	transition: all 0.2s ease;
}

.import-btn:hover {
	background-color: var(--accent-blue);
	filter: brightness(1.1);
	transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
	.flex-container {
		flex-direction: column;
	}

	.flex-container.with-course .study-room-container,
	.file-display {
		width: 100%;
	}

	.imported-courses-container {
		width: 95%;
		padding: 20px;
		max-height: 90vh;
	}

	.courses-grid {
		grid-template-columns: 1fr;
	}

	.course-card {
		padding: 12px;
	}
}
</style>
