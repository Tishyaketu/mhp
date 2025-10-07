// backend/src/movies/movies.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('search')
  async search(@Query('q') query: string) {
    if (!query) {
      return { movies: [], error: 'Query parameter is required' };
    }
    return this.moviesService.searchMovies(query);
  }
}