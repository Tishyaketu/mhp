// frontend/lib/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string | null;
}

// M1: Search movies
export const searchMovies = async (query: string) => {
  const { data } = await axios.get(`${API_URL}/movies/search`, {
    params: { q: query },
  });
  return data;
};

// M3: Get favorites
export const getFavorites = async (): Promise<Movie[]> => {
  const { data } = await axios.get(`${API_URL}/favorites`);
  return data;
};

// M2: Add to favorites
export const addFavorite = async (movie: Movie) => {
  const { data } = await axios.post(`${API_URL}/favorites`, movie);
  return data;
};

// M2/M3: Remove from favorites
export const removeFavorite = async (imdbID: string) => {
  await axios.delete(`${API_URL}/favorites/${imdbID}`);
};