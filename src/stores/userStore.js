import { defineStore } from 'pinia'

const BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/auth/v1`
const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

function authFetch(path, options = {}, accessToken = null) {
  const headers = {
    'Content-Type': 'application/json',
    apikey: ANON_KEY,
  }
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || { username: '' },
    accessToken: null,
    sessionRestored: false,
    recoverySession: false,
  }),
  actions: {
    async restoreSession() {
      if (this.sessionRestored) return

      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        this.sessionRestored = true
        return
      }

      const res = await authFetch('/token?grant_type=refresh_token', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      const data = await res.json()
      if (data.access_token) {
        this.$patch({
          accessToken: data.access_token,
          sessionRestored: true,
          user: {
            id: data.user.id,
            email: data.user.email,
            username: data.user.user_metadata.username,
            created: data.user.created_at,
          },
        })
        localStorage.setItem('refresh_token', data.refresh_token)
        localStorage.setItem('user', JSON.stringify(this.user))
        return
      }

      this.sessionRestored = true
    },

    async registerUser(username, email, password) {
      const res = await authFetch('/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, data: { username } }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.error_code === 'user_already_exists' || data.error_code === 'email_exists') {
          throw new Error('Ese email ya está registrado')
        }
        if (data.error_code === 'validation_failed') {
          throw new Error('El email no es válido')
        }
        throw new Error('No se pudo crear la cuenta. Intentá de nuevo')
      }

      this.$patch({
        accessToken: data.access_token,
        sessionRestored: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          username: data.user.user_metadata.username,
          created: data.user.created_at,
        },
      })
      localStorage.setItem('refresh_token', data.refresh_token)
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    async updateUsername(newUsername) {
      const res = await authFetch(
        '/user',
        {
          method: 'PUT',
          body: JSON.stringify({ data: { username: newUsername } }),
        },
        this.accessToken,
      )

      if (!res.ok) {
        throw new Error('No se pudo actualizar el nombre de usuario')
      }

      this.user.username = newUsername
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    async login(email, password) {
      const res = await authFetch('/token?grant_type=password', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.error_code === 'invalid_credentials') {
          throw new Error('Email o contraseña incorrectos')
        }
        throw new Error('No se pudo iniciar sesión. Intentá de nuevo.')
      }

      this.$patch({
        accessToken: data.access_token,
        sessionRestored: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          username: data.user.user_metadata.username,
          created: data.user.created_at,
        },
      })
      localStorage.setItem('refresh_token', data.refresh_token)
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    async recoveryPasswordEmail(email) {
      const redirectTo = `${window.location.origin}/recovery-password`

      const res = await authFetch(`/recover?redirect_to=${encodeURIComponent(redirectTo)}`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        throw new Error('Error al intentar cambiar la contraseña')
      }
    },

    async setNewPassword(newPassword) {
      if (!this.accessToken) {
        throw new Error('El enlace venció o no es válido. Pedí uno nuevo.')
      }

      const res = await authFetch(
        '/user',
        {
          method: 'PUT',
          body: JSON.stringify({ password: newPassword }),
        },
        this.accessToken,
      )
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        if (data.error_code === 'same_password') {
          throw new Error('La nueva contraseña no puede ser igual a la anterior')
        }
        throw new Error('El enlace venció o no es válido. Pedí uno nuevo.')
      }

      this.recoverySession = false
    },

    async applyRecoveryFromUrl() {
      const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : ''
      if (!hash) return false

      const params = new URLSearchParams(hash)
      history.replaceState(null, '', window.location.pathname)

      if (params.get('error') || params.get('error_code')) {
        return false
      }

      const type = params.get('type')
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      if (type !== 'recovery' || !accessToken) {
        return false
      }

      try {
        const res = await authFetch('/user', { method: 'GET' }, accessToken)
        const data = await res.json().catch(() => ({}))
        if (!res.ok) return false

        this.accessToken = accessToken
        this.recoverySession = true
        this.sessionRestored = true
        this.user = {
          id: data.id,
          email: data.email,
          username: data.user_metadata?.username,
          created: data.created_at,
        }
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken)
        }
        localStorage.setItem('user', JSON.stringify(this.user))
        return true
      } catch {
        return false
      }
    },

    async logout() {
      let serverError = false

      try {
        const res = await authFetch('/logout', { method: 'POST' }, this.accessToken)
        if (!res.ok && res.status >= 500) {
          serverError = true
        }
      } catch {
        serverError = true
      }

      this.$patch({
        accessToken: null,
        sessionRestored: true,
        user: { username: '' },
      })
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')

      if (serverError) {
        throw new Error('No se pudo cerrar sesión en el servidor')
      }
    },

    async deleteAccount() {
      const res = await fetch(`${FUNCTIONS_URL}/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: ANON_KEY,
          Authorization: `Bearer ${this.accessToken}`,
        },
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'No se pudo eliminar la cuenta')
      }

      this.$patch({
        accessToken: null,
        sessionRestored: true,
        user: { username: '' },
      })
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    },
  },
})
