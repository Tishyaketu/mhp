// backend/src/movies/movies.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('search')
  async search(@Query('q') query: string, @Query('page') page?: string) {
    if (!query) {
      return { movies: [], error: 'Query parameter is required', totalResults: 0, currentPage: 1, totalPages: 0 };
    }
    const pageNumber = page ? parseInt(page, 10) : 1;
    return this.moviesService.searchMovies(query, pageNumber);
  }
}