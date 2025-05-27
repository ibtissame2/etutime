<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import { ref } from 'vue';

const user = ref({
	name: 'Sarah Martin',
	email: 'sarah.martin@example.com',
	avatar: '/api/placeholder/120/120',
	role: 'Étudiant',
	program: "Sciences de l'informatique",
	joinedAt: '12 mars 2024',
	phone: '+33 6 12 34 56 78',
	location: 'Paris, France',
	bio: "Passionnée par le développement web et les nouvelles technologies. Toujours en quête d'apprentissage et d'innovation.",
});

// Pour la démo de mise à jour de profil
const editMode = ref(false);
const editableUser = ref({ ...user.value });

function saveProfile() {
	user.value = { ...editableUser.value };
	editMode.value = false;
	// Dans un cas réel, il y aurait ici un appel API pour sauvegarder les modifications
}

function cancelEdit() {
	editableUser.value = { ...user.value };
	editMode.value = false;
}
</script>

<template>
	<AppLayout title="Profil">
		<div class="profile-page">
			<!-- En-tête du profil avec avatar et infos principales -->
			<div class="profile-header">
				<div class="profile-cover-image"></div>

				<div class="profile-header-content">
					<div class="profile-avatar">
						<img :src="user.avatar" alt="Avatar de profil" class="avatar-image" />
						<div v-if="!editMode" class="edit-avatar-overlay">
							<span class="edit-icon">📷</span>
						</div>
					</div>

					<div class="profile-main-info">
						<div v-if="!editMode" class="profile-name">{{ user.name }}</div>
						<input v-else v-model="editableUser.name" class="edit-input name-input" type="text" />

						<div class="profile-details">
							<div class="detail-item">
								<span class="detail-icon">✉️</span>
								<span v-if="!editMode" class="detail-text">{{ user.email }}</span>
								<input v-else v-model="editableUser.email" class="edit-input" type="email" />
							</div>
							<div class="detail-item">
								<span class="detail-icon">📱</span>
								<span v-if="!editMode" class="detail-text">{{ user.phone }}</span>
								<input v-else v-model="editableUser.phone" class="edit-input" type="tel" />
							</div>
							<div class="detail-item">
								<span class="detail-icon">👨‍🎓</span>
								<span v-if="!editMode" class="detail-text">{{ user.role }}</span>
								<input v-else v-model="editableUser.role" class="edit-input" type="text" />
							</div>
							<div class="detail-item">
								<span class="detail-icon">🎓</span>
								<span v-if="!editMode" class="detail-text">{{ user.program }}</span>
								<input v-else v-model="editableUser.program" class="edit-input" type="text" />
							</div>
							<div class="detail-item">
								<span class="detail-icon">📍</span>
								<span v-if="!editMode" class="detail-text">{{ user.location }}</span>
								<input v-else v-model="editableUser.location" class="edit-input" type="text" />
							</div>
							<div class="detail-item">
								<span class="detail-icon">📅</span>
								<span class="detail-text">Membre depuis {{ user.joinedAt }}</span>
							</div>
						</div>
					</div>

					<div class="profile-actions">
						<button v-if="!editMode" @click="editMode = true" class="edit-profile-btn">Modifier le profil</button>
						<div v-else class="edit-actions">
							<button @click="saveProfile" class="save-btn">Enregistrer</button>
							<button @click="cancelEdit" class="cancel-btn">Annuler</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Section Biographie -->
			<div class="profile-bio-section">
				<h2 class="section-title">À propos</h2>
				<div class="bio-content">
					<div v-if="!editMode" class="bio-text">{{ user.bio }}</div>
					<textarea
						v-else
						v-model="editableUser.bio"
						class="edit-textarea"
						rows="4"
						placeholder="Parlez-nous de vous..."
					></textarea>
				</div>
			</div>
		</div>
	</AppLayout>
</template>

<style scoped>
.profile-page {
	font-family: 'Inter', 'Roboto', sans-serif;
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;
	color: var(--text-primary);
	background-color: var(--color-bg-primary);
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

.edit-profile-btn:hover {
	background-color: var(--accent-hover);
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

.save-btn:hover {
	background-color: var(--accent-hover);
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

.cancel-btn:hover {
	background-color: var(--color-bg-tertiay);
	color: var(--text-primary);
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
