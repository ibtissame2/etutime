import { ref, reactive } from 'vue'
import { authService } from '../lib/supabase.js'

// État global de l'authentification
export const authState = reactive({
  user: null,
  loading: false,
  error: null
})

// Actions d'authentification
export const useAuth = () => {
  
  // Inscription
  const signUp = async (formData) => {
    authState.loading = true
    authState.error = null
    
    try {
      const result = await authService.signUp(
        formData.email,
        formData.password,
        {
          name: formData.name,
          concentrationLevel: formData.concentrationLevel,
          phone: formData.phone,
          location: formData.location
        }
      )
      
      authState.user = result.data.user
      return result
    } catch (error) {
      authState.error = error.message
      throw error
    } finally {
      authState.loading = false
    }
  }

  // Connexion
  const signIn = async (email, password) => {
    authState.loading = true
    authState.error = null
    
    try {
      const result = await authService.signIn(email, password)
      authState.user = result.data.user
      return result
    } catch (error) {
      authState.error = error.message
      throw error
    } finally {
      authState.loading = false
    }
  }

  // Déconnexion
  const signOut = async () => {
    try {
      await authService.signOut()
      authState.user = null
    } catch (error) {
      authState.error = error.message
    }
  }

  // Initialiser l'état d'authentification
  const initAuth = async () => {
    authState.loading = true
    try {
      const user = await authService.getCurrentUser()
      authState.user = user
      
      // Écouter les changements
      authService.onAuthStateChange((event, session) => {
        authState.user = session?.user || null
      })
    } catch (error) {
      console.error('Erreur initialisation auth:', error)
    } finally {
      authState.loading = false
    }
  }

  return {
    // État
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    
    // Actions
    signUp,
    signIn,
    signOut,
    initAuth
  }
}
