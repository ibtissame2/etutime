<template>
  <div class="emploi-container">
    <div v-if="niveau === 'élevé'" class="custom-schedule">
      <h2>Créez votre emploi du temps personnalisé</h2>
      <p>Complétez votre emploi du temps selon vos préférences</p>
      
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
            >
          </div>
        </div>
      </div>
      
      <button @click="enregistrerEmploi" class="save-button">Enregistrer mon emploi du temps</button>
    </div>
    
    <div v-else class="auto-schedule">
      <h2>Votre emploi du temps optimisé</h2>
      <p>Nous allons générer un emploi du temps adapté à votre niveau de concentration</p>
      
      <div class="schedule-steps">
        <!-- Étape 1: Configuration de base -->
        <div class="step" :class="{ 'active-step': etapeActuelle === 1 }">
          <div class="step-header" @click="etapeActuelle = 1">
            <span class="step-number">1</span>
            <h3>Configuration de base</h3>
          </div>
          <div class="step-content" v-show="etapeActuelle === 1">
            <div class="option-group">
              <label>Niveau d'études :</label>
              <select v-model="niveauEtudes" class="select-input">
                <option value="college">Collège</option>
                <option value="universite">Université</option>
              </select>
            </div>
            
            <div class="option-group">
              <label>Modules/Cours :</label>
              <div class="modules-input">
                <input 
                  v-model="nouveauModule" 
                  type="text" 
                  placeholder="Ajouter un module"
                  @keyup.enter="ajouterModule"
                  class="module-input"
                >
                <button @click="ajouterModule" class="add-button">+</button>
              </div>
              <div class="modules-list">
                <div v-for="(module, index) in modules" :key="index" class="module-item">
                  {{ module }}
                  <button @click="supprimerModule(index)" class="delete-button">×</button>
                </div>
              </div>
            </div>
            
            <button @click="etapeActuelle = 2" class="next-button">Suivant</button>
          </div>
        </div>
        
        <!-- Étape 2: Saisie des horaires fixes -->
        <div class="step" :class="{ 'active-step': etapeActuelle === 2 }">
          <div class="step-header" @click="etapeActuelle = 2">
            <span class="step-number">2</span>
            <h3>Horaire des cours/obligations</h3>
          </div>
          <div class="step-content" v-show="etapeActuelle === 2">
            <p>Indiquez vos créneaux fixes (cours, travail, etc.) :</p>
            
            <div class="fixed-schedule-grid">
              <div class="grid-header">
                <div class="header-cell">Heure</div>
                <div v-for="jour in jours" :key="jour" class="header-cell">{{ jour }}</div>
              </div>
              
              <div v-for="(creneau, index) in creneaux" :key="index" class="grid-row">
                <div class="time-cell">{{ creneau }}</div>
                <div v-for="jour in jours" :key="jour" class="day-cell">
                  <input
                    v-model="horaireFixe[jour][index]"
                    type="text"
                    placeholder="Libre"
                    class="fixed-input"
                  >
                </div>
              </div>
            </div>
            
            <div class="step-buttons">
              <button @click="etapeActuelle = 1" class="back-button">Retour</button>
              <button @click="etapeActuelle = 3" class="next-button">Suivant</button>
            </div>
          </div>
        </div>
        
        <!-- Étape 3: Génération et validation -->
        <div class="step" :class="{ 'active-step': etapeActuelle === 3 }">
          <div class="step-header" @click="etapeActuelle = 3">
            <span class="step-number">3</span>
            <h3>Génération de l'emploi du temps</h3>
          </div>
          <div class="step-content" v-show="etapeActuelle === 3">
            <button @click="genererEmploi" class="generate-button">Générer l'emploi du temps</button>
            
            <div v-if="emploiGenere" class="generated-schedule">
              <h4>Votre emploi du temps optimisé :</h4>
              
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
                      'fixed-activity': horaireFixe[jour][index]
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
              
              <button @click="enregistrerEmploi" class="save-button">Enregistrer cet emploi du temps</button>
            </div>
            
            <div class="step-buttons">
              <button @click="etapeActuelle = 2" class="back-button">Retour</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    niveau: {
      type: String,
      required: true,
      validator: value => ['faible', 'moyen', 'élevé'].includes(value)
    }
  },
  
  data() {
    return {
      jours: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
      creneaux: [],
      emploiPersonnalise: {},
      emploiGenere: null,
      niveauEtudes: 'universite',
      modules: [],
      nouveauModule: '',
      etapeActuelle: 1,
      horaireFixe: {}
    }
  },
  
  created() {
    this.genererCreneaux();
    this.initialiserEmploiVide();
    this.initialiserHoraireFixe();
  },
  
  methods: {
    genererCreneaux() {
      const creneaux = [];
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
          creneaux.push(`${debutStr} - ${finStr}`);
        } else {
          heureDebut = new Date(heureDebut.getTime() + 60 * 60000); // Passer à 13h
        }
      }
      
      this.creneaux = creneaux;
    },
    
    initialiserEmploiVide() {
      const emploi = {};
      this.jours.forEach(jour => {
        emploi[jour] = Array(this.creneaux.length).fill('');
      });
      this.emploiPersonnalise = emploi;
    },
    
    initialiserHoraireFixe() {
      const horaire = {};
      this.jours.forEach(jour => {
        horaire[jour] = Array(this.creneaux.length).fill('');
      });
      this.horaireFixe = horaire;
    },
    
    ajouterModule() {
      if (this.nouveauModule.trim() && !this.modules.includes(this.nouveauModule.trim())) {
        this.modules.push(this.nouveauModule.trim());
        this.nouveauModule = '';
      }
    },
    
    supprimerModule(index) {
      this.modules.splice(index, 1);
    },
    
    genererEmploi() {
      if (this.modules.length === 0) {
        alert('Veuillez ajouter au moins un module');
        return;
      }
      
      // Créer une copie de l'horaire fixe comme base
      const planning = JSON.parse(JSON.stringify(this.horaireFixe));
      
      // Ajouter 1 heure de transport après le dernier cours de chaque journée
      this.jours.forEach(jour => {
        let dernierIndex = -1;
        
        // Trouver l'index du dernier cours fixe de la journée
        for (let i = this.creneaux.length - 1; i >= 0; i--) {
          if (this.horaireFixe[jour][i]) {
            dernierIndex = i;
            break;
          }
        }
        
        // Ajouter transport si possible
        if (dernierIndex !== -1 && dernierIndex + 1 < this.creneaux.length) {
          const heureTransport = parseInt(this.creneaux[dernierIndex + 1].split('-')[0].trim().split(':')[0]);
          if (heureTransport !== 12 && !planning[jour][dernierIndex + 1]) {
            planning[jour][dernierIndex + 1] = 'Transport';
          }
        }
      });
      
      // Fonction pour assigner des sessions de 2h
      const assigner = (jour, nomsModules, typeActivite, startIndex = 0) => {
        let slotsAssignes = 0;
        let currentIndex = startIndex;
        
        while (slotsAssignes < nomsModules.length && currentIndex < this.creneaux.length - 1) {
          const heureDebut = parseInt(this.creneaux[currentIndex].split('-')[0].trim().split(':')[0]);
          
          // Vérifier disponibilité et éviter 12h-13h
          if (!planning[jour][currentIndex] && 
              !planning[jour][currentIndex + 1] &&
              heureDebut !== 11) {
            
            planning[jour][currentIndex] = `${typeActivite} ${nomsModules[slotsAssignes]}`;
            planning[jour][currentIndex + 1] = `${typeActivite} ${nomsModules[slotsAssignes]} (suite)`;
            slotsAssignes++;
            currentIndex += 2;
          } else {
            currentIndex++;
          }
        }
      };
      
      // Logique de génération
      if (this.modules.length === 4) {
        if (this.niveauEtudes === 'universite') {
          assigner('Lundi', this.modules.slice(0, 2), 'Révision');
          assigner('Mercredi', this.modules.slice(2, 4), 'Révision');
          assigner('Mardi', this.modules.slice(0, 2), 'TD');
          assigner('Jeudi', this.modules.slice(2, 4), 'TD');
          assigner('Vendredi', this.modules.slice(0, 2), 'Révision');
          assigner('Samedi', this.modules.slice(2, 4), 'TD');
          
          // TP le dimanche si possible
          if (this.creneaux.length >= 2 && 
              !planning['Dimanche'][0] && 
              !planning['Dimanche'][1]) {
            planning['Dimanche'][0] = 'TP';
            planning['Dimanche'][1] = 'TP (suite)';
          }
        } else {
          assigner('Lundi', this.modules.slice(0, 2), 'Révision');
          assigner('Mercredi', this.modules.slice(2, 4), 'Révision');
          assigner('Mardi', this.modules.slice(0, 2), 'Exercice');
          assigner('Jeudi', this.modules.slice(2, 4), 'Exercice');
          assigner('Vendredi', this.modules.slice(0, 2), 'Révision');
          assigner('Samedi', this.modules.slice(2, 4), 'Exercice');
        }
      }
      else if (this.modules.length === 6) {
        if (this.niveauEtudes === 'universite') {
          assigner('Lundi', this.modules.slice(0, 2), 'Révision');
          assigner('Mercredi', this.modules.slice(2, 4), 'Révision');
          assigner('Mardi', this.modules.slice(0, 2), 'TD');
          assigner('Jeudi', this.modules.slice(2, 4), 'TD');
          assigner('Vendredi', this.modules.slice(4, 6), 'Révision');
          assigner('Samedi', this.modules.slice(4, 6), 'TD');
          
          if (this.creneaux.length >= 2 && 
              !planning['Dimanche'][0] && 
              !planning['Dimanche'][1]) {
            planning['Dimanche'][0] = 'TP';
            planning['Dimanche'][1] = 'TP (suite)';
          }
        } else {
          assigner('Lundi', this.modules.slice(0, 2), 'Révision');
          assigner('Mercredi', this.modules.slice(2, 4), 'Révision');
          assigner('Mardi', this.modules.slice(0, 2), 'Exercice');
          assigner('Jeudi', this.modules.slice(2, 4), 'Exercice');
          assigner('Vendredi', this.modules.slice(4, 6), 'Révision');
          assigner('Samedi', this.modules.slice(4, 6), 'Exercice');
        }
      }
      else if (this.modules.length >= 7) {
        if (this.niveauEtudes === 'universite') {
          assigner('Lundi', this.modules.slice(0, 2), 'Révision');
          assigner('Mercredi', this.modules.slice(2, 4), 'Révision');
          assigner('Mardi', this.modules.slice(0, 2), 'TD');
          assigner('Jeudi', this.modules.slice(2, 4), 'TD');
          assigner('Vendredi', this.modules.slice(4, 7), 'Révision');
          assigner('Samedi', this.modules.slice(4, 7), 'TD');
          
          if (this.creneaux.length >= 2 && 
              !planning['Dimanche'][0] && 
              !planning['Dimanche'][1]) {
            planning['Dimanche'][0] = 'TP';
            planning['Dimanche'][1] = 'TP (suite)';
          }
        } else {
          assigner('Lundi', this.modules.slice(0, 2), 'Révision');
          assigner('Mercredi', this.modules.slice(2, 4), 'Révision');
          assigner('Mardi', this.modules.slice(0, 2), 'Exercice');
          assigner('Jeudi', this.modules.slice(2, 4), 'Exercice');
          assigner('Vendredi', this.modules.slice(4, 7), 'Révision');
          assigner('Samedi', this.modules.slice(4, 7), 'Exercice');
        }
      }
      
      this.emploiGenere = planning;
    },
    
enregistrerEmploi() {
    const emploiAEnregistrer = this.niveau === 'élevé' ? this.emploiPersonnalise : this.emploiGenere;
    this.$emit('enregistrer', {
        emploi: emploiAEnregistrer,
        horaireFixe: this.horaireFixe
    });
    alert('Emploi du temps enregistré avec succès !');
}
  }
}

</script>
<style scoped>
/* (Les styles restent exactement les mêmes que dans la version précédente) */
.emploi-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #6a5acd;
  margin-bottom: 1rem;
  text-align: center;
}

p {
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
}

.time-grid {
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 2rem;
}

.time-header, .time-row {
  display: contents;
}

.time-cell, .day-cell {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.time-header .time-cell, .time-header .day-cell {
  background-color: #6a5acd;
  color: white;
  font-weight: bold;
  text-align: center;
}

.activity-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.save-button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #6a5acd;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s;
}

.save-button:hover {
  background-color: #5a4acd;
}

.schedule-steps {
  margin-top: 2rem;
}

.step {
  margin-bottom: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.step-header {
  background-color: #f5f5f5;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.step-header h3 {
  margin: 0;
  color: #6a5acd;
}

.step-number {
  background-color: #6a5acd;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.step-content {
  padding: 1.5rem;
}

.active-step .step-header {
  background-color: #6a5acd;
}

.active-step .step-header h3 {
  color: white;
}

.option-group {
  margin-bottom: 1.5rem;
}

.option-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.select-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.modules-input {
  display: flex;
  margin-bottom: 0.5rem;
}

.module-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px 0 0 5px;
  font-size: 16px;
}

.add-button {
  padding: 10px 15px;
  background-color: #6a5acd;
  color: white;
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  font-size: 16px;
}

.modules-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.module-item {
  background-color: #e6e6fa;
  padding: 8px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.delete-button {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
}

.fixed-schedule-grid {
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
  gap: 8px;
  margin-top: 1rem;
}

.grid-header, .grid-row {
  display: contents;
}

.header-cell {
  padding: 12px;
  background-color: #6a5acd;
  color: white;
  font-weight: bold;
  text-align: center;
  border-radius: 8px;
}

.fixed-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.next-button, .back-button {
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
}

.next-button {
  background-color: #6a5acd;
  color: white;
  border: none;
}

.back-button {
  background-color: white;
  color: #6a5acd;
  border: 1px solid #6a5acd;
  margin-right: 1rem;
}

.step-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.generate-button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #6a5acd;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin: 1rem 0;
  transition: background-color 0.3s;
}

.generate-button:hover {
  background-color: #5a4acd;
}

.generated-schedule {
  margin-top: 2rem;
}

.schedule-grid {
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 2rem;
}

.activity-cell {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-align: center;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.has-activity {
  background-color: #e6e6fa;
  font-weight: 500;
}

.fixed-activity {
  background-color: #ffe0e0 !important;
}

.fixed-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: #ff6b6b;
  color: white;
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 3px;
}

.schedule-legend {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 14px;
  color: #555;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.legend-color.fixed {
  background-color: #ffe0e0;
  border: 1px solid #ff6b6b;
}

.legend-color.generated {
  background-color: #e6e6fa;
  border: 1px solid #6a5acd;
}
</style>