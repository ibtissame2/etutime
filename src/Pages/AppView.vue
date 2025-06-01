<template>
  <div>
    <!-- Bouton de navigation principal -->
    <button @click="toggleView" class="nav-button">
      {{ showEnvironments ? 'Retour au questionnaire' : 'Voir les environnements' }}
    </button>

    <div v-if="!showEnvironments" class="questionnaire-container">
      <!-- Conteneur principal centré -->
      <div class="main-panel">
        
        <!-- Titre avec style pastel -->
        <div class="title-container">
          <h1 class="main-title">
            Questionnaire sur la concentration et l'organisation du travail
          </h1>
        </div>
        
        <!-- Contenu du questionnaire (visible uniquement si non terminé) -->
        <div v-if="!termine" class="questionnaire-content">
          <!-- Catégorie actuelle - style pastel -->
          <div class="category-header">
            <h2>{{ categories[currentCategoryIndex] }}</h2>
          </div>
          
          <!-- Barre de progression stylisée -->
          <div class="progress-container">
            <div 
              :style="{ width: pourcentage + '%' }"
              class="progress-bar"
            ></div>
          </div>
          
          <!-- Compteur de questions avec design pastel -->
          <div class="question-counter">
            <div class="question-badge">
              Question {{ currentQuestionNumber }}
            </div>
            <div class="question-total">
              {{ currentQuestionNumber }} sur {{ totalQuestions }}
            </div>
          </div>
          
          <!-- Question avec style pastel -->
          <div class="question-panel">
            <h2>{{ currentQuestion.texte }}</h2>
          </div>
          
          <!-- Options de réponse avec design pastel -->
          <div v-if="currentQuestion.type === 'choix'" class="choices-container">
            <div class="choices-wrapper">
              <button
                v-for="(option, index) in currentQuestion.options"
                :key="index"
                @click="choisir(option.texte, option.valeur)"
                class="choice-button"
              >
                <span class="choice-letter">{{ String.fromCharCode(97 + index) }}</span>
                <span class="choice-text">{{ option.texte }}</span>
              </button>
            </div>
          </div>

          <!-- Question spéciale (réponse ouverte) avec style pastel -->
          <div v-if="currentQuestion.type === 'ouvert'" class="open-response">
            <div class="textarea-container">
              <textarea 
                v-model="reponseOuverte" 
                placeholder="Votre réponse..."
                class="open-textarea"
              ></textarea>
            </div>
            <div class="submit-container">
              <button 
                @click="soumettreReponseOuverte" 
                class="submit-button"
              >
                Soumettre
              </button>
            </div>
          </div>
        </div>
        
        <!-- Écran de fin -->
        <div v-if="termine" class="completion-screen">
          <div class="completion-content">
            <div class="completion-circle">
              <span>✓</span>
            </div>
            <h2 class="completion-title">Résultat</h2>
            
            <div class="concentration-result">
              <p>Votre niveau de concentration est : 
                <span class="concentration-level" :data-level="concentrationLevel">
                  {{ concentrationLevel || 'En cours d\'analyse...' }}
                </span>
              </p>
              
              <p class="completion-text">Nous avons analysé votre profil de concentration.</p>
              <p v-if="scoreDetails">
                Organisation: {{ Math.round(scoreDetails.organisation * 100) }}% | 
                Concentration: {{ Math.round(scoreDetails.concentration * 100) }}% | 
                Motivation: {{ Math.round(scoreDetails.motivation * 100) }}%
              </p>
            </div>
            
            <div class="button-container">
              <button 
                @click="navigateToTimeTable" 
                class="start-study-button"
              >
                Commencer l'étude
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Vue des environnements -->
    <div v-if="showEnvironments" class="environments-view">
      <EmploiUpload 
        :niveau="concentrationLevel"
        ref="emploiUpload"
      />
      <EmploiCree 
  :niveau="concentrationLevel" 
  @enregistrer="handleEnregistrement"
/>
    </div>
  </div>
</template>

<script>
import { fetch, getCredentials,fetchPython  } from '@/store/axios'; // Remplace l'import axios direct


export default {
  data() {
    return {
      concentrationLevel: null,
      niveauDetecte: null,
      showEnvironments: false,
      termine: false,
      timetableData: [],
      scoreDetails: null,
      categories: [
        "Organisation des études",
        "Habitudes de travail et concentration",
        "Gestion des pauses et de la motivation",
        "Personnalisation et suggestions"
      ],
      questionsParCategorie: [
        // Catégorie 1: Organisation des études
        [
          {
            texte: "Comment organises-tu ton emploi du temps ?",
            type: "choix",
            options: [
              { texte: "J'ai un planning détaillé et je le respecte", valeur: 3 },
              { texte: "J'ai un planning, mais j'ai du mal à le suivre", valeur: 2 },
              { texte: "Je n'ai pas de planning précis", valeur: 1 }
            ]
          },
          {
            texte: "À quelle fréquence procrastines-tu ?",
            type: "choix",
            options: [
              { texte: "Très rarement, je fais mes tâches immédiatement", valeur: 3 },
              { texte: "Parfois, surtout pour les tâches longues", valeur: 2 },
              { texte: "Souvent, je reporte jusqu'à la dernière minute", valeur: 1 }
            ]
          },
          {
            texte: "Comment gères-tu les distractions en étudiant ?",
            type: "choix",
            options: [
              { texte: "J'éteins mon téléphone et je me coupe des distractions", valeur: 3 },
              { texte: "Je consulte parfois mon téléphone, mais je me reconcentre vite", valeur: 2 },
              { texte: "Je suis souvent distrait(e) et j'ai du mal à revenir à mon travail", valeur: 1 }
            ]
          },
          {
            texte: "As-tu l'habitude de planifier tes objectifs pour la semaine ?",
            type: "choix",
            options: [
              { texte: "Oui, je les note et je les suis", valeur: 3 },
              { texte: "Je les ai en tête sans les noter", valeur: 2 },
              { texte: "Je n'y pense pas vraiment", valeur: 1 }
            ]
          }
        ],
        // Catégorie 2: Habitudes de travail et concentration
        [
          {
            texte: "Combien de temps arrives-tu à rester concentré(e) sans interruption ?",
            type: "choix",
            options: [
              { texte: "Plus de 45 minutes", valeur: 3 },
              { texte: "Entre 20 et 45 minutes", valeur: 2 },
              { texte: "Moins de 20 minutes", valeur: 1 }
            ]
          },
          {
            texte: "Quel environnement de travail préfères-tu ?",
            type: "choix",
            options: [
              { texte: "Un lieu calme et structuré", valeur: 3 },
              { texte: "Un lieu avec du bruit modéré (café, musique en fond)", valeur: 2 },
              { texte: "Peu importe, je travaille n'importe où", valeur: 1 }
            ]
          },
          {
            texte: "Quand tu étudies, quelles sont tes principales distractions ?",
            type: "choix",
            options: [
              { texte: "Aucune, je reste très concentré(e)", valeur: 3 },
              { texte: "Téléphone et réseaux sociaux", valeur: 2 },
              { texte: "Je me laisse distraire par tout ce qui m'entoure", valeur: 1 }
            ]
          },
          {
            texte: "Étudies-tu plutôt le matin, l'après-midi ou le soir ?",
            type: "choix",
            options: [
              { texte: "Le matin, quand je suis le plus frais(che)", valeur: 3 },
              { texte: "L'après-midi, selon les disponibilités", valeur: 2 },
              { texte: "Le soir, parfois tard", valeur: 1 }
            ]
          }
        ],
        // Catégorie 3: Gestion des pauses et de la motivation
        [
          {
            texte: "Comment prends-tu tes pauses ?",
            type: "choix",
            options: [
              { texte: "Je fais des pauses structurées (ex: technique Pomodoro)", valeur: 3 },
              { texte: "Je prends des pauses aléatoires", valeur: 2 },
              { texte: "Je ne prends pas vraiment de pauses, ou j'en prends trop souvent", valeur: 1 }
            ]
          },
          {
            texte: "Qu'est-ce qui t'aide à rester concentré(e) ?",
            type: "choix",
            options: [
              { texte: "Un environnement calme et une bonne organisation", valeur: 3 },
              { texte: "De la musique ou des bruits de fond", valeur: 2 },
              { texte: "Rien, j'ai du mal à rester concentré(e)", valeur: 1 }
            ]
          },
          {
            texte: "Utilises-tu des outils pour améliorer ta concentration (applications, méthodes de productivité) ?",
            type: "choix",
            options: [
              { texte: "Oui, et ça m'aide beaucoup", valeur: 3 },
              { texte: "J'ai essayé, mais ça ne marche pas toujours", valeur: 2 },
              { texte: "Non, je n'en utilise pas", valeur: 1 }
            ]
          },
          {
            texte: "Lorsque tu perds ta motivation, que fais-tu ?",
            type: "choix",
            options: [
              { texte: "Je fais une pause ou change de tâche temporairement", valeur: 3 },
              { texte: "Je continue avec difficulté", valeur: 2 },
              { texte: "J'abandonne temporairement", valeur: 1 }
            ]
          }
        ],
        // Catégorie 4: Personnalisation et suggestions
        [
          {
            texte: "Quelle fonctionnalité te semblerait la plus utile dans une application d'organisation ?",
            type: "choix",
            options: [
              { texte: "Un planificateur intelligent qui adapte mon emploi du temps", valeur: 7 },
              { texte: "Un gestionnaire de tâches avec rappels", valeur: 6 },
              { texte: "Un outil pour suivre ma concentration et mes performances", valeur: 5 },
              { texte: "Un assistant qui me donne des conseils pour améliorer ma productivité", valeur: 4 }
            ]
          },
          {
            texte: "Si ton niveau de concentration pouvait être évalué en temps réel, comment voudrais-tu que l'application adapte ton environnement de travail ?",
            type: "ouvert",
            options: []
          }
        ]
      ],
      reponses: [],
      valeursConcentration: [],
      currentCategoryIndex: 0,
      currentQuestionIndex: 0,
      reponseOuverte: "",
    };
  },
  computed: {
    currentQuestion() {
      return this.questionsParCategorie[this.currentCategoryIndex][this.currentQuestionIndex];
    },
    totalQuestions() {
      return this.questionsParCategorie.reduce((total, categorie) => total + categorie.length, 0);
    },
    currentQuestionNumber() {
      let count = 1;
      for (let i = 0; i < this.currentCategoryIndex; i++) {
        count += this.questionsParCategorie[i].length;
      }
      return count + this.currentQuestionIndex;
    },
    pourcentage() {
      return ((this.currentQuestionNumber - 1) / this.totalQuestions) * 100;
    }
  },
  methods: {
    navigateToTimeTable() {
    // Redirection vers DashboardView.vue
    this.$router.push('/dashboard');
    },
    toggleView() {
      this.showEnvironments = !this.showEnvironments;
    },
    choisir(reponse, valeur) {
      this.reponses.push({ question: this.currentQuestion.texte, reponse: reponse });
      this.valeursConcentration.push(valeur);
      this.avancerQuestion();
    },
    soumettreReponseOuverte() {
      if (this.reponseOuverte.trim() !== "") {
        this.reponses.push({ 
          question: this.currentQuestion.texte, 
          reponse: this.reponseOuverte 
        });
        this.reponseOuverte = "";
        this.avancerQuestion();
      }
    },
    avancerQuestion() {
      if (this.currentQuestionIndex < this.questionsParCategorie[this.currentCategoryIndex].length - 1) {
        this.currentQuestionIndex++;
      } else if (this.currentCategoryIndex < this.questionsParCategorie.length - 1) {
        this.currentCategoryIndex++;
        this.currentQuestionIndex = 0;
      } else {
        this.termine = true;
        this.analyserReponses();
      }
    },
    // Dans AppView.vue, remplacer la méthode analyserReponses() par :


// Ajouter cette nouvelle méthode pour sauvegarder en base :
// Méthode analyserReponses corrigée pour AppView.vue

async analyserReponses() {
  console.log("Analyse des réponses en cours...");
  
  try {
    const response = await fetchPython('analyser', {
      valeursConcentration: this.valeursConcentration
    });
    
    if (response?.niveau) {
      this.concentrationLevel = response.niveau;
      this.niveauDetecte = response.niveau;
      
      if (response.scores_details) {
        this.scoreDetails = response.scores_details;
      }

      await this.sauvegarderQuestionnaire(
        response.niveau, 
        Math.round((response.score_moyen || 0) * 100)
      );
    }
  } catch (error) {
    console.error("Erreur lors de l'analyse:", error);
  }
},


async sauvegarderQuestionnaire(niveau, scoreTotal) {
      try {
        const credentials = getCredentials();
        
        if (!credentials) {
          throw new Error('Utilisateur non authentifié');
        }

        const response = await fetch('questionnaires/save_questionnaire', {
          niveau,
          scoreTotal,
          credentials
        });

        if (!response.success) {
          throw new Error(response.message || 'Erreur lors de la sauvegarde');
        }

        console.log('Sauvegarde réussie:', response.data);
        return response.data;

      } catch (error) {
        console.error('Erreur sauvegarde:', error);
        useNotificationsStore().addNotification('error', error.message);
        // Fallback: sauvegarde locale
        this.stockerLocalement(niveau, scoreTotal);
        return null;
      }
    },

    
async recupererDernierQuestionnaire() {
  try {
    const credentials = getCredentials();
    const response = await fetch('questionnaires/get_questionnaire', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        credentials
      })
    });
    
    const data = await response.json();
    
    if (data.success && data.data) {
      console.log("Dernier questionnaire:", data.data);
      return data.data;
    }
    
  } catch (error) {
    console.error("Erreur lors de la récupération:", error);
  }
  return null;
},
    
    recommencer() {
      this.currentCategoryIndex = 0;
      this.currentQuestionIndex = 0;
      this.reponses = [];
      this.valeursConcentration = [];
      this.reponseOuverte = "";
      this.termine = false;
      this.showEnvironments = false;
      this.concentrationLevel = null;
      this.scoreDetails = null;
    }
  }
}
</script>

<style>
/* Variables pour les deux thèmes */
:root {
  /* Thème clair */
  --primary-color: #667eea;
  --primary-dark: #5a67d8;
  --primary-light: #e0e7ff;
  --success-color: #10b981;
  --error-color: #ef4444;
  --warning-color: #f59e0b;
  --info-color: #3b82f6;
  
  /* Couleurs de fond et texte - thème clair */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-gradient: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
  --input-bg: #ffffff;
  --card-bg: #ffffff;
  --hover-bg: #f9fafb;
  
  /* Ombres */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --border-radius: 12px;
  --border-radius-sm: 8px;
}

/* Thème sombre */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #111827;
    --bg-secondary: #1f2937;
    --bg-gradient: linear-gradient(135deg, #050c33 0%, #000000 100%);
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
    --border-color: #374151;
    --input-bg: #374151;
    --card-bg: #1f2937;
    --hover-bg: #374151;
    
    /* Ombres pour le thème sombre */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4);
  }
}

/* Reset et styles de base */
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-gradient);
  color: var(--text-primary);
  transition: var(--transition);
}

/* Bouton de navigation */
.nav-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: linear-gradient(to right, var(--primary-color), var(--primary-dark));
  padding: 10px 20px;
  border-radius: 25px;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 500;
  box-shadow: var(--shadow-md);
  transition: var(--transition);
}

.nav-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Container principal */
.questionnaire-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background: var(--bg-gradient);
}

/* Panel principal */
.main-panel {
  width: 100%;
  max-width: 700px;
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  padding: 2.5rem;
  box-shadow: var(--shadow-xl);
  text-align: center;
  color: var(--text-primary);
  animation: fadeIn 0.5s ease-out;
  border: 1px solid var(--border-color);
}

/* Titres */
.main-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  text-align: center;
  position: relative;
  padding-bottom: 0.5rem;
}

.main-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(to right, var(--primary-color), var(--primary-dark));
  border-radius: 3px;
}

/* En-tête de catégorie */
.category-header {
  background: linear-gradient(to right, var(--primary-color), var(--primary-dark));
  padding: 0.8rem 1.5rem;
  border-radius: var(--border-radius-sm);
  margin-bottom: 1.5rem;
  color: white;
  box-shadow: var(--shadow-md);
}

.category-header h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

/* Barre de progression */
.progress-container {
  width: 100%;
  height: 8px;
  background-color: var(--border-color);
  border-radius: var(--border-radius-sm);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(to right, var(--primary-color), var(--primary-dark));
  transition: width 0.5s ease;
}

/* Compteur de questions */
.question-counter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.question-badge {
  background: linear-gradient(to right, var(--primary-color), var(--primary-dark));
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: white;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.question-total {
  color: var(--primary-color);
  font-size: 0.9rem;
  font-weight: 500;
}

/* Panel de question */
.question-panel {
  background-color: var(--card-bg);
  padding: 1.5rem;
  border-radius: var(--border-radius-sm);
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--primary-color);
  text-align: left;
  box-shadow: var(--shadow-sm);
}

.question-panel h2 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

/* Conteneur des choix de réponse */
.choices-container {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

/* Bouton de choix */
.choice-button {
  background-color: var(--card-bg);
  color: var(--text-primary);
  padding: 1rem 1.5rem;
  border-radius: var(--border-radius-sm);
  text-align: left;
  border: 1px solid var(--border-color);
  transition: var(--transition);
  display: flex;
  align-items: center;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.choice-button:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  background-color: var(--hover-bg);
}

.choice-letter {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-weight: 600;
  color: white;
  font-size: 0.9rem;
}

.choice-text {
  flex: 1;
  text-align: left;
}

/* Question ouverte */
.open-response {
  margin-top: 1.5rem;
}

.open-textarea {
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  resize: vertical;
  margin-bottom: 1rem;
  font-family: inherit;
  transition: var(--transition);
  background-color: var(--input-bg);
  color: var(--text-primary);
}

.open-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.submit-button {
  background: linear-gradient(to right, var(--primary-color), var(--primary-dark));
  padding: 0.8rem 1.5rem;
  border-radius: var(--border-radius-sm);
  color: white;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: var(--transition);
  font-size: 1rem;
  box-shadow: var(--shadow-md);
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Écran de fin */
.completion-screen {
  text-align: center;
  padding: 2rem 0;
}

.completion-circle {
  height: 80px;
  width: 80px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: var(--shadow-lg);
}

.completion-circle span {
  font-size: 2.5rem;
  color: white;
}

.completion-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.concentration-result {
  background-color: var(--card-bg);
  padding: 1.5rem;
  border-radius: var(--border-radius-sm);
  margin: 1.5rem 0;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.concentration-level {
  font-weight: 700;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  color: white;
  display: inline-block;
}

.concentration-level[data-level="faible"] {
  background: linear-gradient(135deg, var(--error-color), #fca5a5);
}

.concentration-level[data-level="moyen"] {
  background: linear-gradient(135deg, var(--warning-color), #fcd34d);
}

.concentration-level[data-level="élevé"] {
  background: linear-gradient(135deg, var(--success-color), #6ee7b7);
}

.completion-text {
  color: var(--text-secondary);
  margin: 1rem 0;
  line-height: 1.6;
}

.start-study-button {
  background: linear-gradient(to right, var(--primary-color), var(--primary-dark));
  padding: 0.8rem 2rem;
  border-radius: 25px;
  color: white;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 1.5rem;
  box-shadow: var(--shadow-lg);
}

.start-study-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

/* Vue des environnements */
.environments-view {
  width: 100%;
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-panel {
    padding: 1.5rem;
  }
  
  .main-title {
    font-size: 1.5rem;
  }
  
  .question-panel h2 {
    font-size: 1.1rem;
  }
  
  .choice-button {
    padding: 0.8rem 1rem;
  }
}

@media (max-width: 576px) {
  .nav-button {
    top: 10px;
    right: 10px;
    padding: 8px 15px;
    font-size: 0.9rem;
  }
  
  .main-panel {
    padding: 1.2rem;
  }
  
  .main-title {
    font-size: 1.3rem;
  }
  
  .category-header h2 {
    font-size: 1rem;
  }
  
  .question-panel h2 {
    font-size: 1rem;
  }
  
  .choice-letter {
    width: 24px;
    height: 24px;
    font-size: 0.8rem;
    margin-right: 0.8rem;
  }
}

/* Pour les préférences de réduction de mouvement */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>