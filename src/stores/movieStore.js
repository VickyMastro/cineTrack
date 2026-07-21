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
    filters: { type: 'all', genre: 'all', year: 'all' },
    genres: [],
    favoriteIds: new Set(),
    bookmarkIds: new Set(),
    watchedIds: new Set(),
  }),
  actions: {
    clearFilters() {
      this.filters = { type: 'all', genre: 'all', year: 'all' }
    },
    async getMovies() {
      const res = await movieFetch('/content_with_genres', {
        method: 'GET',
      })
      const data = await res.json()

      this.movies = data
    },

    async getGenres() {
      const res = await movieFetch('/genres', {
        method: 'GET',
      })
      const data = await res.json()

      this.genres = data
    },

    async getMoviesByAction() {
      const userStore = useUserStore()
      const uid = userStore.user.id

      const res = await movieFetch(
        `/user_content?user_id=eq.${uid}&select=content_id,action`,
        {
          method: 'GET',
        },
        userStore.accessToken,
      )
      const data = await res.json()

      this.favoriteIds = new Set(
        data.filter((m) => m.action === 'favorite').map((m) => m.content_id),
      )
      this.bookmarkIds = new Set(
        data.filter((m) => m.action === 'bookmark').map((m) => m.content_id),
      )
      this.watchedIds = new Set(data.filter((m) => m.action === 'watched').map((m) => m.content_id))
    },

    async addActionToMovie(contentId, action) {
      const userStore = useUserStore()
      const uid = userStore.user.id

      const res = await movieFetch(
        '/user_content',
        {
          method: 'POST',
          body: JSON.stringify({ user_id: uid, content_id: contentId, action }),
        },
        userStore.accessToken,
      )

      if (action === 'favorite') {
        this.favoriteIds.add(contentId)
      }
      if (action === 'bookmark') {
        this.bookmarkIds.add(contentId)
      }
      if (action === 'watched') {
        this.watchedIds.add(contentId)
      }
    },

    async deleteActionToMovie(contentId, action) {
      const userStore = useUserStore()
      const uid = userStore.user.id

      const res = await movieFetch(
        `/user_content?user_id=eq.${uid}&content_id=eq.${contentId}&action=eq.${action}`,
        {
          method: 'DELETE',
        },
        userStore.accessToken,
      )

      if (action === 'favorite') {
        this.favoriteIds.delete(contentId)
      }
      if (action === 'bookmark') {
        this.bookmarkIds.delete(contentId)
      }
      if (action === 'watched') {
        this.watchedIds.delete(contentId)
      }
    },
  },
  getters: {
    movieList(state) {
      let movies = state.movies
      if (state.filters.type !== 'all') {
        movies = movies.filter((m) => m.type === state.filters.type)
      }
      if (state.filters.genre !== 'all') {
        movies = movies.filter((m) => {
          return m.genres.some((g) => g.id === state.filters.genre)
        })
      }
      if (state.filters.year !== 'all') {
        movies = movies.filter((m) => m.release_date.slice(0, 4) === state.filters.year)
      }
      return movies
    },
  },
})
