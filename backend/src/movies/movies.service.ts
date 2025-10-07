// backend/src/movies/movies.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MoviesService {
  private readonly apiKey = process.env.OMDB_API_KEY || '';
  private readonly baseUrl = process.env.OMDB_BASE_URL || '';

  async searchMovies(query: string, page: number = 1) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          apikey: this.apiKey,
          s: query,
          type: 'movie',
          page: page,
        },
      });

      // M6: Error handling for OMDb API
      if (response.data.Response === 'False') {
        if (response.data.Error === 'Movie not found!') {
          return { movies: [], totalResults: 0, currentPage: page, totalPages: 0 };
        }
        return { movies: [], error: response.data.Error, totalResults: 0, currentPage: page, totalPages: 0 };
      }

      // M1: Return required fields with Poster fallback
      const movies = response.data.Search.map((movie: any) => ({
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster === 'N/A' ? null : movie.Poster,
      }));

      return { 
        movies,
        totalResults: parseInt(response.data.totalResults) || 0,
        currentPage: page,
        totalPages: Math.ceil((parseInt(response.data.totalResults) || 0) / 10)
      };
    } catch (error) {
      // M6: Network error handling
      console.error('OMDb API error:', error);
      return { movies: [], error: 'Failed to fetch movies', totalResults: 0, currentPage: page, totalPages: 0 };
    }
  }
}