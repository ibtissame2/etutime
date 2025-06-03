<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { getCredentials } from '@/store/axios';

const apiBaseUrl = 'http://localhost/etutime/front-end/src/API/profil';
const editMode = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const user = ref({
	id: null,
	first_name: '',
	last_name: '',
	name: '',
	email: '',
	avatar: '/api/placeholder/120/120',
	role: 'Étudiant',
	program: '',
	joinedAt: '',
	phone: '',
	location: '',
	bio: '',
});
const editableUser = ref({ ...user.value });

async function loadProfile() {
	try {
		isLoading.value = true;
		errorMessage.value = '';

		console.log('Chargement du profil...');
		const credentials = getCredentials();
		const response = await axios.get(`${apiBaseUrl}/get_profile.php`, {
			params: { credentials },
			withCredentials: true,
			timeout: 10000,
		});

		console.log('Réponse du serveur:', response.data);

		if (response.data.success) {
			const profileData = response.data.profile;

			user.value = {
				id: profileData.id,
				first_name: profileData.first_name,
				last_name: profileData.last_name,
				name: `${profileData.first_name} ${profileData.last_name}`,
				email: profileData.email,
				joinedAt: new Date(profileData.created_at).toLocaleDateString('fr-FR', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				}),
				avatar: profileData.profile_photo_path
					? `/storage/${profileData.profile_photo_path}`
					: '/api/placeholder/120/120',
				role: profileData.role || 'Étudiant',
				program: profileData.program || '',
				phone: profileData.phone || '',
				location: profileData.location || '',
				bio: profileData.bio || '',
			};

			editableUser.value = { ...user.value };
			console.log('Profil chargé avec succès:', user.value);
		} else {
			throw new Error(response.data.message || 'Erreur lors du chargement du profil');
		}
	} catch (error) {
		console.error('Erreur de chargement du profil:', error);
		errorMessage.value = error.response?.data?.message || error.message || 'Erreur lors du chargement du profil';
	} finally {
		isLoading.value = false;
	}
}

async function handleSubmit(e) {
	e.preventDefault();
	console.log('Formulaire soumis');
	await saveProfile();
}

async function saveProfile() {
	try {
		isLoading.value = true;
		errorMessage.value = '';
		successMessage.value = '';

		console.log('Début de la sauvegarde...');
		console.log('Données editableUser:', editableUser.value);

		// Vérification des champs requis
		if (
			!editableUser.value.first_name?.trim() ||
			!editableUser.value.last_name?.trim() ||
			!editableUser.value.email?.trim()
		) {
			throw new Error('Les champs Prénom, Nom et Email sont obligatoires');
		}

		// Validation de l'email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(editableUser.value.email.trim())) {
			throw new Error("Format d'email invalide");
		}

		const credentials = getCredentials();
		const dataToSend = {
			credentials,
			userData: {
				first_name: editableUser.value.first_name.trim(),
				last_name: editableUser.value.last_name.trim(),
				email: editableUser.value.email.trim(),
				role: editableUser.value.role || 'Étudiant',
				program: editableUser.value.program?.trim() || '',
				phone: editableUser.value.phone?.trim() || '',
				location: editableUser.value.location?.trim() || '',
				bio: editableUser.value.bio?.trim() || '',
			},
		};

		console.log("Données à envoyer à l'API:", dataToSend);

		const response = await axios.post(`${apiBaseUrl}/update_profile.php`, dataToSend, {
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			timeout: 15000,
		});

		console.log("Réponse de l'API:", response.data);

		if (response.data?.success) {
			// Mettre à jour les données locales
			user.value = {
				...editableUser.value,
				name: `${editableUser.value.first_name} ${editableUser.value.last_name}`,
			};

			editMode.value = false;
			successMessage.value = 'Profil mis à jour avec succès';

			console.log('Sauvegarde réussie');

			setTimeout(() => {
				successMessage.value = '';
			}, 5000);
		} else {
			throw new Error(response.data?.message || 'Erreur inconnue lors de la mise à jour');
		}
	} catch (error) {
		console.error('Erreur complète:', error);

		if (error.response) {
			console.error('Status:', error.response.status);
			console.error('Data:', error.response.data);

			switch (error.response.status) {
				case 401:
					errorMessage.value = 'Session expirée. Veuillez vous reconnecter.';
					break;
				case 400:
					errorMessage.value = error.response.data?.message || 'Données invalides';
					break;
				case 404:
					errorMessage.value = 'Utilisateur non trouvé';
					break;
				case 500:
					errorMessage.value = 'Erreur serveur. Veuillez réessayer plus tard.';
					break;
				default:
					errorMessage.value = error.response.data?.message || `Erreur serveur (${error.response.status})`;
			}
		} else if (error.request) {
			console.error('Erreur réseau:', error.request);
			errorMessage.value = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
		} else {
			console.error('Erreur:', error.message);
			errorMessage.value = error.message || 'Erreur inconnue lors de la mise à jour du profil';
		}
	} finally {
		isLoading.value = false;
	}
}

function cancelEdit() {
	editableUser.value = { ...user.value };
	editMode.value = false;
	errorMessage.value = '';
	successMessage.value = '';
	console.log('Édition annulée');
}

function clearMessages() {
	errorMessage.value = '';
	successMessage.value = '';
}

onMounted(() => {
	console.log('Composant monté, chargement du profil...');
	loadProfile();
});
</script>

<template>
	<AppLayout title="Profil">
		<div class="profile-page">
			<!-- Messages d'erreur/succès -->
			<div v-if="errorMessage" class="error-message" @click="clearMessages">
				{{ errorMessage }}
				<button type="button" class="close-btn">×</button>
			</div>
			<div v-if="successMessage" class="success-message" @click="clearMessages">
				{{ successMessage }}
				<button type="button" class="close-btn">×</button>
			</div>

			<!-- Indicateur de chargement -->
			<div v-if="isLoading && !editMode" class="loading-indicator">Chargement du profil...</div>

			<!-- Formulaire de profil -->
			<form @submit="handleSubmit" class="profile-form" v-if="!isLoading || editMode">
				<!-- En-tête du profil -->
				<div class="profile-header">
					<div class="profile-cover-image"></div>

					<div class="profile-header-content">
						<div class="profile-avatar">
							<img :src="user.avatar" alt="" class="avatar-image" />
							<img
								class="student-icon-overlay h-8 w-8 rounded-full object-cover"
								src="https://cdn-icons-png.flaticon.com/512/3710/3710582.png"
								alt="Student"
							/>
							<div v-if="!editMode" class="edit-avatar-overlay">
								<span class="edit-icon">📷</span>
							</div>
						</div>

						<div class="profile-main-info">
							<template v-if="!editMode">
								<div class="profile-name">{{ user.name }}</div>
							</template>
							<template v-else>
								<input
									v-model="editableUser.first_name"
									id="first_name"
									name="first_name"
									class="edit-input name-input"
									placeholder="Prénom"
									type="text"
									required
									maxlength="255"
								/>
								<input
									v-model="editableUser.last_name"
									id="last_name"
									name="last_name"
									class="edit-input name-input"
									placeholder="Nom"
									type="text"
									required
									maxlength="255"
									style="margin-top: 8px"
								/>
							</template>

							<div class="profile-details">
								<div class="detail-item">
									<span class="detail-icon">✉️</span>
									<span v-if="!editMode" class="detail-text">{{ user.email }}</span>
									<input
										v-else
										v-model="editableUser.email"
										id="email"
										name="email"
										class="edit-input"
										type="email"
										required
										maxlength="255"
									/>
								</div>
								<div class="detail-item">
									<span class="detail-icon">📱</span>
									<span v-if="!editMode" class="detail-text">{{ user.phone || 'Non renseigné' }}</span>
									<input
										v-else
										v-model="editableUser.phone"
										id="phone"
										name="phone"
										class="edit-input"
										type="tel"
										placeholder="Téléphone"
										maxlength="20"
									/>
								</div>
								<div class="detail-item">
									<span class="detail-icon">👨‍🎓</span>
									<span v-if="!editMode" class="detail-text">{{ user.role }}</span>
									<select v-else v-model="editableUser.role" id="role" name="role" class="edit-input">
										<option value="Étudiant">Étudiant</option>
										<option value="Enseignant">Enseignant</option>
										<option value="Administrateur">Administrateur</option>
									</select>
								</div>
								<div class="detail-item">
									<span class="detail-icon">🎓</span>
									<span v-if="!editMode" class="detail-text">{{ user.program || 'Non renseigné' }}</span>
									<input
										v-else
										v-model="editableUser.program"
										id="program"
										name="program"
										class="edit-input"
										type="text"
										placeholder="Programme d'étude"
										maxlength="255"
									/>
								</div>
								<div class="detail-item">
									<span class="detail-icon">📍</span>
									<span v-if="!editMode" class="detail-text">{{ user.location || 'Non renseigné' }}</span>
									<input
										v-else
										v-model="editableUser.location"
										id="location"
										name="location"
										class="edit-input"
										type="text"
										placeholder="Localisation"
										maxlength="255"
									/>
								</div>
								<div class="detail-item">
									<span class="detail-icon">📅</span>
									<span class="detail-text">Membre depuis {{ user.joinedAt }}</span>
								</div>
							</div>
						</div>

						<div class="profile-actions">
							<button
								v-if="!editMode"
								@click="editMode = true"
								type="button"
								class="edit-profile-btn"
								:disabled="isLoading"
							>
								Modifier le profil
							</button>
							<div v-else class="edit-actions">
								<button type="submit" class="save-btn" :disabled="isLoading">
									<span v-if="isLoading">Enregistrement...</span>
									<span v-else>Enregistrer</span>
								</button>
								<button @click="cancelEdit" type="button" class="cancel-btn" :disabled="isLoading">Annuler</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Section Biographie -->
				<div class="profile-bio-section">
					<h2 class="section-title">À propos</h2>
					<div class="bio-content">
						<div v-if="!editMode" class="bio-text">{{ user.bio || 'Aucune biographie renseignée' }}</div>
						<textarea
							v-else
							v-model="editableUser.bio"
							id="bio"
							name="bio"
							class="edit-textarea"
							rows="4"
							placeholder="Parlez-nous de vous..."
							maxlength="1000"
						></textarea>
					</div>
				</div>
			</form>
		</div>
	</AppLayout>
</template>

<style scoped>
/* Styles pour la page de profil */
.student-icon-overlay {
	position: absolute;
	bottom: 10px;
	left: 10px;
	width: 100%;
	height: 100%;
	border-radius: 100%;
	background: var(--color-bg-tertiay);
	box-shadow: 0 1px 4px var(--shadow-color);
	pointer-events: none;
	border: 2px solid var(--color-bg-secondart);
}

.profile-page {
	font-family: 'Inter', 'Roboto', sans-serif;
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;
	color: var(--text-primary);
	background-color: var(--color-bg-primary);
}

.profile-form {
	display: block;
}

.error-message {
	background-color: #f8d7da;
	color: #721c24;
	padding: 12px;
	border-radius: 4px;
	margin-bottom: 20px;
	border: 1px solid #f5c6cb;
	position: relative;
	cursor: pointer;
}

.success-message {
	background-color: #d4edda;
	color: #155724;
	padding: 12px;
	border-radius: 4px;
	margin-bottom: 20px;
	border: 1px solid #c3e6cb;
	position: relative;
	cursor: pointer;
}

.close-btn {
	position: absolute;
	top: 8px;
	right: 12px;
	background: none;
	border: none;
	font-size: 18px;
	cursor: pointer;
	color: inherit;
	opacity: 0.7;
}

.close-btn:hover {
	opacity: 1;
}

.loading-indicator {
	text-align: center;
	padding: 40px;
	font-size: 16px;
	color: var(--text-secondary);
}

/* Variables CSS pour le mode sombre/clair automatique */
:root {
	--color-bg-primary: #ffffff;
	--color-bg-secondart: #f8f9fa;
	--color-bg-tertiay: #ffffff;
	--text-primary: #212529;
	--text-secondary: #6c757d;
	--border-color: #dee2e6;
	--shadow-color: rgba(0, 0, 0, 0.1);
	--accent-color: #007bff;
	--accent-hover: #0056b3;
	--input-bg: #ffffff;
	--input-border: #ced4da;
}

@media (prefers-color-scheme: dark) {
	:root {
		--color-bg-primary: #101012;
		--color-bg-secondary: #17181b;
		--color-bg-tertiary: #2a2c32;
		--text-primary: #e4e6eb;
		--text-secondary: #b0b3b8;
		--border-color: #4a4b4c;
		--shadow-color: rgba(0, 0, 0, 0.3);
		--accent-color: #007bff;
		--accent-hover: #0056b3;
		--input-bg: #3a3b3c;
		--input-border: #4a4b4c;
	}
}

/* En-tête du profil */
.profile-header {
	background-color: var(--color-bg-secondart);
	border-radius: 8px;
	box-shadow: 0 2px 8px var(--shadow-color);
	margin-bottom: 24px;
	overflow: hidden;
	border: 1px solid var(--border-color);
}

.profile-cover-image {
	height: 100px;
	background: linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%);
	position: relative;
}

@media (prefers-color-scheme: dark) {
	.profile-cover-image {
		background: linear-gradient(135deg, #3a3b3c 0%, #2d2e2f 100%);
	}
}

.profile-header-content {
	padding: 20px 30px 30px;
	display: grid;
	grid-template-columns: auto 1fr auto;
	align-items: start;
	gap: 30px;
	margin-top: -40px;
}

.profile-avatar {
	position: relative;
	grid-column: 1;
}

.avatar-image {
	width: 100px;
	height: 100px;
	border-radius: 50%;
	border: 3px solid var(--color-bg-secondart);
	background-color: var(--color-bg-tertiay);
	object-fit: cover;
	box-shadow: 0 2px 8px var(--shadow-color);
}

.edit-avatar-overlay {
	position: absolute;
	bottom: 2px;
	right: 2px;
	width: 28px;
	height: 28px;
	border-radius: 50%;
	background-color: var(--color-bg-tertiay);
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	box-shadow: 0 1px 4px var(--shadow-color);
	border: 2px solid var(--color-bg-secondart);
	transition: all 0.2s ease;
}

.edit-avatar-overlay:hover {
	background-color: var(--accent-color);
	color: white;
}

.edit-icon {
	font-size: 12px;
}

.profile-main-info {
	grid-column: 2;
	padding-top: 20px;
}

.profile-name {
	font-size: 24px;
	font-weight: 600;
	margin-bottom: 16px;
	color: var(--text-primary);
	line-height: 1.2;
}

.profile-details {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 12px;
}

.detail-item {
	display: flex;
	align-items: center;
	font-size: 14px;
	color: var(--text-secondary);
	padding: 4px 0;
}

.detail-icon {
	margin-right: 8px;
	font-size: 16px;
	width: 20px;
	text-align: center;
}

.detail-text {
	flex: 1;
	word-break: break-word;
}

.profile-actions {
	grid-column: 3;
	padding-top: 20px;
}

.edit-profile-btn {
	background-color: var(--accent-color);
	color: white;
	border: none;
	padding: 10px 16px;
	border-radius: 6px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
	font-size: 14px;
}

.edit-profile-btn:hover:not(:disabled) {
	background-color: var(--accent-hover);
}

.edit-profile-btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.edit-actions {
	display: flex;
	gap: 8px;
}

.save-btn {
	background-color: var(--accent-color);
	color: white;
	border: none;
	padding: 8px 14px;
	border-radius: 5px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
	font-size: 14px;
}

.save-btn:hover:not(:disabled) {
	background-color: var(--accent-hover);
}

.save-btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.cancel-btn {
	background-color: transparent;
	color: var(--text-secondary);
	border: 1px solid var(--border-color);
	padding: 7px 13px;
	border-radius: 5px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
	font-size: 14px;
}

.cancel-btn:hover:not(:disabled) {
	background-color: var(--color-bg-tertiay);
	color: var(--text-primary);
}

.cancel-btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.edit-input {
	border: 1px solid var(--input-border);
	background-color: var(--input-bg);
	color: var(--text-primary);
	border-radius: 4px;
	padding: 6px 10px;
	font-size: 14px;
	width: 100%;
	transition: border-color 0.2s ease;
}

.edit-input:focus {
	outline: none;
	border-color: var(--accent-color);
}

.name-input {
	font-size: 20px;
	font-weight: 600;
	margin-bottom: 16px;
	padding: 8px 12px;
}

/* Section Biographie */
.profile-bio-section {
	background-color: var(--color-bg-secondart);
	border-radius: 8px;
	box-shadow: 0 2px 8px var(--shadow-color);
	padding: 24px;
	border: 1px solid var(--border-color);
}

.section-title {
	font-size: 18px;
	font-weight: 600;
	margin-bottom: 16px;
	color: var(--text-primary);
}

.bio-content {
	line-height: 1.6;
}

.bio-text {
	color: var(--text-secondary);
	font-size: 16px;
	line-height: 1.7;
}

.edit-textarea {
	border: 1px solid var(--input-border);
	background-color: var(--input-bg);
	color: var(--text-primary);
	border-radius: 4px;
	padding: 10px 12px;
	font-size: 14px;
	width: 100%;
	resize: vertical;
	min-height: 80px;
	font-family: inherit;
	line-height: 1.4;
	transition: border-color 0.2s ease;
}

.edit-textarea:focus {
	outline: none;
	border-color: var(--accent-color);
}

/* Responsive Design */
@media (max-width: 768px) {
	.profile-page {
		padding: 16px;
	}

	.profile-header-content {
		grid-template-columns: 1fr;
		justify-items: center;
		text-align: center;
		padding: 16px 20px 20px;
		gap: 16px;
	}

	.profile-main-info {
		grid-column: 1;
		padding-top: 0;
	}

	.profile-actions {
		grid-column: 1;
		padding-top: 0;
	}

	.profile-details {
		grid-template-columns: 1fr;
	}

	.profile-bio-section {
		padding: 20px;
	}
}

@media (max-width: 480px) {
	.profile-header-content {
		padding: 12px 16px 16px;
		gap: 12px;
	}

	.avatar-image {
		width: 80px;
		height: 80px;
	}

	.edit-actions {
		flex-direction: column;
		flex-direction: column;
		width: 100%;
		gap: 6px;
	}

	.save-btn,
	.cancel-btn,
	.edit-profile-btn {
		width: 100%;
		padding: 10px;
	}

	.profile-bio-section {
		padding: 16px;
	}
}
</style>
