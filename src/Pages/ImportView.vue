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
			credentials,
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
		ical: 'ical',
		ics: 'ical',
		csv: 'csv',
		json: 'json',
		xml: 'xml',
		pdf: 'pdf',
		doc: 'document',
		docx: 'document',
		xls: 'spreadsheet',
		xlsx: 'spreadsheet',
		txt: 'text',
		md: 'markdown',
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
			pdf: 'pdf',
			doc: 'document',
			docx: 'document',
			xls: 'spreadsheet',
			xlsx: 'spreadsheet',
			csv: 'spreadsheet',
			json: 'json',
			xml: 'xml',
			ical: 'calendar',
			ics: 'calendar',
			txt: 'text',
			md: 'text',
		};
		fileType = typeMapping[type.toLowerCase()] || type;
	}

	const iconMapping = {
		pdf: '📄',
		document: '📝',
		spreadsheet: '📊',
		excel: '📊',
		csv: '📊',
		json: '📋',
		xml: '🗂️',
		calendar: '📅',
		ical: '📅',
		text: '📄',
		markdown: '📄',
		image: '🖼️',
	};

	return iconMapping[fileType] || '📁';
};

// Helper function to categorize import types
const getImportCategory = (fileType) => {
	const categoryMapping = {
		ical: 'schedule',
		ics: 'schedule',
		csv: 'tasks',
		json: 'modules',
		xml: 'other',
		pdf: 'notes',
		doc: 'notes',
		docx: 'notes',
		xls: 'tasks',
		xlsx: 'tasks',
		txt: 'notes',
		md: 'notes',
	};

	return categoryMapping[fileType] || 'other';
};

// Helper function to estimate items in file
const estimateItemsFromFile = (file, uploadResponse) => {
	if (uploadResponse.line_count) {
		return Math.max(1, uploadResponse.line_count - 1); // Subtract header row
	}

	// Rough estimation based on file size and type
	const extension = file.name.split('.').pop().toLowerCase();

	switch (extension) {
		case 'csv':
			return Math.floor(file.size / 100); // Rough estimate: 100 bytes per row
		case 'json':
			return Math.floor(file.size / 200); // JSON is more verbose
		case 'ical':
		case 'ics':
			return Math.floor(file.size / 150); // Calendar events
		default:
			return Math.max(1, Math.floor(file.size / 1000)); // Very rough estimate
	}
};

// Enhanced network error handler
const handleNetworkError = (error) => {
	console.error('Erreur réseau détaillée:', error);

	if (error.name === 'AbortError') {
		return "Opération annulée par l'utilisateur.";
	}

	if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
		return 'Erreur de connexion. Vérifiez votre connexion internet et que le serveur est accessible.';
	}

	if (error.message.includes('timeout') || error.name === 'TimeoutError') {
		return "Délai d'attente dépassé. Le serveur met trop de temps à répondre. Essayez avec un fichier plus petit.";
	}

	if (error.message.includes('413')) {
		return 'Fichier trop volumineux pour le serveur.';
	}

	if (error.message.includes('500')) {
		return 'Erreur interne du serveur. Veuillez réessayer plus tard.';
	}

	return error.message || 'Erreur réseau inconnue. Veuillez réessayer.';
};

// Enhanced credential validation helper
const validateCredentials = (credentials) => {
	if (!credentials) {
		return { valid: false, error: "Aucune donnée d'authentification" };
	}

	if (!credentials.token) {
		return { valid: false, error: "Token d'authentification manquant" };
	}

	if (!credentials.user?.id) {
		return { valid: false, error: 'ID utilisateur manquant' };
	}

	// Additional validation could include token expiry check
	try {
		// If token is JWT, you could decode and check expiry
		// const tokenPayload = JSON.parse(atob(credentials.token.split('.')[1]));
		// if (tokenPayload.exp && Date.now() >= tokenPayload.exp * 1000) {
		//   return { valid: false, error: 'Token expiré' };
		// }
	} catch (e) {
		// Token validation failed, but continue for now
		console.warn('Validation du token échouée:', e);
	}

	return { valid: true };
};

// Enhanced saveImport function with better validation
const saveImport = async (file, filePath, uploadResponse) => {
	try {
		const credentials = getCredentials();

		if (!credentials?.token || !credentials?.user?.id) {
			throw new Error('Credentials manquants pour la sauvegarde');
		}

		// Enhanced type detection
		const detectedType = uploadResponse.file_type || getImportType(file.name);
		const importType = getImportCategory(detectedType);

		// Calculate estimated processing info
		const estimatedItems = uploadResponse.estimated_items || estimateItemsFromFile(file, uploadResponse);
		const estimatedPages = uploadResponse.pages || Math.max(1, Math.floor(file.size / 1000));

		const importData = {
			file_name: file.name,
			file_path: filePath,
			file_type: detectedType,
			import_type: importType,
			status: 'completed',
			processed_items: uploadResponse.processed_items || 0,
			total_items: estimatedItems,
			title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
			pages: estimatedPages,
			date: new Date().toISOString().split('T')[0],
			file_size: file.size,
			mime_type: file.type,
			upload_info: {
				original_name: file.name,
				upload_date: new Date().toISOString(),
				user_agent: navigator.userAgent,
				file_hash: uploadResponse.file_hash || null,
			},
			credentials,
		};

		console.log('Données de sauvegarde import:', importData);

		const response = await fetch('import/saveImport', importData);

		console.log('Réponse sauvegarde:', response);

		if (!response?.success) {
			throw new Error(response?.message || "Erreur lors de la sauvegarde de l'import");
		}

		return response.data;
	} catch (error) {
		console.error("Erreur lors de la sauvegarde de l'import:", error);
		throw error;
	}
};

// Enhanced upload function with better error handling and progress tracking
const uploadFiles = async () => {
	if (files.value.length === 0) {
		uploadMessage.value = 'Veuillez sélectionner au moins un fichier';
		return;
	}

	isUploading.value = true;
	uploadMessage.value = '';

	try {
		const credentials = getCredentials();

		// Enhanced credential validation
		if (!credentials) {
			throw new Error("Aucune donnée d'authentification trouvée. Veuillez vous reconnecter.");
		}

		if (!credentials.token) {
			throw new Error("Token d'authentification manquant. Veuillez vous reconnecter.");
		}

		if (!credentials.user?.id) {
			throw new Error('Informations utilisateur manquantes. Veuillez vous reconnecter.');
		}

		console.log("Début de l'upload de", files.value.length, 'fichier(s)');

		// Sequential upload with better progress tracking
		const results = [];
		let uploadedCount = 0;
		let failedCount = 0;
		const errors = [];

		for (let i = 0; i < files.value.length; i++) {
			const file = files.value[i];

			try {
				console.log(`Upload du fichier ${i + 1}/${files.value.length}: ${file.name} (${formatFileSize(file.size)})`);

				// Enhanced file validation
				if (file.size === 0) {
					throw new Error(`Le fichier "${file.name}" est vide`);
				}

				if (file.size > 10 * 1024 * 1024) {
					// 10MB
					throw new Error(`Le fichier "${file.name}" est trop volumineux (max 10MB)`);
				}

				// Check file type based on extension
				const allowedExtensions = [
					'ical',
					'ics',
					'csv',
					'json',
					'xml',
					'pdf',
					'doc',
					'docx',
					'xls',
					'xlsx',
					'txt',
					'md',
				];
				const fileExtension = file.name.split('.').pop().toLowerCase();
				if (!allowedExtensions.includes(fileExtension)) {
					throw new Error(`Type de fichier non supporté: ${fileExtension}`);
				}

				const formData = new FormData();
				formData.append('file', file);

				// Enhanced credentials handling
				formData.append('credentials[user][id]', credentials.user.id.toString());
				formData.append('credentials[token]', credentials.token);

				// Add additional user info if available
				if (credentials.user.email) {
					formData.append('credentials[user][email]', credentials.user.email);
				}
				if (credentials.user.first_name) {
					formData.append('credentials[user][first_name]', credentials.user.first_name);
				}

				// Update progress message
				uploadMessage.value = `Upload en cours: ${file.name} (${i + 1}/${files.value.length})`;

				// Upload with enhanced timeout and retry logic
				let uploadResponse;
				let retryCount = 0;
				const maxRetries = 2;

				while (retryCount <= maxRetries) {
					try {
						uploadResponse = await fetch(
							'import/uploadFile',
							formData,
							(data) => data, // onSuccess callback - just return the data
							null, // successMessage
							null // onError
						);
						break; // Success, exit retry loop
					} catch (fetchError) {
						retryCount++;
						if (retryCount > maxRetries) {
							throw fetchError;
						}
						console.log(`Tentative ${retryCount}/${maxRetries} échouée pour ${file.name}, nouvelle tentative...`);
						await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount)); // Progressive delay
					}
				}

				console.log('Réponse upload:', uploadResponse);

				if (!uploadResponse) {
					throw new Error(`Aucune réponse du serveur pour ${file.name}`);
				}

				if (!uploadResponse.success) {
					// Enhanced error handling based on error codes
					if (uploadResponse.error_code === 401) {
						throw new Error('Session expirée. Veuillez vous reconnecter.');
					} else if (uploadResponse.error_code === 413) {
						throw new Error(`Fichier trop volumineux: ${file.name}`);
					} else if (uploadResponse.error_code === 415) {
						throw new Error(`Type de fichier non supporté: ${file.name}`);
					} else if (uploadResponse.error_code === 422) {
						throw new Error(`Données invalides pour: ${file.name}`);
					} else if (uploadResponse.error_code >= 500) {
						throw new Error(`Erreur serveur pour: ${file.name}. Veuillez réessayer.`);
					}

					throw new Error(uploadResponse.message || `Échec de l'upload pour ${file.name}`);
				}

				console.log(`Upload réussi pour ${file.name}`);

				// Enhanced import saving with validation
				try {
					const importRecord = await saveImport(file, uploadResponse.file_path, uploadResponse);

					if (!importRecord) {
						throw new Error(`Échec de la sauvegarde pour ${file.name}`);
					}

					results.push(importRecord);
					uploadedCount++;

					console.log(`Import sauvegardé pour ${file.name}:`, importRecord);

					// Update progress
					uploadMessage.value = `Traitement terminé: ${file.name} (${uploadedCount}/${files.value.length} réussis)`;
				} catch (saveError) {
					console.error('Erreur lors de la sauvegarde:', saveError);
					failedCount++;
					errors.push(`${file.name}: ${saveError.message}`);

					// Even if save fails, we might want to continue with other files
					// depending on business logic
					uploadMessage.value = `Fichier uploadé mais erreur de sauvegarde pour ${file.name}`;
				}
			} catch (fileError) {
				console.error(`Erreur pour le fichier ${file.name}:`, fileError);
				failedCount++;
				errors.push(`${file.name}: ${fileError.message}`);

				// Check if it's an authentication error that should stop the process
				if (
					fileError.message.includes('Session expirée') ||
					fileError.message.includes('reconnecter') ||
					fileError.message.includes('authentification')
				) {
					throw fileError; // Stop the entire process
				}

				// For other errors, continue with next file after a short pause
				uploadMessage.value = `Erreur pour ${file.name}: ${fileError.message}`;
				await new Promise((resolve) => setTimeout(resolve, 500));
			}
		}

		// Enhanced final status messages
		if (uploadedCount === files.value.length) {
			uploadMessage.value = `✅ ${uploadedCount} fichier(s) importé(s) avec succès !`;
		} else if (uploadedCount > 0 && failedCount > 0) {
			uploadMessage.value = `⚠️ ${uploadedCount}/${files.value.length} fichier(s) importé(s). ${failedCount} ont échoué.`;

			// Show detailed errors in console or could be displayed in UI
			if (errors.length > 0) {
				console.error('Détails des erreurs:', errors);
				// Optionally show errors to user:
				// uploadMessage.value += '\nErreurs: ' + errors.slice(0, 3).join(', ') + (errors.length > 3 ? '...' : '');
			}
		} else if (failedCount === files.value.length) {
			uploadMessage.value = `❌ Aucun fichier n'a pu être importé. Vérifiez les logs pour plus de détails.`;
		} else {
			uploadMessage.value = 'Importation terminée avec des résultats mixtes.';
		}

		// Clean up
		files.value = [];
		if (fileInput.value) fileInput.value.value = '';

		// Reload imports list to show new uploads
		await loadImports();
	} catch (error) {
		console.error("Erreur critique lors de l'importation:", error);

		// Enhanced authentication error handling
		if (
			error.message.includes('Session expirée') ||
			error.message.includes('reconnecter') ||
			error.message.includes('authentification') ||
			error.message.includes('Token')
		) {
			uploadMessage.value = '🔐 Session expirée. Redirection vers la page de connexion...';

			// Clear potentially invalid credentials
			if (typeof localStorage !== 'undefined') {
				localStorage.removeItem('user_credentials');
				localStorage.removeItem('auth_token');
			}

			// Redirect after showing message
			setTimeout(() => {
				window.location.href = '/login';
			}, 2000);
		} else if (error.message.includes('Network') || error.message.includes('fetch')) {
			uploadMessage.value = '🌐 Erreur de connexion. Vérifiez votre connexion internet et réessayez.';
		} else {
			uploadMessage.value = `❌ ${error.message || "Erreur inattendue lors de l'importation"}`;
		}
	} finally {
		isUploading.value = false;
	}
};

// Helper function to format file size
const formatFileSize = (bytes) => {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to format date
const formatDate = (dateString) => {
	if (!dateString) return 'Date inconnue';
	const date = new Date(dateString);
	return date.toLocaleDateString('fr-FR', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

// Replace your viewFileContent function with this corrected version:

const viewFileContent = async (importItem) => {
	if (isLoadingContent.value) return;

	currentFile.value = importItem;
	showFileModal.value = true;
	isLoadingContent.value = true;
	fileContent.value = '';

	try {
		const credentials = getCredentials();

		if (!credentials?.token || !credentials?.user?.id) {
			throw new Error('Credentials manquants pour la visualisation');
		}

		console.log('viewFileContent called with importItem:', importItem);
		console.log('importItem.id:', importItem.id);

		const requestData = {
			import_id: importItem.id,
			credentials,
		};

		console.log('Request data:', requestData);

		// Use the fetch utility correctly
		const response = await fetch(
			'import/getFileContent',
			requestData,
			(data) => {
				console.log('Success response:', data);
				return data;
			},
			null, // successMessage - set to null to avoid showing notification
			(error) => {
				console.error('Error in onError callback:', error);
				throw new Error(`Failed to load file: ${error}`);
			}
		);

		console.log('Final response:', response);

		// Handle the response
		if (response && response.success) {
			const responseData = response.data || response;

			if (responseData.is_pdf) {
				currentFile.value = {
					...importItem,
					is_pdf: true,
					file_url: responseData.file_url || getPdfUrl(importItem),
					can_display: true,
				};
			} else if (responseData.can_display) {
				fileContent.value = responseData.content || 'Contenu non disponible';
				currentFile.value = {
					...importItem,
					is_pdf: false,
					can_display: true,
					lines_count: responseData.lines_count,
				};
			} else {
				fileContent.value = responseData.display_message || 'Impossible de charger le contenu de ce fichier.';
				currentFile.value = {
					...importItem,
					is_pdf: false,
					can_display: false,
					display_message: responseData.display_message || 'Impossible de charger le contenu de ce fichier.',
				};
			}
		} else {
			const errorMessage = response?.message || 'Erreur inconnue';
			fileContent.value = 'Erreur lors du chargement du contenu: ' + errorMessage;
			currentFile.value = {
				...importItem,
				can_display: false,
				display_message: 'Impossible de charger le contenu de ce fichier.',
			};
		}
	} catch (error) {
		console.error('Erreur lors du chargement du contenu:', error);
		let errorMessage = 'Erreur de connexion lors du chargement du contenu.';

		if (error.message?.includes('CORS')) {
			errorMessage = 'Erreur CORS: Le serveur doit être configuré pour permettre les requêtes cross-origin.';
		} else if (error.message?.includes('Network Error')) {
			errorMessage = 'Erreur réseau: Vérifiez que le serveur backend est accessible.';
		} else if (error.message?.includes('Credentials manquants')) {
			errorMessage = 'Session expirée. Veuillez vous reconnecter.';
		} else if (error.message) {
			errorMessage = error.message;
		}

		fileContent.value = errorMessage;
		currentFile.value = {
			...importItem,
			can_display: false,
			display_message: errorMessage,
		};
	} finally {
		isLoadingContent.value = false;
	}
};
// Function to close file modal
const closeFileModal = () => {
	showFileModal.value = false;
	currentFile.value = null;
	fileContent.value = '';
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
						<button
							@click="
								files = [];
								fileInput.value = '';
							"
							class="btn-secondary"
						>
							Tout effacer
						</button>
						<button @click="uploadFiles" :disabled="isUploading" class="btn-primary">
							{{ isUploading ? 'Importation...' : 'Importer les fichiers' }}
						</button>
					</div>
				</div>

				<!-- Message de statut -->
				<div
					v-if="uploadMessage"
					class="status-message"
					:class="{ success: uploadMessage.includes('succès'), error: uploadMessage.includes('Erreur') }"
				>
					{{ uploadMessage }}
				</div>

				<!-- Historique des imports -->
				<div class="imports-history">
					<h2 class="section-title">Historique des imports</h2>

					<div v-if="isLoading" class="loading-message">Chargement des imports...</div>

					<div v-else-if="imports.length === 0" class="no-imports">Aucun import trouvé</div>

					<div v-else class="imports-list">
						<div v-for="importItem in imports" :key="importItem.id" class="import-item">
							<div class="import-info" @click="viewFileContent(importItem)" style="cursor: pointer">
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
									<span
										class="status-badge"
										:class="importItem.errors ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'"
									>
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
					<div v-if="isLoadingContent" class="loading-content">Chargement du contenu...</div>
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

.loading-message,
.no-imports {
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
.file-content[data-type='json'] {
	background-color: #1e1e1e;
	color: #d4d4d4;
}

.file-content[data-type='csv'] {
	font-family: 'Consolas', 'Monaco', monospace;
	background-color: #f8f9fa;
}

.file-content[data-type='xml'] {
	background-color: #fff8dc;
}

@media (prefers-color-scheme: dark) {
	.file-content[data-type='csv'] {
		background-color: #2d3748;
		color: #e2e8f0;
	}

	.file-content[data-type='xml'] {
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
