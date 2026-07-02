import { defineStore } from 'pinia'

const BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1`
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const useMovieStore = defineStore('movie', {
  state: () => ({
    movies: [],
  }),
  actions: {
    async getMovies() {
      const res = await fetch(`${BASE_URL}/content_with_genres`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          apikey: ANON_KEY,
        },
      })
      const data = await res.json()

      this.movies = data
    },
  },
})
