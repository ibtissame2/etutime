<template>
	<div v-if="!isConnected" class="auth-container">
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
					<p>Contenu de la politique de confidentialité de l'application StudyPro pour étudiants...</p>
				</div>
				<div class="modal-actions">
					<button class="btn-submit" @click="showPrivacy = false">Fermer</button>
				</div>
			</div>
		</div>
	</div>
	<NotificationContainer></NotificationContainer>
</template>

<script>
import { supabase } from '@/lib/supabase.js'
import { useNotificationsStore } from '@/store/notification';
import NotificationContainer from '@/Components/NotificationContainer.vue';

export default {
	name: 'AuthComponent',
	components: {
		NotificationContainer,
	},

	data() {
		return {
			isConnected: true,
			activeTab: 'login',
			showLoginPassword: false,
			showRegisterPassword: false,
			showResetPassword: false,
			showTerms: false,
			showPrivacy: false,
			isLoading: false,
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
			if (password.length >= 8) strength += 20;
			if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
			if (/[0-9]/.test(password)) strength += 20;
			if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
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
	},

	methods: {
		notify(type, message) {
			useNotificationsStore().addNotification(type, message);
		},
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
			if (!this.registerForm.firstName.trim()) errors.firstName = 'Le prénom est obligatoire';
			if (!this.registerForm.lastName.trim()) errors.lastName = 'Le nom est obligatoire';
			if (!this.registerForm.email) {
				errors.email = "L'email est obligatoire";
			} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.registerForm.email)) {
				errors.email = 'Veuillez entrer un email valide';
			}
			if (!this.registerForm.level) errors.level = "Veuillez sélectionner votre niveau d'études";
			if (!this.registerForm.password) {
				errors.password = 'Le mot de passe est obligatoire';
			} else if (this.registerForm.password.length < 8) {
				errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
			} else if (!/[a-z]/.test(this.registerForm.password) || !/[A-Z]/.test(this.registerForm.password) || !/[0-9]/.test(this.registerForm.password)) {
				errors.password = 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre';
			}
			if (this.registerForm.password !== this.registerForm.confirmPassword) {
				errors.confirmPassword = 'Les mots de passe ne correspondent pas';
			}
			if (!this.registerForm.termsAccepted) errors.terms = "Vous devez accepter les conditions d'utilisation";
			this.errors = errors;
			return Object.keys(errors).length === 0;
		},
		async handleRegister() {
			if (!this.validateRegisterForm()) return;
			try {
				this.isLoading = true;
				const { data, error } = await supabase.auth.signUp({
					email: this.registerForm.email,
					password: this.registerForm.password,
					options: {
						data: {
							firstName: this.registerForm.firstName,
							lastName: this.registerForm.lastName,
							first_name: this.registerForm.firstName,
							last_name: this.registerForm.lastName,
							level: this.registerForm.level
						}
					}
				});
				if (error) throw new Error(error.message);
				if (data.user) {
					this.notify('success', 'Inscription réussie! Vérifiez votre email pour confirmer votre compte.');
					this.activeTab = 'login';
					this.registerForm = {
						firstName: '',
						lastName: '',
						email: '',
						level: '',
						password: '',
						confirmPassword: '',
						termsAccepted: false
					};
				}
			} catch (error) {
				console.error('Erreur inscription:', error);
				if (error.message.includes('already registered')) {
					this.notify('error', 'Cette adresse email est déjà utilisée.');
				} else {
					this.notify('error', "Erreur lors de l'inscription. Veuillez réessayer.");
				}
			} finally {
				this.isLoading = false;
			}
		},
		async handleLogin() {
			if (!this.validateLoginForm()) return;
			try {
				this.isLoading = true;
				const { data, error } = await supabase.auth.signInWithPassword({
					email: this.loginForm.email,
					password: this.loginForm.password
				});
				if (error) throw new Error(error.message);
				if (data.user) {
					const userData = {
						id: data.user.id,
						first_name: data.user.user_metadata?.first_name || data.user.user_metadata?.firstName || '',
						last_name: data.user.user_metadata?.last_name || data.user.user_metadata?.lastName || '',
						email: data.user.email,
						level: data.user.user_metadata?.level || ''
					};
					if (this.loginForm.rememberMe) {
						localStorage.setItem('user', JSON.stringify(userData));
						localStorage.setItem('token', data.session.access_token);
						sessionStorage.removeItem('user');
						sessionStorage.removeItem('token');
					} else {
						sessionStorage.setItem('user', JSON.stringify(userData));
						sessionStorage.setItem('token', data.session.access_token);
						localStorage.removeItem('user');
						localStorage.removeItem('token');
					}
					this.notify('success', 'Bienvenue ' + userData.first_name + '!');
					setTimeout(() => {
						this.$router.push('/dashboard');
					}, 1500);
				}
			} catch (error) {
				console.error('Erreur de connexion:', error);
				this.notify('error', 'Email ou mot de passe incorrect.');
			} finally {
				this.isLoading = false;
			}
		},
		async handleResetPassword() {
			try {
				this.isLoading = true;
				const { error } = await supabase.auth.resetPasswordForEmail(this.resetEmail, {
					redirectTo: window.location.origin + '/reset-password'
				});
				if (error) throw new Error(error.message);
				this.notify('success', 'Un email de réinitialisation a été envoyé à votre adresse.');
				this.showResetPassword = false;
				this.resetEmail = '';
			} catch (error) {
				console.error('Erreur de réinitialisation:', error);
				this.notify('error', 'Erreur lors de l\'envoi. Veuillez réessayer.');
			} finally {
				this.isLoading = false;
			}
		},
	},
	async beforeMount() {
		try {
			const { data: { session } } = await supabase.auth.getSession();
			if (session?.user) {
				this.$router.push('/dashboard');
			} else {
				this.isConnected = false;
			}
		} catch (error) {
			console.error('Erreur lors de la vérification de session:', error);
			this.isConnected = false;
		}
	},
};
</script>

<style scoped>
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
	from { opacity: 0; }
	to { opacity: 1; }
}
@keyframes scaleIn {
	from { transform: scale(0.9); opacity: 0; }
	to { transform: scale(1); opacity: 1; }
}
@media (max-width: 768px) {
	.auth-container { padding: 1rem; }
	.app-branding { margin-bottom: 2rem; }
	.app-branding h1 { font-size: 2.5rem; }
	.auth-form { padding: 2rem; }
	.form-row { grid-template-columns: 1fr; gap: 0; }
	.form-options { flex-direction: column; align-items: flex-start; gap: 1rem; }
}
@media (max-width: 480px) {
	.auth-container { padding: 0.5rem; }
	.app-branding h1 { font-size: 2rem; }
	.auth-form { padding: 1.5rem; }
	.tab-btn { padding: 0.875rem 1rem; font-size: 0.875rem; }
	.modal-content { padding: 2rem; }
}
@media (prefers-reduced-motion: reduce) {
	* { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
input:focus-visible, select:focus-visible, button:focus-visible {
	outline: 2px solid var(--primary-color);
	outline-offset: 2px;
}
