import { useNotificationsStore } from '@/store/notification';
import { getCredentials, isAuthenticated, useAuth } from '@/stores/auth.js';

export { getCredentials };

export const fetch = async (endpoint, variables = {}, onSuccess = () => {}, successMessage, errorMessage) => {
  try {
    // Gestion spéciale pour l'endpoint middleware
    if (endpoint === 'connection/middleware') {
      const { initAuth } = useAuth();
      await initAuth();
      
      if (isAuthenticated()) {
        const credentials = getCredentials();
        const result = { 
          success: true, 
          user: credentials?.user || null 
        };
        onSuccess(result);
        if (successMessage) useNotificationsStore().addNotification('success', successMessage);
        return result;
      } else {
        throw new Error('Non authentifié');
      }
    }

    // Pour les autres endpoints, log d'avertissement
    console.warn(`⚠️ Endpoint non migré vers Supabase: ${endpoint}`);
    console.log('Variables:', variables);
    
    // Retourner une réponse d'erreur douce pour éviter les crashes
    const errorResult = { 
      success: false, 
      error: `Endpoint ${endpoint} non encore migré vers Supabase` 
    };
    
    if (errorMessage) {
      useNotificationsStore().addNotification('error', errorMessage);
    }
    
    return errorResult;
    
  } catch (error) {
    console.error('Erreur dans fetch:', error);
    if (errorMessage) {
      useNotificationsStore().addNotification('error', errorMessage);
    }
    return { 
      success: false, 
      error: error.message || 'Erreur inconnue' 
    };
  }
};

export const fetchPython = async (endpoint, variables = {}) => {
  console.warn(`⚠️ fetchPython non disponible: ${endpoint}`);
  return { 
    success: false, 
    error: 'API Python non configurée avec Supabase' 
  };
};
