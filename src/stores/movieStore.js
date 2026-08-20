import { defineStore } from 'pinia'
import { useUserStore } from './userStore'

const BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1`
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

function movieFetch(path, options = {}, accessToken = null) {
  const headers = {
    'Content-Type': 'application/json',
    apikey: ANON_KEY,
    Authorization: `Bearer ${accessToken || ANON_KEY}`,
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
    searchText: '',
    genres: [],
    libraryFilter: 'watched',
    favoriteIds: new Set(),
    bookmarkIds: new Set(),
    watchedIds: new Set(),
  }),
  actions: {
    clearFilters() {
      this.filters = { type: 'all', genre: 'all', year: 'all' }
    },
    clearUserActions() {
      this.favoriteIds = new Set()
      this.bookmarkIds = new Set()
      this.watchedIds = new Set()
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
      const token = userStore.accessToken

      if (!uid || !token) {
        this.clearUserActions()
        return
      }

      const res = await movieFetch(
        `/user_content?user_id=eq.${uid}&select=content_id,action`,
        {
          method: 'GET',
        },
        token,
      )
      const data = await res.json().catch(() => null)

      if (userStore.accessToken !== token) return

      if (!res.ok || !Array.isArray(data)) {
        this.clearUserActions()
        return
      }

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

      if (!res.ok) {
        throw new Error('No se pudo guardar. Intentá de nuevo.')
      }

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

      if (!res.ok) {
        throw new Error('No se pudo eliminar. Intentá de nuevo.')
      }

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
      let searchText = state.searchText.trim().toLowerCase()

      if (state.searchText !== '') {
        movies = movies.filter((m) => m.title.toLowerCase().includes(searchText))
      }
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
    libraryMovieList(state) {
      let movies = state.movies

      if (state.libraryFilter === 'watched') {
        movies = movies.filter((m) => {
          return state.watchedIds.has(m.id)
        })
      }
      if (state.libraryFilter === 'bookmark') {
        movies = movies.filter((m) => {
          return state.bookmarkIds.has(m.id)
        })
      }
      if (state.libraryFilter === 'favorite') {
        movies = movies.filter((m) => {
          return state.favoriteIds.has(m.id)
        })
      }
      return movies
    },
    averageRating(state) {
      const watchedMovies = state.movies.filter((m) => state.watchedIds.has(m.id))

      if (watchedMovies.length === 0) return 0

      const total = watchedMovies.reduce((sum, m) => sum + m.vote_average, 0)
      return Number((total / watchedMovies.length).toFixed(1))
    },
    mediaCounts(state) {
      const watchedMovies = state.movies.filter((m) => state.watchedIds.has(m.id))

      return {
        movies: watchedMovies.filter((m) => m.type === 'movie'),
        series: watchedMovies.filter((m) => m.type === 'serie'),
      }
    },
    favoritesGenres(state) {
      if (!state.favoriteIds.size) return []

      const countsByGenreId = new Map()

      for (const movie of state.movies) {
        if (!state.favoriteIds.has(movie.id)) continue

        for (const genre of movie.genres) {
          const entry = countsByGenreId.get(genre.id)
          if (entry) {
            entry.count++
          } else {
            countsByGenreId.set(genre.id, { id: genre.id, name: genre.name, count: 1 })
          }
        }
      }

      return [...countsByGenreId.values()].sort((a, b) => b.count - a.count)
    },
  },
})
