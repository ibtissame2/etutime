<script setup>
import MainContainer from '@/Components/src/MainContainer.vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import { ArrowsRightLeftIcon, XMarkIcon, EyeIcon } from '@heroicons/vue/16/solid';
import PageTitle from '@/Components/Common/PageTitle.vue';
import { ref, onMounted } from 'vue';
import { fetch, getCredentials } from '@/store/axios';

const files = ref([]);
const imports = ref([]);
const isUploading = ref(false);
const isLoading = ref(false);
const uploadMessage = ref('');
const fileInput = ref(null);

// Variables pour l'affichage du contenu des fichiers
const showFileModal = ref(false);
const fileContent = ref('');
const currentFile = ref(null);
const isLoadingContent = ref(false);

onMounted(() => {
  loadImports();
});

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileSelect = (event) => {
  const selectedFiles = Array.from(event.target.files);
  files.value = [...files.value, ...selectedFiles];
};

const removeFile = (index) => {
  files.value.splice(index, 1);
};

const loadImports = async () => {
  isLoading.value = true;
  try {
    const credentials = getCredentials();
    const response = await fetch('import/getImports', {
      credentials
    });
    
    if (response.success) {
      imports.value = response.data;
    } else {
      console.error('Erreur :', response.message);
    }
  } catch (error) {
    console.error('Erreur réseau :', error);
  } finally {
    isLoading.value = false;
  }
};

const getPdfUrl = (file) => {
  if (!file.file_path) return '';
  
  // Si le chemin commence déjà par /uploads, on l'utilise directement
  if (file.file_path.startsWith('/uploads/')) {
    return file.file_path;
  }
  
  // Sinon, on construit le chemin correctement
  return '/uploads/' + file.file_path.replace(/^uploads\//, '');
};

// Fonction améliorée pour déterminer le type d'import basé sur l'extension
const getImportType = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  const typeMapping = {
    'ical': 'ical',
    'ics': 'ical',
    'csv': 'csv',
    'json': 'json',
    'xml': 'xml',
    'pdf': 'pdf',
    'doc': 'document',
    'docx': 'document',
    'xls': 'spreadsheet',
    'xlsx': 'spreadsheet',
    'txt': 'text',
    'md': 'markdown'
  };
  return typeMapping[extension] || 'other';
};

// Fonction améliorée pour obtenir l'icône du fichier
const getFileIcon = (type) => {
  // Si 'type' est une extension, on l'utilise directement
  let fileType = type;
  if (type && type.length <= 4) {
    // C'est probablement une extension
    const typeMapping = {
      'pdf': 'pdf',
      'doc': 'document',
      'docx': 'document',
      'xls': 'spreadsheet',
      'xlsx': 'spreadsheet',
      'csv': 'spreadsheet',
      'json': 'json',
      'xml': 'xml',
      'ical': 'calendar',
      'ics': 'calendar',
      'txt': 'text',
      'md': 'text'
    };
    fileType = typeMapping[type.toLowerCase()] || type;
  }

  const iconMapping = {
    'pdf': '📄',
    'document': '📝',
    'spreadsheet': '📊',
    'excel': '📊',
    'csv': '📊',
    'json': '📋',
    'xml': '🗂️',
    'calendar': '📅',
    'ical': '📅',
    'text': '📄',
    'markdown': '📄',
    'image': '🖼️'
  };

  return iconMapping[fileType] || '📁';
};

// Fonction modifiée pour sauvegarder l'import avec le bon type
const saveImport = async (file, filePath, uploadResponse) => {
  try {
    const credentials = getCredentials();
    const detectedType = uploadResponse.file_type || getImportType(file.name);
    
    const importData = {
      file_name: file.name,
      file_path: filePath,
      file_type: detectedType,
      import_type: detectedType,
      status: 'completed',
      processed_items: 0,
      total_items: 0,
      title: file.name.replace(/\.[^/.]+$/, ""),
      pages: Math.floor(Math.random() * 100) + 10,
      date: new Date().toISOString().split('T')[0]
    };

    const response = await fetch('import/saveImport', {
      ...importData,
      credentials
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Erreur lors de la sauvegarde');
    }
    
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'import:', error);
    throw error;
  }
};

// Fonction modifiée pour l'upload des fichiers
const uploadFiles = async () => {
  if (files.value.length === 0) {
    uploadMessage.value = 'Veuillez sélectionner au moins un fichier';
    return;
  }

  isUploading.value = true;
  uploadMessage.value = '';

  try {
    const credentials = getCredentials();
    if (!credentials?.token || !credentials?.user?.id) {
      throw new Error('Utilisateur non connecté');
    }

    const uploadPromises = files.value.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('credentials[user][id]', credentials.user.id);
      formData.append('credentials[token]', credentials.token);

      // Upload du fichier
      const uploadResponse = await fetch('import/uploadFile', formData);
      
      if (!uploadResponse?.success) {
        throw new Error(uploadResponse?.message || `Échec de l'upload pour ${file.name}`);
      }

      // Sauvegarde de l'import avec les informations du type de fichier
      const importRecord = await saveImport(file, uploadResponse.file_path, uploadResponse);
      
      if (!importRecord) {
        throw new Error(`Échec de la sauvegarde pour ${file.name}`);
      }

      return importRecord;
    });

    const results = await Promise.all(uploadPromises);
    uploadMessage.value = `${results.length} fichier(s) importé(s) avec succès !`;
    files.value = [];
    if (fileInput.value) fileInput.value.value = '';
    
    await loadImports();

  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
    uploadMessage.value = error.message || 'Erreur lors de l\'importation';
  } finally {
    isUploading.value = false;
  }
};

// Nouvelle fonction pour afficher le contenu d'un fichier
const viewFileContent = async (importItem) => {
  isLoadingContent.value = true;
  try {
    const credentials = getCredentials();
    const response = await fetch('import/getFileContent', {
      import_id: importItem.id,
      credentials
    });
    
    if (response.success) {
      currentFile.value = response.data;
      fileContent.value = response.data.content;
      showFileModal.value = true;
    } else {
      alert('Erreur lors du chargement du fichier: ' + response.message);
    }
  } catch (error) {
    console.error('Erreur lors du chargement du contenu:', error);
    alert('Erreur lors du chargement du fichier');
  } finally {
    isLoadingContent.value = false;
  }
};

const closeFileModal = () => {
  showFileModal.value = false;
  currentFile.value = null;
  fileContent.value = '';
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]);
};



const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('fr-FR');
};
</script>

<template>
  <AppLayout title="Import / Export" data-testid="import_view">
    <MainContainer class="py-5 border-b border-default-background-separator flex justify-between items-center">
      <div class="flex items-center space-x-6">
        <PageTitle :icon="ArrowsRightLeftIcon" title="Importation de fichiers"></PageTitle>
      </div>
    </MainContainer>

    <MainContainer class="py-6">
      <div class="import-container">
        <!-- Zone de sélection des fichiers -->
        <div class="file-selection">
          <h2 class="section-title">Sélectionner les fichiers à importer</h2>
          
          <div class="upload-zone" @click="triggerFileInput">
            <input 
              type="file" 
              ref="fileInput" 
              @change="handleFileSelect" 
              multiple 
              accept=".ical,.ics,.csv,.json,.xml,.pdf,.doc,.docx,.xls,.xlsx"
              class="hidden"
            />
            <div class="upload-content">
              <div class="upload-icon">📁</div>
              <p class="upload-text">Cliquez pour sélectionner des fichiers</p>
              <p class="upload-subtext">Formats supportés: iCal (.ics), CSV, JSON, XML, PDF, DOC, XLS</p>
            </div>
          </div>
        </div>

        <!-- Liste des fichiers sélectionnés -->
        <div v-if="files.length > 0" class="selected-files">
          <h3 class="files-title">Fichiers sélectionnés ({{ files.length }})</h3>
          
          <div class="files-list">
            <div v-for="(file, index) in files" :key="index" class="file-item">
              <div class="file-info">
                <span class="file-icon">{{ getFileIcon(file.type) }}</span>
                <div class="file-details">
                  <div class="file-name">{{ file.name }}</div>
                  <div class="file-size">{{ formatFileSize(file.size) }}</div>
                </div>
              </div>
              <button @click="removeFile(index)" class="remove-btn">×</button>
            </div>
          </div>

          <!-- Actions -->
          <div class="actions">
            <button @click="files = []; fileInput.value = ''" class="btn-secondary">
              Tout effacer
            </button>
            <button @click="uploadFiles" :disabled="isUploading" class="btn-primary">
              {{ isUploading ? 'Importation...' : 'Importer les fichiers' }}
            </button>
          </div>
        </div>

        <!-- Message de statut -->
        <div v-if="uploadMessage" class="status-message" :class="{ 'success': uploadMessage.includes('succès'), 'error': uploadMessage.includes('Erreur') }">
          {{ uploadMessage }}
        </div>

        <!-- Historique des imports -->
        <div class="imports-history">
          <h2 class="section-title">Historique des imports</h2>
          
          <div v-if="isLoading" class="loading-message">
            Chargement des imports...
          </div>
          
          <div v-else-if="imports.length === 0" class="no-imports">
            Aucun import trouvé
          </div>
          
          <div v-else class="imports-list">
            <div v-for="importItem in imports" :key="importItem.id" class="import-item">
              <div class="import-info" @click="viewFileContent(importItem)" style="cursor: pointer;">
                <span class="file-icon">{{ getFileIcon(importItem.file_type) }}</span>
                <div class="import-details">
                  <div class="import-name">{{ importItem.file_name }}</div>
                  <div class="import-meta">
                    Type: {{ importItem.import_type ? importItem.import_type.toUpperCase() : 'AUTRE' }} • 
                    {{ formatDate(importItem.created_at) }}
                  </div>
                </div>
              </div>
              <div class="import-actions">
                <button 
                  @click="viewFileContent(importItem)" 
                  :disabled="isLoadingContent"
                  class="view-btn"
                  title="Voir le contenu"
                >
                  <EyeIcon class="w-4 h-4" />
                </button>
                <div class="import-status">
                  <span class="status-badge" :class="importItem.errors ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'">
                    {{ importItem.errors ? 'Échec' : 'Terminé' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainContainer>

    <!-- Modal pour afficher le contenu du fichier -->
    <div v-if="showFileModal" class="modal-overlay" @click="closeFileModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="modal-title">
            <span class="file-icon">{{ getFileIcon(currentFile?.file_type) }}</span>
            <div>
              <h3>{{ currentFile?.file_name }}</h3>
              <p class="modal-subtitle">
                {{ currentFile?.file_type?.toUpperCase() }} • 
                {{ formatFileSize(currentFile?.file_size) }}
                <span v-if="currentFile?.lines_count">({{ currentFile.lines_count }} lignes)</span>
              </p>
            </div>
          </div>
          <button @click="closeFileModal" class="close-btn">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
        
        <div class="modal-body">
          <div v-if="isLoadingContent" class="loading-content">
            Chargement du contenu...
          </div>
          <!-- Affichage spécial pour les PDFs -->
          <div v-else-if="currentFile?.is_pdf" class="pdf-container">
            <!-- Dans le template, modifiez l'iframe -->
<iframe 
  v-if="currentFile?.is_pdf && currentFile?.file_url"
  :src="currentFile.file_url"
  class="pdf-viewer"
  title="Aperçu du PDF"
></iframe>
          </div>
          <!-- Affichage pour les autres types de fichiers -->
          <div v-else-if="!currentFile?.can_display" class="display-message">
            {{ currentFile?.display_message }}
          </div>
          <pre v-else class="file-content" :data-type="currentFile?.file_type">{{ fileContent }}</pre>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
:root {
  --text-primary: #374151;
  --text-secondary: #6b7280;
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --border-color: #e5e7eb;
  --border-hover: #6366f1;
  --bg-hover: #f0f0ff;
  --btn-primary: #6366f1;
  --btn-primary-hover: #4f46e5;
  --btn-secondary-bg: #ffffff;
  --btn-secondary-border: #d1d5db;
  --btn-secondary-hover: #f9fafb;
  --success-bg: #dcfce7;
  --success-text: #166534;
  --success-border: #bbf7d0;
  --error-bg: #fef2f2;
  --error-text: #dc2626;
  --error-border: #fecaca;
  --remove-btn: #ef4444;
  --remove-btn-hover: #fee2e2;
  --status-pending: #92400e;
  --status-pending-bg: #fef3c7;
  --status-processing: #1e40af;
  --status-processing-bg: #dbeafe;
  --status-completed: #166534;
  --status-completed-bg: #dcfce7;
  --status-failed: #dc2626;
  --status-failed-bg: #fee2e2;
}

@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: #e5e7eb;
    --text-secondary: #9ca3af;
    --bg-primary: #1f2937;
    --bg-secondary: #111827;
    --border-color: #374151;
    --border-hover: #818cf8;
    --bg-hover: #1e1b4b;
    --btn-primary: #818cf8;
    --btn-primary-hover: #6366f1;
    --btn-secondary-bg: #1f2937;
    --btn-secondary-border: #4b5563;
    --btn-secondary-hover: #1e293b;
    --success-bg: #064e3b;
    --success-text: #6ee7b7;
    --success-border: #059669;
    --error-bg: #7f1d1d;
    --error-text: #fca5a5;
    --error-border: #ef4444;
    --remove-btn: #f87171;
    --remove-btn-hover: #7f1d1d;
    --status-pending: #f59e0b;
    --status-pending-bg: #92400e;
    --status-processing: #60a5fa;
    --status-processing-bg: #1e40af;
    --status-completed: #6ee7b7;
    --status-completed-bg: #064e3b;
    --status-failed: #fca5a5;
    --status-failed-bg: #7f1d1d;
  }
}

.import-container {
  max-width: 800px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.file-selection {
  margin-bottom: 2rem;
}

.upload-zone {
  border: 2px dashed var(--border-color);
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: var(--bg-secondary);
}

.upload-zone:hover {
  border-color: var(--border-hover);
  background-color: var(--bg-hover);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.upload-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
}

.upload-subtext {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
}

.selected-files {
  margin-top: 2rem;
}

.files-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.files-list {
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-primary);
  max-height: 300px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.file-item:last-child {
  border-bottom: none;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.file-icon {
  font-size: 1.5rem;
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.file-name {
  font-weight: 500;
  color: var(--text-primary);
}

.file-size {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.remove-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--remove-btn);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease;
}

.remove-btn:hover {
  background-color: var(--remove-btn-hover);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-primary {
  background-color: var(--btn-primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--btn-primary-hover);
}

.btn-primary:disabled {
  background-color: var(--text-secondary);
  cursor: not-allowed;
}

.btn-secondary {
  background-color: var(--btn-secondary-bg);
  color: var(--text-primary);
  border: 1px solid var(--btn-secondary-border);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: var(--btn-secondary-hover);
  border-color: var(--text-secondary);
}

.status-message {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
}

.status-message.success {
  background-color: var(--success-bg);
  color: var(--success-text);
  border: 1px solid var(--success-border);
}

.status-message.error {
  background-color: var(--error-bg);
  color: var(--error-text);
  border: 1px solid var(--error-border);
}

.imports-history {
  margin-top: 3rem;
}

.loading-message, .no-imports {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
  font-style: italic;
}

.imports-list {
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-primary);
  max-height: 400px;
  overflow-y: auto;
}

.import-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s ease;
}

.import-item:hover {
  background-color: var(--bg-secondary);
}

.import-item:last-child {
  border-bottom: none;
}

.import-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.import-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.import-name {
  font-weight: 500;
  color: var(--text-primary);
}

.import-meta {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.import-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.view-btn {
  background: none;
  border: 1px solid var(--border-color);
  padding: 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.view-btn:hover:not(:disabled) {
  background-color: var(--bg-secondary);
  border-color: var(--btn-primary);
  color: var(--btn-primary);
}

.view-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.import-status {
  flex-shrink: 0;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.text-red-600 {
  color: var(--error-text);
}

.bg-red-100 {
  background-color: var(--error-bg);
}

.text-green-600 {
  color: var(--success-text);
}

.bg-green-100 {
  background-color: var(--success-bg);
}

/* Styles pour la modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background-color: var(--bg-primary);
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 90vw;
  max-width: 1000px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-title h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.modal-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.loading-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--text-secondary);
  font-style: italic;
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

.hidden {
  display: none;
}

/* Responsive design */
@media (max-width: 768px) {
  .modal-content {
    width: 95vw;
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 1rem;
  }
  
  .file-content {
    padding: 1rem;
    font-size: 0.75rem;
  }
  
  .import-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .import-actions {
    align-self: flex-end;
  }
}

/* Amélioration de l'affichage pour différents types de fichiers */
.file-content[data-type="json"] {
  background-color: #1e1e1e;
  color: #d4d4d4;
}

.file-content[data-type="csv"] {
  font-family: 'Consolas', 'Monaco', monospace;
  background-color: #f8f9fa;
}

.file-content[data-type="xml"] {
  background-color: #fff8dc;
}

@media (prefers-color-scheme: dark) {
  .file-content[data-type="csv"] {
    background-color: #2d3748;
    color: #e2e8f0;
  }
  
  .file-content[data-type="xml"] {
    background-color: #2a2a0e;
    color: #f7fafc;
  }
}
.pdf-container {
  flex: 1;
  display: flex;
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

/* Responsive pour les PDFs */
@media (max-width: 768px) {
  .pdf-container {
    min-height: 400px;
  }
  
  .pdf-viewer {
    min-height: 400px;
  }
}

</style>