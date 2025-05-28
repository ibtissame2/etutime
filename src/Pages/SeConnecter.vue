<template>
	<div class="auth-container">
		<div class="app-branding">
			<h1>Etutime</h1>
			<p>Gestion de temps et organisation d'études</p>
		</div>

		<div class="auth-card">
			<div class="auth-tabs">
				<button :class="['tab-btn', { active: activeTab === 'login' }]" @click="activeTab = 'login'">
					<i class="fas fa-sign-in-alt"></i> Connexion
				</button>
				<button :class="['tab-btn', { active: activeTab === 'register' }]" @click="activeTab = 'register'">
					<i class="fas fa-user-plus"></i> Inscription
				</button>
			</div>

			<!-- Formulaire de connexion -->
			<div v-if="activeTab === 'login'" class="auth-form">
				<h2>Connexion à votre compte étudiant</h2>

				<form @submit.prevent="handleLogin">
					<div class="form-group">
						<label for="login-email">Email académique</label>
						<div class="input-with-icon">
							<i class="fas fa-envelope"></i>
							<input
								id="login-email"
								type="email"
								v-model="loginForm.email"
								placeholder="exemple@etudiant.fr"
								required
							/>
						</div>
						<p v-if="errors.loginEmail" class="error-text">{{ errors.loginEmail }}</p>
					</div>

					<div class="form-group">
						<label for="login-password">Mot de passe</label>
						<div class="input-with-icon">
							<i class="fas fa-lock"></i>
							<input
								id="login-password"
								:type="showLoginPassword ? 'text' : 'password'"
								v-model="loginForm.password"
								placeholder="Entrez votre mot de passe"
								required
							/>
							<button type="button" class="toggle-password" @click="showLoginPassword = !showLoginPassword">
								<i :class="showLoginPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
							</button>
						</div>
						<p v-if="errors.loginPassword" class="error-text">{{ errors.loginPassword }}</p>
					</div>

					<div class="form-options">
						<label class="checkbox-container">
							<input type="checkbox" v-model="loginForm.rememberMe" />
							<span class="checkmark"></span>
							Se souvenir de moi
						</label>
						<a href="#" class="forgot-password" @click.prevent="showResetPassword = true"> Mot de passe oublié? </a>
					</div>

					<button type="submit" class="btn-submit" :disabled="isLoading">
						<span v-if="isLoading"> <i class="fas fa-circle-notch fa-spin"></i> Chargement... </span>
						<span v-else> <i class="fas fa-sign-in-alt"></i> Se connecter </span>
					</button>

					<div class="social-login">
						<p>Ou se connecter avec</p>
						<div class="social-buttons">
							<button type="button" class="btn-social btn-google" @click="socialLogin('google')">
								<i class="fab fa-google"></i>
							</button>
							<button type="button" class="btn-social btn-microsoft" @click="socialLogin('microsoft')">
								<i class="fab fa-microsoft"></i>
							</button>
							<button type="button" class="btn-social btn-apple" @click="socialLogin('apple')">
								<i class="fab fa-apple"></i>
							</button>
						</div>
					</div>
				</form>
			</div>

			<!-- Formulaire d'inscription -->
			<div v-if="activeTab === 'register'" class="auth-form">
				<h2>Créer un compte étudiant</h2>

				<form @submit.prevent="handleRegister">
					<div class="form-row">
						<div class="form-group">
							<label for="reg-firstname">Prénom</label>
							<div class="input-with-icon">
								<i class="fas fa-user"></i>
								<input id="reg-firstname" type="text" v-model="registerForm.firstName" placeholder="Prénom" required />
							</div>
							<p v-if="errors.firstName" class="error-text">{{ errors.firstName }}</p>
						</div>

						<div class="form-group">
							<label for="reg-lastname">Nom</label>
							<div class="input-with-icon">
								<i class="fas fa-user"></i>
								<input id="reg-lastname" type="text" v-model="registerForm.lastName" placeholder="Nom" required />
							</div>
							<p v-if="errors.lastName" class="error-text">{{ errors.lastName }}</p>
						</div>
					</div>

					<div class="form-group">
						<label for="reg-email">Email académique</label>
						<div class="input-with-icon">
							<i class="fas fa-envelope"></i>
							<input
								id="reg-email"
								type="email"
								v-model="registerForm.email"
								placeholder="exemple@etudiant.fr"
								required
							/>
						</div>
						<p v-if="errors.email" class="error-text">{{ errors.email }}</p>
					</div>

					<div class="form-group">
						<label for="reg-level">Niveau d'études</label>
						<div class="input-with-icon">
							<i class="fas fa-graduation-cap"></i>
							<select id="reg-level" v-model="registerForm.level" required>
								<option value="" disabled selected>Sélectionnez votre niveau</option>
								<option value="lycee">Lycée</option>
								<option value="licence1">Licence 1</option>
								<option value="licence2">Licence 2</option>
								<option value="licence3">Licence 3</option>
								<option value="master1">Master 1</option>
								<option value="master2">Master 2</option>
								<option value="doctorat">Doctorat</option>
								<option value="other">Autre</option>
							</select>
						</div>
						<p v-if="errors.level" class="error-text">{{ errors.level }}</p>
					</div>

					<div class="form-group">
						<label for="reg-password">Mot de passe</label>
						<div class="input-with-icon">
							<i class="fas fa-lock"></i>
							<input
								id="reg-password"
								:type="showRegisterPassword ? 'text' : 'password'"
								v-model="registerForm.password"
								placeholder="Créez un mot de passe sécurisé"
								required
							/>
							<button type="button" class="toggle-password" @click="showRegisterPassword = !showRegisterPassword">
								<i :class="showRegisterPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
							</button>
						</div>
						<p v-if="errors.password" class="error-text">{{ errors.password }}</p>
						<div class="password-strength" v-if="registerForm.password">
							<div class="strength-meter">
								<div :style="{ width: passwordStrength + '%' }" :class="passwordStrengthClass"></div>
							</div>
							<span :class="passwordStrengthClass">{{ passwordStrengthText }}</span>
						</div>
					</div>

					<div class="form-group">
						<label for="reg-confirm-password">Confirmer le mot de passe</label>
						<div class="input-with-icon">
							<i class="fas fa-lock"></i>
							<input
								id="reg-confirm-password"
								:type="showRegisterPassword ? 'text' : 'password'"
								v-model="registerForm.confirmPassword"
								placeholder="Confirmez votre mot de passe"
								required
							/>
						</div>
						<p v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</p>
					</div>

					<div class="form-options">
						<label class="checkbox-container">
							<input type="checkbox" v-model="registerForm.termsAccepted" required />
							<span class="checkmark"></span>
							J'accepte les <a href="#" @click.prevent="showTerms = true">conditions d'utilisation</a> et la
							<a href="#" @click.prevent="showPrivacy = true">politique de confidentialité</a>
						</label>
						<p v-if="errors.terms" class="error-text">{{ errors.terms }}</p>
					</div>

					<button type="submit" class="btn-submit" :disabled="isLoading">
						<span v-if="isLoading"> <i class="fas fa-circle-notch fa-spin"></i> Chargement... </span>
						<span v-else> <i class="fas fa-user-plus"></i> S'inscrire </span>
					</button>
				</form>
			</div>

			<!-- Alerte de notification -->
			<div v-if="notification" :class="['notification', notification.type]">
				<i :class="notificationIcon"></i> {{ notification.message }}
				<button @click="notification = null" class="close-notification">
					<i class="fas fa-times"></i>
				</button>
			</div>
		</div>

		<!-- Modals -->
		<div v-if="showResetPassword" class="modal">
			<div class="modal-content">
				<h3>Réinitialisation du mot de passe</h3>
				<p>Veuillez entrer votre adresse email pour recevoir les instructions de réinitialisation.</p>
				<form @submit.prevent="handleResetPassword">
					<div class="form-group">
						<label for="reset-email">Email académique</label>
						<div class="input-with-icon">
							<i class="fas fa-envelope"></i>
							<input id="reset-email" type="email" v-model="resetEmail" placeholder="exemple@etudiant.fr" required />
						</div>
					</div>
					<div class="modal-actions">
						<button type="button" class="btn-cancel" @click="showResetPassword = false">Annuler</button>
						<button type="submit" class="btn-submit"><i class="fas fa-paper-plane"></i> Envoyer</button>
					</div>
				</form>
			</div>
		</div>

		<div v-if="showTerms" class="modal">
			<div class="modal-content">
				<h3>Conditions d'utilisation</h3>
				<div class="modal-body">
					<!-- Contenu des conditions d'utilisation -->
					<p>Contenu des conditions d'utilisation de l'application StudyPro pour étudiants...</p>
				</div>
				<div class="modal-actions">
					<button class="btn-submit" @click="showTerms = false">Fermer</button>
				</div>
			</div>
		</div>

		<div v-if="showPrivacy" class="modal">
			<div class="modal-content">
				<h3>Politique de confidentialité</h3>
				<div class="modal-body">
					<!-- Contenu de la politique de confidentialité -->
					<p>Contenu de la politique de confidentialité de l'application StudyPro pour étudiants...</p>
				</div>
				<div class="modal-actions">
					<button class="btn-submit" @click="showPrivacy = false">Fermer</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { fetch } from '@/store/axios';

export default {
	name: 'AuthComponent',
	data() {
		return {
			activeTab: 'login',
			showLoginPassword: false,
			showRegisterPassword: false,
			showResetPassword: false,
			showTerms: false,
			showPrivacy: false,
			isLoading: false,
			notification: null,
			resetEmail: '',

			loginForm: {
				email: '',
				password: '',
				rememberMe: false,
			},

			registerForm: {
				firstName: '',
				lastName: '',
				email: '',
				level: '',
				password: '',
				confirmPassword: '',
				termsAccepted: false,
			},

			errors: {},
		};
	},

	computed: {
		passwordStrength() {
			const password = this.registerForm.password;
			if (!password) return 0;

			let strength = 0;

			// Longueur minimum
			if (password.length >= 8) strength += 20;

			// Majuscules et minuscules
			if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;

			// Chiffres
			if (/[0-9]/.test(password)) strength += 20;

			// Caractères spéciaux
			if (/[^a-zA-Z0-9]/.test(password)) strength += 20;

			// Longueur bonus
			if (password.length >= 12) strength += 20;

			return strength;
		},

		passwordStrengthClass() {
			if (this.passwordStrength < 40) return 'weak';
			if (this.passwordStrength < 70) return 'medium';
			return 'strong';
		},

		passwordStrengthText() {
			if (this.passwordStrength < 40) return 'Faible';
			if (this.passwordStrength < 70) return 'Moyen';
			return 'Fort';
		},

		notificationIcon() {
			if (this.notification) {
				switch (this.notification.type) {
					case 'success':
						return 'fas fa-check-circle';
					case 'error':
						return 'fas fa-exclamation-circle';
					case 'info':
						return 'fas fa-info-circle';
					default:
						return 'fas fa-bell';
				}
			}
			return '';
		},
	},

	methods: {
		validateLoginForm() {
			const errors = {};

			if (!this.loginForm.email) {
				errors.loginEmail = "L'email est obligatoire";
			} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.loginForm.email)) {
				errors.loginEmail = 'Veuillez entrer un email valide';
			}

			if (!this.loginForm.password) {
				errors.loginPassword = 'Le mot de passe est obligatoire';
			}

			this.errors = errors;
			return Object.keys(errors).length === 0;
		},

		validateRegisterForm() {
			const errors = {};

			if (!this.registerForm.firstName.trim()) {
				errors.firstName = 'Le prénom est obligatoire';
			}

			if (!this.registerForm.lastName.trim()) {
				errors.lastName = 'Le nom est obligatoire';
			}

			if (!this.registerForm.email) {
				errors.email = "L'email est obligatoire";
			} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.registerForm.email)) {
				errors.email = 'Veuillez entrer un email valide';
			}

			if (!this.registerForm.level) {
				errors.level = "Veuillez sélectionner votre niveau d'études";
			}

			if (!this.registerForm.password) {
				errors.password = 'Le mot de passe est obligatoire';
			} else if (this.registerForm.password.length < 8) {
				errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
			} else if (
				!/[a-z]/.test(this.registerForm.password) ||
				!/[A-Z]/.test(this.registerForm.password) ||
				!/[0-9]/.test(this.registerForm.password)
			) {
				errors.password = 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre';
			}

			if (this.registerForm.password !== this.registerForm.confirmPassword) {
				errors.confirmPassword = 'Les mots de passe ne correspondent pas';
			}

			if (!this.registerForm.termsAccepted) {
				errors.terms = "Vous devez accepter les conditions d'utilisation";
			}

			this.errors = errors;
			return Object.keys(errors).length === 0;
		},

		async handleRegister() {
			if (!this.validateRegisterForm()) return;

			try {
				this.isLoading = true;

				const data = await fetch(`connection/register`, {
					firstName: this.registerForm.firstName,
					lastName: this.registerForm.lastName,
					email: this.registerForm.email,
					password: this.registerForm.password,
					level: this.registerForm.level,
				});

				if (data.success) {
					// Stocker les informations utilisateur
					if (this.registerForm.rememberMe) {
						localStorage.setItem('user', JSON.stringify(data.user));
						localStorage.setItem('token', data.token);
					} else {
						sessionStorage.setItem('user', JSON.stringify(data.user));
						sessionStorage.setItem('token', data.token);
					}

					this.notification = {
						type: 'success',
						message: data.message || 'Inscription réussie! Redirection en cours...',
					};

					// Redirection vers AppView pour les nouveaux utilisateurs
					setTimeout(() => {
						this.$router.push('/app');
					}, 1500);
				} else {
					this.notification = {
						type: 'error',
						message: data.message || "Erreur lors de l'inscription",
					};
				}
			} catch (error) {
				console.error('Erreur:', error);
				this.notification = {
					type: 'error',
					message: "Erreur de connexion au serveur. Impossible de se connecter à l'API.",
				};
			} finally {
				this.isLoading = false;
			}
		},

		async handleLogin() {
			if (!this.validateLoginForm()) return;

			try {
				this.isLoading = true;

				const data = await fetch(`connection/login`, {
					email: this.loginForm.email,
					password: this.loginForm.password,
				});

				if (data.success) {
					// Stocker les informations utilisateur
					if (this.loginForm.rememberMe) {
						localStorage.setItem('user', JSON.stringify(data.user));
						localStorage.setItem('token', data.token);
					} else {
						sessionStorage.setItem('user', JSON.stringify(data.user));
						sessionStorage.setItem('token', data.token);
					}

					this.notification = {
						type: 'success',
						message: data.message || 'Connexion réussie! Redirection en cours...',
					};

					// Redirection vers Dashboard pour les utilisateurs existants
					setTimeout(() => {
						this.$router.push('/dashboard');
					}, 1500);
				} else {
					this.notification = {
						type: 'error',
						message: data.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.',
					};
				}
			} catch (error) {
				console.error('Erreur de connexion:', error);
				this.notification = {
					type: 'error',
					message: 'Erreur de connexion au serveur. Veuillez vérifier votre connexion ou réessayer plus tard.',
				};
			} finally {
				this.isLoading = false;
			}
		},

		async handleResetPassword() {
			try {
				this.isLoading = true;

				const data = await fetch(`connection/reset_password`, {
					email: this.resetEmail,
				});

				if (data.success) {
					this.notification = {
						type: 'success',
						message: data.message || 'Un email de réinitialisation a été envoyé à votre adresse.',
					};

					this.showResetPassword = false;
					this.resetEmail = '';
				} else {
					this.notification = {
						type: 'error',
						message: data.message || "Échec de l'envoi. Veuillez réessayer.",
					};
				}
			} catch (error) {
				console.error('Erreur de réinitialisation:', error);
				this.notification = {
					type: 'error',
					message: 'Impossible de se connecter au serveur pour réinitialiser le mot de passe.',
				};
			} finally {
				this.isLoading = false;
			}
		},
		socialLogin(provider) {
			console.log(`Tentative de connexion avec ${provider}`);
			// Cette fonctionnalité nécessiterait une implémentation côté serveur
			this.notification = {
				type: 'info',
				message: `Fonctionnalité de connexion via ${provider} non implémentée.`,
			};
		},
	},
};
</script>

<style scoped>
/* Container principal */
.auth-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	padding: 2rem;
	background: var(--bg-gradient);
	position: relative;
}

.auth-container::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
		radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
		radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.15) 0%, transparent 50%);
	pointer-events: none;
}

/* Branding */
.app-branding {
	text-align: center;
	margin-bottom: 3rem;
	z-index: 1;
	position: relative;
}

.app-branding h1 {
	font-size: 3rem;
	font-weight: 800;
	margin-bottom: 0.5rem;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-branding p {
	font-size: 1.125rem;
	color: var(--text-secondary);
	font-weight: 500;
	opacity: 0.9;
}

/* Carte d'authentification */
.auth-card {
	width: 100%;
	max-width: 480px;
	background: var(--card-bg);
	backdrop-filter: blur(20px);
	border-radius: var(--border-radius);
	box-shadow: var(--shadow-xl);
	overflow: hidden;
	position: relative;
	z-index: 1;
	border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Onglets */
.auth-tabs {
	display: flex;
	background: var(--bg-secondary);
	border-bottom: 1px solid var(--border-color);
}

.tab-btn {
	flex: 1;
	padding: 1rem 1.5rem;
	background: none;
	border: none;
	font-size: 1rem;
	font-weight: 600;
	color: var(--text-secondary);
	cursor: pointer;
	transition: var(--transition);
	outline: none;
	position: relative;
}

.tab-btn.active {
	color: var(--primary-color);
	background: var(--card-bg);
}

.tab-btn.active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 40px;
	height: 3px;
	background: linear-gradient(90deg, var(--primary-color), var(--primary-dark));
	border-radius: 3px 3px 0 0;
}

.tab-btn:hover:not(.active) {
	background: var(--hover-bg);
	color: var(--text-primary);
}

.tab-btn i {
	margin-right: 0.5rem;
}

/* Formulaire */
.auth-form {
	padding: 2.5rem;
}

.auth-form h2 {
	font-size: 1.75rem;
	color: var(--text-primary);
	margin-bottom: 2rem;
	text-align: center;
	font-weight: 700;
}

.form-group {
	margin-bottom: 1.5rem;
}

.form-row {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1rem;
	margin-bottom: 0;
}

label {
	display: block;
	margin-bottom: 0.75rem;
	font-size: 0.875rem;
	font-weight: 600;
	color: var(--text-primary);
}

.input-with-icon {
	position: relative;
	display: flex;
	align-items: center;
}

.input-with-icon i {
	position: absolute;
	left: 1rem;
	color: var(--text-secondary);
	z-index: 2;
}

.input-with-icon input,
.input-with-icon select {
	width: 100%;
	padding: 0.875rem 1rem 0.875rem 2.75rem;
	border: 2px solid var(--border-color);
	border-radius: var(--border-radius-sm);
	font-size: 1rem;
	background: var(--input-bg);
	color: var(--text-primary);
	transition: var(--transition);
	outline: none;
}

.input-with-icon input:focus,
.input-with-icon select:focus {
	border-color: var(--primary-color);
	box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	transform: translateY(-1px);
}

.input-with-icon input::placeholder {
	color: var(--text-secondary);
}

.toggle-password {
	position: absolute;
	right: 1rem;
	background: none;
	border: none;
	color: var(--text-secondary);
	cursor: pointer;
	font-size: 1rem;
	padding: 0.25rem;
	border-radius: 4px;
	transition: var(--transition);
	z-index: 2;
}

.toggle-password:hover {
	color: var(--primary-color);
	background: var(--primary-light);
}

.error-text {
	color: var(--error-color);
	font-size: 0.8125rem;
	margin-top: 0.5rem;
	font-weight: 500;
}

/* Force du mot de passe */
.password-strength {
	margin-top: 0.75rem;
}

.strength-meter {
	height: 6px;
	background: var(--border-color);
	border-radius: 3px;
	margin-bottom: 0.5rem;
	overflow: hidden;
}

.strength-meter div {
	height: 100%;
	border-radius: 3px;
	transition: var(--transition);
}

.weak {
	background: linear-gradient(90deg, var(--error-color), #fca5a5);
	color: var(--error-color);
}

.medium {
	background: linear-gradient(90deg, var(--warning-color), #fcd34d);
	color: var(--warning-color);
}

.strong {
	background: linear-gradient(90deg, var(--success-color), #6ee7b7);
	color: var(--success-color);
}

/* Options de formulaire */
.form-options {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
	font-size: 0.875rem;
}

.checkbox-container {
	display: flex;
	align-items: center;
	position: relative;
	cursor: pointer;
	user-select: none;
}

.checkbox-container input {
	position: absolute;
	opacity: 0;
	cursor: pointer;
	height: 0;
	width: 0;
}

.checkmark {
	position: relative;
	height: 20px;
	width: 20px;
	margin-right: 0.75rem;
	background: var(--input-bg);
	border: 2px solid var(--border-color);
	border-radius: 4px;
	transition: var(--transition);
}

.checkbox-container:hover input ~ .checkmark {
	border-color: var(--primary-color);
	background: var(--primary-light);
}

.checkbox-container input:checked ~ .checkmark {
	background: var(--primary-color);
	border-color: var(--primary-color);
}

.checkmark:after {
	content: '';
	position: absolute;
	display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
	display: block;
}

.checkbox-container .checkmark:after {
	left: 6px;
	top: 2px;
	width: 6px;
	height: 10px;
	border: solid white;
	border-width: 0 2px 2px 0;
	transform: rotate(45deg);
}

.forgot-password {
	color: var(--primary-color);
	text-decoration: none;
	transition: var(--transition);
	font-weight: 500;
}

.forgot-password:hover {
	text-decoration: underline;
	color: var(--primary-dark);
}

/* Bouton de soumission */
.btn-submit {
	width: 100%;
	padding: 1rem;
	background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
	color: white;
	border: none;
	border-radius: var(--border-radius-sm);
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	transition: var(--transition);
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: var(--shadow-md);
	position: relative;
	overflow: hidden;
}

.btn-submit::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
	transition: var(--transition);
}

.btn-submit:hover {
	transform: translateY(-2px);
	box-shadow: var(--shadow-lg);
}

.btn-submit:hover::before {
	left: 100%;
}

.btn-submit:active {
	transform: translateY(0);
}

.btn-submit:disabled {
	background: var(--text-secondary);
	cursor: not-allowed;
	transform: none;
	box-shadow: var(--shadow-sm);
}

.btn-submit:disabled::before {
	display: none;
}

.btn-submit i {
	margin-right: 0.5rem;
}

/* Connexion avec réseaux sociaux */
.social-login {
	margin-top: 2rem;
	text-align: center;
}

.social-login p {
	position: relative;
	margin-bottom: 1.5rem;
	color: var(--text-secondary);
	display: flex;
	align-items: center;
	font-size: 0.875rem;
}

.social-login p::before,
.social-login p::after {
	content: '';
	flex: 1;
	height: 1px;
	background: var(--border-color);
}

.social-login p::before {
	margin-right: 1rem;
}

.social-login p::after {
	margin-left: 1rem;
}

.social-buttons {
	display: flex;
	justify-content: center;
	gap: 1rem;
}

.btn-social {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	border: 2px solid var(--border-color);
	font-size: 1.25rem;
	color: var(--text-primary);
	background: var(--input-bg);
	cursor: pointer;
	transition: var(--transition);
	position: relative;
	overflow: hidden;
}

.btn-google:hover {
	border-color: #db4437;
	color: #db4437;
	background: rgba(219, 68, 55, 0.1);
}

.btn-microsoft:hover {
	border-color: #0078d4;
	color: #0078d4;
	background: rgba(0, 120, 212, 0.1);
}

.btn-apple:hover {
	border-color: #000000;
	color: var(--text-primary);
	background: rgba(0, 0, 0, 0.1);
}

.btn-social:hover {
	transform: scale(1.05);
	box-shadow: var(--shadow-md);
}

/* Notification */
.notification {
	position: absolute;
	bottom: 2rem;
	left: 2rem;
	right: 2rem;
	padding: 1rem 1.5rem;
	border-radius: var(--border-radius-sm);
	color: white;
	display: flex;
	align-items: center;
	animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	box-shadow: var(--shadow-lg);
	z-index: 1000;
	backdrop-filter: blur(10px);
}

.notification i {
	margin-right: 1rem;
	font-size: 1.25rem;
}

.success {
	background: linear-gradient(135deg, var(--success-color) 0%, #059669 100%);
}

.error {
	background: linear-gradient(135deg, var(--error-color) 0%, #dc2626 100%);
}

.info {
	background: linear-gradient(135deg, var(--info-color) 0%, #2563eb 100%);
}

.close-notification {
	margin-left: auto;
	background: none;
	border: none;
	color: white;
	opacity: 0.8;
	cursor: pointer;
	transition: var(--transition);
	padding: 0.25rem;
	border-radius: 4px;
}

.close-notification:hover {
	opacity: 1;
	background: rgba(255, 255, 255, 0.2);
}

@keyframes slideUp {
	from {
		transform: translateY(100%);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
}

/* Modal */
.modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.6);
	backdrop-filter: blur(5px);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
	animation: fadeIn 0.3s ease-out;
}

.modal-content {
	width: 90%;
	max-width: 500px;
	background: var(--card-bg);
	border-radius: var(--border-radius);
	padding: 2.5rem;
	box-shadow: var(--shadow-xl);
	animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	border: 1px solid var(--border-color);
}

.modal-content h3 {
	margin-bottom: 1.5rem;
	color: var(--text-primary);
	font-size: 1.5rem;
	font-weight: 700;
}

.modal-body {
	max-height: 300px;
	overflow-y: auto;
	margin-bottom: 2rem;
	padding-right: 0.5rem;
	color: var(--text-secondary);
	line-height: 1.6;
}

.modal-actions {
	display: flex;
	justify-content: flex-end;
	gap: 1rem;
	margin-top: 2rem;
}

.btn-cancel {
	padding: 0.75rem 1.5rem;
	background: var(--bg-secondary);
	color: var(--text-primary);
	border: 2px solid var(--border-color);
	border-radius: var(--border-radius-sm);
	font-weight: 600;
	cursor: pointer;
	transition: var(--transition);
}

.btn-cancel:hover {
	background: var(--hover-bg);
	border-color: var(--text-secondary);
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes scaleIn {
	from {
		transform: scale(0.9);
		opacity: 0;
	}
	to {
		transform: scale(1);
		opacity: 1;
	}
}

/* Responsive Design */
@media (max-width: 768px) {
	.auth-container {
		padding: 1rem;
	}

	.app-branding {
		margin-bottom: 2rem;
	}

	.app-branding h1 {
		font-size: 2.5rem;
	}

	.auth-form {
		padding: 2rem;
	}

	.form-row {
		grid-template-columns: 1fr;
		gap: 0;
	}

	.form-options {
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
	}

	.notification {
		left: 1rem;
		right: 1rem;
		bottom: 1rem;
	}
}

@media (max-width: 480px) {
	.auth-container {
		padding: 0.5rem;
	}

	.app-branding h1 {
		font-size: 2rem;
	}

	.auth-form {
		padding: 1.5rem;
	}

	.tab-btn {
		padding: 0.875rem 1rem;
		font-size: 0.875rem;
	}

	.modal-content {
		padding: 2rem;
	}
}

/* Animations pour les interactions */
@media (prefers-reduced-motion: reduce) {
	* {
		animation-duration: 0.01ms !important;
		transition-duration: 0.01ms !important;
	}
}

/* Focus visible pour l'accessibilité */
input:focus-visible,
select:focus-visible,
button:focus-visible {
	outline: 2px solid var(--primary-color);
	outline-offset: 2px;
}
</style>
