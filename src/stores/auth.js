import { ref, reactive } from 'vue'
import { supabase } from '../lib/supabase.js'

// État global de l'authentification
export const authState = reactive({
  user: null,
  session: null,
  loading: false,
  error: null,
  initialized: false
})

// Service d'authentification compatible avec l'ancien système
export const authService = {
  async signUp(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    if (error) throw error
    return { success: true, data }
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return { success: true, data }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  },

  async getCurrentUser() {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user || null
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

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
          firstName: formData.firstName || formData.name,
          lastName: formData.lastName,
          first_name: formData.firstName || formData.name,
          last_name: formData.lastName,
          level: formData.level || formData.concentrationLevel,
          phone: formData.phone,
          location: formData.location
        }
      )
      
      if (result.data.user) {
        authState.user = {
          id: result.data.user.id,
          email: result.data.user.email,
          first_name: result.data.user.user_metadata?.first_name || '',
          last_name: result.data.user.user_metadata?.last_name || '',
          level: result.data.user.user_metadata?.level || ''
        }
      }
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
      
      if (result.data.user) {
        authState.user = {
          id: result.data.user.id,
          email: result.data.user.email,
          first_name: result.data.user.user_metadata?.first_name || '',
          last_name: result.data.user.user_metadata?.last_name || '',
          level: result.data.user.user_metadata?.level || ''
        }
        authState.session = result.data.session
      }
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
      authState.session = null
      // Nettoyer le stockage
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('token')
    } catch (error) {
      authState.error = error.message
    }
  }

  // Initialiser l'état d'authentification
  const initAuth = async () => {
    if (authState.initialized) return
    
    authState.loading = true
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        authState.session = session
        authState.user = {
          id: session.user.id,
          email: session.user.email,
          first_name: session.user.user_metadata?.first_name || session.user.user_metadata?.firstName || '',
          last_name: session.user.user_metadata?.last_name || session.user.user_metadata?.lastName || '',
          level: session.user.user_metadata?.level || ''
        }

        // Stocker pour compatibilité avec l'ancien système
        const userData = authState.user
        const token = session.access_token
        
        // Vérifier si l'utilisateur veut être remembered
        const rememberMe = localStorage.getItem('user') !== null
        
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(userData))
          localStorage.setItem('token', token)
        } else {
          sessionStorage.setItem('user', JSON.stringify(userData))
          sessionStorage.setItem('token', token)
        }
      }
      
      // Écouter les changements
      authService.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          authState.session = session
          authState.user = {
            id: session.user.id,
            email: session.user.email,
            first_name: session.user.user_metadata?.first_name || '',
            last_name: session.user.user_metadata?.last_name || '',
            level: session.user.user_metadata?.level || ''
          }
        } else if (event === 'SIGNED_OUT') {
          authState.session = null
          authState.user = null
        }
      })
      
      authState.initialized = true
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

// Fonctions utilitaires pour compatibilité
export const getCredentials = () => {
  if (authState.session) {
    return {
      token: authState.session.access_token,
      user: authState.user
    }
  }
  // Fallback vers l'ancien système
  let token = sessionStorage.getItem('token') || localStorage.getItem('token')
  let user = sessionStorage.getItem('user') || localStorage.getItem('user')
  if (token && user) {
    return {
      token,
      user: JSON.parse(user)
    }
  }
  return null
}

export const isAuthenticated = () => {
  return !!authState.user && !!authState.session
}

// Auto-initialiser
const { initAuth } = useAuth()
initAuth()
