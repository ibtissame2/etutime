<script setup>
import MainContainer from '@/Components/src/MainContainer.vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import { TagIcon } from '@heroicons/vue/16/solid';
import { ref, watch, onMounted } from 'vue';
import PageTitle from '@/Components/Common/PageTitle.vue';

// Définition des données pour l'emploi du temps
const jours = ref(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']);
const creneaux = ref([]);
const emploiPersonnalise = ref({});
const emploiGenere = ref(null);
const modules = ref([]);
const nouveauModule = ref('');
const etapeActuelle = ref(1);
const horaireFixe = ref({});
const niveau = ref('moyen'); // Peut être 'faible', 'moyen', ou 'élevé'
const emploiEnregistre = ref(false);
const emploiAffiche = ref(null);

// Méthodes
const genererCreneaux = () => {
	const creneauxArray = [];
	let heureDebut = new Date();
	heureDebut.setHours(8, 0, 0, 0); // Début à 8h

	const heureFin = new Date();
	heureFin.setHours(22, 0, 0, 0); // Fin à 22h

	while (heureDebut < heureFin) {
		const heure = heureDebut.getHours();
		// Sauter l'heure entre 12h et 13h
		if (heure !== 12) {
			const debutStr = heureDebut.toTimeString().substring(0, 5);
			heureDebut = new Date(heureDebut.getTime() + 60 * 60000);
			const finStr = heureDebut.toTimeString().substring(0, 5);
			creneauxArray.push(`${debutStr} - ${finStr}`);
		} else {
			heureDebut = new Date(heureDebut.getTime() + 60 * 60000); // Passer à 13h
		}
	}

	creneaux.value = creneauxArray;
};

const initialiserEmploiVide = () => {
	const emploi = {};
	jours.value.forEach((jour) => {
		emploi[jour] = Array(creneaux.value.length).fill('');
	});
	emploiPersonnalise.value = emploi;
};

const initialiserHoraireFixe = () => {
	const horaire = {};
	jours.value.forEach((jour) => {
		horaire[jour] = Array(creneaux.value.length).fill('');
	});
	horaireFixe.value = horaire;
};

const ajouterModule = () => {
	if (nouveauModule.value.trim() && !modules.value.includes(nouveauModule.value.trim())) {
		modules.value.push(nouveauModule.value.trim());
		nouveauModule.value = '';
	}
};

const supprimerModule = (index) => {
	modules.value.splice(index, 1);
};

const genererEmploi = () => {
	if (modules.value.length === 0) {
		alert('Veuillez ajouter au moins un module');
		return;
	}

	// Créer une copie de l'horaire fixe comme base
	const planning = JSON.parse(JSON.stringify(horaireFixe.value));

	// Définir des modules pour le traitement
	const modulesATraiter = [...modules.value];

	// Ajouter 1 heure de transport après le dernier cours de chaque journée
	jours.value.forEach((jour) => {
		let dernierIndex = -1;

		// Trouver l'index du dernier cours fixe de la journée
		for (let i = creneaux.value.length - 1; i >= 0; i--) {
			if (horaireFixe.value[jour][i]) {
				dernierIndex = i;
				break;
			}
		}

		// Ajouter transport si possible
		if (dernierIndex !== -1 && dernierIndex + 1 < creneaux.value.length) {
			const heureCreneau = creneaux.value[dernierIndex + 1].split('-')[0].trim();
			const heureTransport = parseInt(heureCreneau.split(':')[0]);

			if (heureTransport !== 12 && !planning[jour][dernierIndex + 1]) {
				planning[jour][dernierIndex + 1] = 'Transport';
			}
		}
	});

	// Fonction pour distribuer des sessions de 2h
	const assigner = (jour, indexModules, typeActivite, startIndex = 0) => {
		if (!indexModules || indexModules.length === 0) {
			return;
		}

		let slotsAssignes = 0;
		let currentIndex = startIndex;

		while (slotsAssignes < indexModules.length && currentIndex < creneaux.value.length - 1) {
			// Vérifier si l'heure actuelle est disponible
			const heureDebutStr = creneaux.value[currentIndex].split('-')[0].trim();
			const heureDebut = parseInt(heureDebutStr.split(':')[0]);

			// Vérifier disponibilité et éviter 12h-13h
			if (!planning[jour][currentIndex] && !planning[jour][currentIndex + 1] && heureDebut !== 11) {
				// Assigner l'activité pour 2 heures consécutives
				const moduleNom = modulesATraiter[indexModules[slotsAssignes]];
				planning[jour][currentIndex] = `${typeActivite} ${moduleNom}`;
				planning[jour][currentIndex + 1] = `${typeActivite} ${moduleNom} (suite)`;
				slotsAssignes++;
				currentIndex += 2;
			} else {
				currentIndex++;
			}
		}
	};

	// Logique de génération selon le nombre de modules
	if (modulesATraiter.length > 0) {
		// Calculer les indices des modules pour l'assignation
		const indices = modulesATraiter.map((_, index) => index);

		// Distribution pour l'université (maintenant par défaut)
		const groupe1 = indices.slice(0, Math.min(2, indices.length));
		const groupe2 = indices.slice(2, Math.min(4, indices.length));
		const groupe3 = indices.slice(4);

		// Assigner les groupes aux jours
		assigner('Lundi', groupe1, 'Révision');
		assigner('Mercredi', groupe2, 'Révision');
		assigner('Mardi', groupe1, 'TD');
		assigner('Jeudi', groupe2, 'TD');

		if (groupe3.length > 0) {
			assigner('Vendredi', groupe3, 'Révision');
			assigner('Samedi', groupe3, 'TD');
		} else {
			// S'il n'y a pas de groupe 3, réutiliser le groupe 1
			assigner('Vendredi', groupe1, 'Révision');
			assigner('Samedi', groupe2, 'TD');
		}

		// TP le dimanche si possible
		if (creneaux.value.length >= 2) {
			planning['Dimanche'][0] = 'TP';
			planning['Dimanche'][1] = 'TP (suite)';
		}
	}

	// Assigner le planning généré
	emploiGenere.value = planning;
};

const enregistrerEmploi = () => {
	const emploiAEnregistrer = niveau.value === 'élevé' ? emploiPersonnalise.value : emploiGenere.value;

	// Ici vous pouvez ajouter le code pour envoyer l'emploi du temps à votre backend
	// Par exemple: axios.post('/api/emploi', { emploi: emploiAEnregistrer, horaireFixe: horaireFixe.value });

	emploiAffiche.value = emploiAEnregistrer;
	emploiEnregistre.value = true;
};

// Initialisation au chargement de la page
onMounted(() => {
	genererCreneaux();
	initialiserEmploiVide();
	initialiserHoraireFixe();
});
</script>

<template>
	<AppLayout title="Emploi du temps" data-testid="emploi_view">
		<MainContainer class="py-3 sm:py-5 border-b border-default-background-separator">
			<PageTitle :icon="TagIcon" title="Emploi du temps"></PageTitle>
		</MainContainer>

		<MainContainer class="py-5">
			<div class="emploi-container">
				<!-- Affichage de l'emploi du temps enregistré -->
				<div v-if="emploiEnregistre" class="saved-schedule">
					<h2 class="text-xl font-medium mb-4 text-primary">Votre emploi du temps enregistré</h2>

					<div class="schedule-grid">
						<div class="grid-header">
							<div class="header-cell">Heure</div>
							<div v-for="jour in jours" :key="jour" class="header-cell">{{ jour }}</div>
						</div>

						<div v-for="(creneau, index) in creneaux" :key="index" class="grid-row">
							<div class="time-cell">{{ creneau }}</div>
							<div
								v-for="jour in jours"
								:key="jour"
								class="activity-cell"
								:class="{
									'has-activity': emploiAffiche[jour][index],
									'fixed-activity': horaireFixe[jour][index],
								}"
							>
								{{ emploiAffiche[jour][index] || '' }}
								<span
									v-if="horaireFixe[jour][index] && emploiAffiche[jour][index] === horaireFixe[jour][index]"
									class="fixed-badge"
									>Fixé</span
								>
							</div>
						</div>
					</div>

					<button @click="emploiEnregistre = false" class="btn-primary">Modifier l'emploi du temps</button>
				</div>

				<div v-else-if="niveau === 'élevé'" class="custom-schedule">
					<h2 class="text-xl font-medium mb-2 text-primary">Créez votre emploi du temps personnalisé</h2>
					<p class="text-secondary mb-6">Complétez votre emploi du temps selon vos préférences</p>

					<div class="time-grid">
						<div class="time-header">
							<div class="time-cell">Heure</div>
							<div v-for="jour in jours" :key="jour" class="day-cell">{{ jour }}</div>
						</div>

						<div v-for="(creneau, index) in creneaux" :key="index" class="time-row">
							<div class="time-cell">{{ creneau }}</div>
							<div v-for="jour in jours" :key="jour" class="day-cell">
								<input
									v-model="emploiPersonnalise[jour][index]"
									type="text"
									placeholder="Activité..."
									class="activity-input"
								/>
							</div>
						</div>
					</div>

					<button @click="enregistrerEmploi" class="btn-primary">Enregistrer mon emploi du temps</button>
				</div>

				<div v-else class="auto-schedule">
					<h2 class="text-xl font-medium mb-2 text-primary">Votre emploi du temps optimisé</h2>
					<p class="text-secondary mb-6">
						Nous allons générer un emploi du temps adapté à votre niveau de concentration
					</p>

					<div class="schedule-steps">
						<!-- Étape 1: Configuration de base -->
						<div class="step" :class="{ 'active-step': etapeActuelle === 1 }">
							<div class="step-header" @click="etapeActuelle = 1">
								<span class="step-number">1</span>
								<h3 class="text-base font-medium">Configuration de base</h3>
							</div>
							<div class="step-content" v-show="etapeActuelle === 1">
								<div class="option-group">
									<label class="text-secondary font-medium mb-2 block">Modules/Cours :</label>
									<div class="modules-input">
										<input
											v-model="nouveauModule"
											type="text"
											placeholder="Ajouter un module"
											@keyup.enter="ajouterModule"
											class="module-input"
										/>
										<button @click="ajouterModule" class="add-button">+</button>
									</div>
									<div class="modules-list">
										<div v-for="(module, index) in modules" :key="index" class="module-item">
											{{ module }}
											<button @click="supprimerModule(index)" class="delete-button">×</button>
										</div>
									</div>
								</div>

								<button @click="etapeActuelle = 2" class="btn-secondary">Suivant</button>
							</div>
						</div>

						<!-- Étape 2: Saisie des horaires fixes -->
						<div class="step" :class="{ 'active-step': etapeActuelle === 2 }">
							<div class="step-header" @click="etapeActuelle = 2">
								<span class="step-number">2</span>
								<h3 class="text-base font-medium">Horaire des cours/obligations</h3>
							</div>
							<div class="step-content" v-show="etapeActuelle === 2">
								<p class="text-secondary mb-4">Indiquez vos créneaux fixes (cours, travail, etc.) :</p>

								<div class="fixed-schedule-grid">
									<div class="grid-header">
										<div class="header-cell">Heure</div>
										<div v-for="jour in jours" :key="jour" class="header-cell">{{ jour }}</div>
									</div>

									<div v-for="(creneau, index) in creneaux" :key="index" class="grid-row">
										<div class="time-cell">{{ creneau }}</div>
										<div v-for="jour in jours" :key="jour" class="day-cell">
											<input v-model="horaireFixe[jour][index]" type="text" placeholder="Libre" class="fixed-input" />
										</div>
									</div>
								</div>

								<div class="step-buttons">
									<button @click="etapeActuelle = 1" class="btn-outline">Retour</button>
									<button @click="etapeActuelle = 3" class="btn-secondary">Suivant</button>
								</div>
							</div>
						</div>

						<!-- Étape 3: Génération et validation -->
						<div class="step" :class="{ 'active-step': etapeActuelle === 3 }">
							<div class="step-header" @click="etapeActuelle = 3">
								<span class="step-number">3</span>
								<h3 class="text-base font-medium">Génération de l'emploi du temps</h3>
							</div>
							<div class="step-content" v-show="etapeActuelle === 3">
								<button @click="genererEmploi" class="btn-primary w-full">Générer l'emploi du temps</button>

								<div v-if="emploiGenere" class="generated-schedule mt-6">
									<h4 class="text-lg font-medium mb-4 text-primary">Votre emploi du temps optimisé :</h4>

									<div class="schedule-grid">
										<div class="grid-header">
											<div class="header-cell">Heure</div>
											<div v-for="jour in jours" :key="jour" class="header-cell">{{ jour }}</div>
										</div>

										<div v-for="(creneau, index) in creneaux" :key="index" class="grid-row">
											<div class="time-cell">{{ creneau }}</div>
											<div
												v-for="jour in jours"
												:key="jour"
												class="activity-cell"
												:class="{
													'has-activity': emploiGenere[jour][index],
													'fixed-activity': horaireFixe[jour][index],
												}"
											>
												{{ emploiGenere[jour][index] || horaireFixe[jour][index] }}
												<span v-if="horaireFixe[jour][index]" class="fixed-badge">Fixé</span>
											</div>
										</div>
									</div>

									<div class="schedule-legend">
										<div class="legend-item">
											<span class="legend-color fixed"></span>
											<span>Créneau fixé (non modifiable)</span>
										</div>
										<div class="legend-item">
											<span class="legend-color generated"></span>
											<span>Activité générée</span>
										</div>
									</div>

									<button @click="enregistrerEmploi" class="btn-primary w-full mt-4">
										Enregistrer cet emploi du temps
									</button>
								</div>

								<div class="step-buttons">
									<button @click="etapeActuelle = 2" class="btn-outline">Retour</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</MainContainer>
	</AppLayout>
</template>

<style scoped>

.emploi-container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 2rem;
	background: var(--color-bg-primary);
	border-radius: 0.5rem;
	box-shadow: var(--card-shadow);
	border: 1px solid var(--border-primary);
	transition: all 0.3s ease;
}

h2 {
	color: var(--text-primary);
	margin-bottom: 1.5rem;
	text-align: center;
	font-weight: 700;
	font-size: 1.75rem;
	background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

p {
	color: var(--text-secondary);
	text-align: center;
	margin-bottom: 2rem;
	font-size: 1.1rem;
	line-height: 1.6;
}

.text-primary {
	color: var(--text-primary);
}

.text-secondary {
	color: var(--text-secondary);
}

/* Grilles améliorées */
.time-grid,
.fixed-schedule-grid,
.schedule-grid {
	display: grid;
	grid-template-columns: 140px repeat(7, 1fr);
	gap: 8px;
	margin-bottom: 2rem;
	border-radius: 0.5rem;
	overflow: hidden;
	box-shadow: var(--shadow-medium);
	background: var(--color-bg-primary);
}

.time-header,
.time-row,
.grid-header,
.grid-row {
	display: contents;
}

.time-cell,
.day-cell,
.activity-cell,
.header-cell {
	padding: 16px 12px;
	border: 1px solid var(--border-primary);
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	font-size: 0.9rem;
	transition: all 0.2s ease;
	position: relative;
	background: var(--color-bg-primary);
}

.time-cell {
	background: linear-gradient(135deg, var(--time-bg), #e1d2ff);
	color: var(--time-text);
	font-weight: 700;
	font-size: 0.85rem;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	border-color: var(--time-bg);
}

.time-header .time-cell,
.time-header .day-cell,
.grid-header .header-cell {
	background: linear-gradient(135deg, var(--color-bg-tertiary), var(--color-bg-secondary));
	color: var(--text-primary);
	font-weight: 600;
	font-size: 0.95rem;
	border-bottom: 2px solid var(--accent-primary);
}

.time-header .time-cell {
	background: linear-gradient(135deg, var(--time-bg), #d6c8f5);
	color: var(--time-text);
	font-weight: 700;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.day-cell:hover,
.activity-cell:hover {
	background: var(--color-bg-tertiary);
	transform: translateY(-1px);
	box-shadow: 0 2px 8px var(--shadow-light);
}

/* Inputs améliorés */
.activity-input,
.fixed-input,
.module-input {
	width: 100%;
	padding: 12px 16px;
	background: var(--color-bg-primary);
	border: 2px solid var(--border-primary);
	border-radius: 0.5rem;
	color: var(--text-primary);
	font-size: 0.9rem;
	transition: all 0.3s ease;
	outline: none;
}

.activity-input:focus,
.fixed-input:focus,
.module-input:focus {
	border-color: var(--accent-primary);
	box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.25);
	transform: translateY(-1px);
}

.activity-input::placeholder,
.fixed-input::placeholder,
.module-input::placeholder {
	color: var(--text-secondary);
}

/* Boutons modernisés */
.btn-primary {
	display: block;
	width: 100%;
	padding: 14px 24px;
	background: linear-gradient(135deg, var(--btn-primary-bg), var(--accent-secondary));
	color: var(--btn-primary-text);
	border: none;
	border-radius: 0.5rem;
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	margin-top: 1.5rem;
	transition: all 0.3s ease;
	box-shadow: 0 4px 12px rgba(66, 153, 225, 0.25);
	position: relative;
	overflow: hidden;
}

.btn-primary:hover {
	background: linear-gradient(135deg, var(--accent-hover), var(--accent-secondary));
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(66, 153, 225, 0.3);
}

.btn-primary:active {
	transform: translateY(0);
}

.btn-secondary {
	display: inline-block;
	padding: 12px 24px;
	background: var(--btn-secondary-bg);
	color: var(--btn-secondary-text);
	border: 2px solid var(--border-secondary);
	border-radius: 0.5rem;
	font-size: 0.95rem;
	font-weight: 500;
	cursor: pointer;
	margin-top: 1rem;
	transition: all 0.3s ease;
}

.btn-secondary:hover {
	background: var(--border-primary);
	transform: translateY(-1px);
	box-shadow: 0 4px 12px var(--shadow-medium);
}

.btn-outline {
	display: inline-block;
	padding: 12px 24px;
	background: transparent;
	color: var(--accent-primary);
	border: 2px solid var(--accent-primary);
	border-radius: 0.5rem;
	font-size: 0.95rem;
	font-weight: 500;
	cursor: pointer;
	margin-top: 1rem;
	transition: all 0.3s ease;
}

.btn-outline:hover {
	background: rgba(66, 153, 225, 0.05);
	transform: translateY(-1px);
}

/* Étapes améliorées */
.schedule-steps {
	margin-top: 2rem;
}

.step {
	margin-bottom: 1.5rem;
	border: 2px solid var(--border-primary);
	border-radius: 0.5rem;
	overflow: hidden;
	transition: all 0.3s ease;
	background: var(--color-bg-primary);
}

.step:hover {
	border-color: var(--accent-primary);
	box-shadow: 0 4px 12px rgba(66, 153, 225, 0.1);
}

.step-header {
	background: var(--step-bg);
	padding: 18px 24px;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 16px;
	transition: all 0.3s ease;
}

.step-header:hover {
	background: var(--color-bg-secondary);
}

.step-header h3 {
	margin: 0;
	color: var(--step-text);
	font-size: 1.1rem;
	font-weight: 600;
}

.step-number {
	background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
	color: #ffffff;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 700;
	font-size: 0.9rem;
	box-shadow: 0 2px 8px rgba(66, 153, 225, 0.3);
}

.step-content {
	padding: 24px;
	background: var(--color-bg-primary);
}

.active-step {
	border-color: var(--accent-primary);
	box-shadow: 0 4px 16px rgba(66, 153, 225, 0.15);
}

.active-step .step-header {
	background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
}

.active-step .step-header h3 {
	color: #ffffff;
}

.active-step .step-number {
	background: #ffffff;
	color: var(--accent-primary);
	box-shadow: 0 2px 8px rgba(255, 255, 255, 0.3);
}

/* Modules */
.option-group {
	margin-bottom: 2rem;
}

.modules-input {
	display: flex;
	margin-bottom: 1rem;
	border-radius: 0.5rem;
	overflow: hidden;
	box-shadow: var(--shadow-medium);
}

.module-input {
	border-radius: 0.5rem 0 0 0.5rem !important;
	border-right: none !important;
}

.add-button {
	padding: 12px 18px;
	background: linear-gradient(135deg, var(--success), var(--success-hover));
	color: #ffffff;
	border: none;
	border-radius: 0 0.5rem 0.5rem 0;
	cursor: pointer;
	font-size: 1.1rem;
	font-weight: 600;
	transition: all 0.3s ease;
}

.add-button:hover {
	background: linear-gradient(135deg, var(--success-hover), #146c43);
	transform: scale(1.05);
}

.modules-list {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
}

.module-item {
	background: var(--module-bg);
	color: var(--module-text);
	padding: 10px 16px;
	border-radius: 20px;
	display: flex;
	align-items: center;
	gap: 10px;
	font-weight: 500;
	font-size: 0.9rem;
	border: 2px solid var(--module-border);
	transition: all 0.3s ease;
}

.module-item:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px var(--shadow-light);
}

.delete-button {
	background: none;
	border: none;
	color: var(--danger);
	cursor: pointer;
	font-size: 1.2rem;
	padding: 0;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
}

.delete-button:hover {
	background: rgba(220, 53, 69, 0.1);
	transform: scale(1.2);
}

/* Cellules d'activité */
.activity-cell {
	padding: 14px 10px;
	border: 1px solid var(--border-primary);
	border-radius: 0.5rem;
	text-align: center;
	min-height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	color: var(--text-primary);
	font-size: 0.85rem;
	font-weight: 500;
	transition: all 0.3s ease;
}

.has-activity {
	background: rgba(66, 153, 225, 0.1);
	border-color: var(--accent-primary);
	color: var(--accent-secondary);
	font-weight: 600;
}

.fixed-activity {
	background: rgba(245, 101, 101, 0.1) !important;
	border-color: var(--danger) !important;
	color: var(--danger) !important;
}

.fixed-badge {
	position: absolute;
	top: 4px;
	right: 4px;
	background: linear-gradient(135deg, var(--danger), var(--danger-hover));
	color: #ffffff;
	font-size: 0.7rem;
	padding: 2px 6px;
	border-radius: 6px;
	font-weight: 600;
	box-shadow: 0 2px 4px rgba(245, 101, 101, 0.3);
}

/* Boutons d'étapes */
.step-buttons {
	display: flex;
	justify-content: space-between;
	margin-top: 2rem;
	gap: 1rem;
}

/* Emploi généré */
.generated-schedule {
	margin-top: 2rem;
	padding: 24px;
	background: var(--color-bg-secondary);
	border-radius: 0.5rem;
	border: 2px solid var(--border-primary);
}

.generated-schedule h4 {
	color: var(--text-primary);
	font-size: 1.3rem;
	font-weight: 600;
	margin-bottom: 1.5rem;
	text-align: center;
}

/* Légende */
.schedule-legend {
	display: flex;
	gap: 2rem;
	margin: 1.5rem 0;
	justify-content: center;
	flex-wrap: wrap;
}

.legend-item {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	font-size: 0.9rem;
	color: var(--text-secondary);
	padding: 8px 16px;
	border-radius: 0.5rem;
	background: var(--color-bg-tertiary);
	transition: all 0.3s ease;
}

.legend-item:hover {
	transform: translateY(-1px);
	box-shadow: var(--shadow-medium);
}

.legend-color {
	width: 18px;
	height: 18px;
	border-radius: 6px;
	box-shadow: var(--shadow-light);
}

.legend-color.fixed {
	background: rgba(245, 101, 101, 0.3);
	border: 2px solid var(--danger);
}

.legend-color.generated {
	background: rgba(66, 153, 225, 0.3);
	border: 2px solid var(--accent-primary);
}

/* Emploi enregistré */
.saved-schedule {
	text-align: center;
	padding: 2rem;
}

.saved-schedule h2 {
	margin-bottom: 2rem;
	font-size: 2rem;
}

/* Responsivité améliorée */
@media only screen and (max-width: 768px) {
	.emploi-container {
		padding: 1.5rem;
		margin: 1rem;
	}

	.time-grid,
	.fixed-schedule-grid,
	.schedule-grid {
		grid-template-columns: 90px repeat(7, 1fr);
		gap: 4px;
		font-size: 0.8rem;
	}

	.time-cell,
	.day-cell,
	.activity-cell,
	.header-cell {
		padding: 8px 4px;
		font-size: 0.75rem;
	}

	.step-buttons {
		flex-direction: column;
	}

	.modules-list {
		justify-content: center;
	}

	.legend-item {
		font-size: 0.8rem;
		padding: 6px 12px;
	}

	.schedule-legend {
		gap: 1rem;
	}

	h2 {
		font-size: 1.5rem;
	}
}

@media only screen and (max-width: 480px) {
	.time-grid,
	.fixed-schedule-grid,
	.schedule-grid {
		grid-template-columns: 70px repeat(7, 1fr);
		gap: 2px;
	}

	.time-cell,
	.day-cell,
	.activity-cell,
	.header-cell {
		padding: 6px 2px;
		font-size: 0.7rem;
	}

	.emploi-container {
		padding: 1rem;
	}

	.step-content {
		padding: 16px;
	}

	.btn-primary,
	.btn-secondary,
	.btn-outline {
		font-size: 0.9rem;
		padding: 12px 20px;
	}
}

/* Animations personnalisées */
@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.step {
	animation: fadeInUp 0.5s ease-out;
}

.generated-schedule {
	animation: fadeInUp 0.8s ease-out;
}

/* Amélioration des focus pour l'accessibilité */
*:focus-visible {
	outline: 2px solid var(--accent-primary);
	outline-offset: 2px;
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
	width: 8px;
}

::-webkit-scrollbar-track {
	background: var(--color-bg-tertiary);
	border-radius: 4px;
}

::-webkit-scrollbar-thumb {
	background: var(--border-secondary);
	border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
	background: var(--text-secondary);
}
</style>
