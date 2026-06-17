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
    user: {
      username: '',
    },
    accessToken: null,
  }),
  actions: {
    async registerUser(username, email, password) {
      const res = await authFetch('/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, data: { username } }),
      })
      const data = await res.json()

      /* Borrar xd */
      console.log(data)

      this.user = {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata.username,
      }
      this.accessToken = data.access_token
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
    },
  },
})
