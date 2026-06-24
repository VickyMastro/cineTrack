import { defineStore } from 'pinia'

const BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/auth/v1`
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
  }),
  actions: {
    async restoreSession() {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) return

      const res = await authFetch('/token?grant_type=refresh_token', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      const data = await res.json()
      if (data.access_token) {
        this.accessToken = data.access_token
        this.user = {
          id: data.user.id,
          email: data.user.email,
          username: data.user.user_metadata.username,
        }
        localStorage.setItem('refresh_token', data.refresh_token)
        localStorage.setItem('user', JSON.stringify(this.user))
      }

      this.sessionRestored = true
    },

    async registerUser(username, email, password) {
      const res = await authFetch('/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, data: { username } }),
      })
      const data = await res.json()

      this.user = {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata.username,
      }
      this.accessToken = data.access_token
      localStorage.setItem('refresh_token', data.refresh_token)
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    async login(email, password) {
      const res = await authFetch('/token?grant_type=password', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      this.user = {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata.username,
      }
      this.accessToken = data.access_token
      localStorage.setItem('refresh_token', data.refresh_token)
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    async logout() {
      const res = await authFetch('/logout', { method: 'POST' }, this.accessToken)

      this.user = { username: '' }
      this.accessToken = null
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    },
  },
})
