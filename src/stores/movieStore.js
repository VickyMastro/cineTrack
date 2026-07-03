import { defineStore } from 'pinia'
import { useUserStore } from './userStore'

const BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1`
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

function movieFetch(path, options = {}, accessToken = null) {
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

export const useMovieStore = defineStore('movie', {
  state: () => ({
    movies: [],
    favoriteIds: new Set(),
  }),
  actions: {
    async getMovies() {
      const res = await movieFetch('/content_with_genres', {
        method: 'GET',
      })
      const data = await res.json()

      this.movies = data
    },

    async getFavoritesMovies() {
      const userStore = useUserStore()
      const uid = userStore.user.id

      const res = await movieFetch(
        `/favorites?user_id=eq.${uid}&select=content_id`,
        {
          method: 'GET',
        },
        userStore.accessToken,
      )

      const data = await res.json()

      this.favoriteIds = new Set(data.map((f) => f.content_id))
    },

    async addFavoriteMovie(contentId) {
      const userStore = useUserStore()
      const uid = userStore.user.id

      const res = await movieFetch(
        '/favorites',
        {
          method: 'POST',
          body: JSON.stringify({ user_id: uid, content_id: contentId }),
        },
        userStore.accessToken,
      )
      this.favoriteIds.add(contentId)
    },

    async deleteFavoriteMovie(content_id) {
      const userStore = useUserStore()
      const uid = userStore.user.id

      const res = await movieFetch(
        `/favorites?user_id=eq.${uid}&content_id=eq.${content_id}`,
        {
          method: 'DELETE',
        },
        userStore.accessToken,
      )
      this.favoriteIds.delete(content_id)
    },
  },
})
