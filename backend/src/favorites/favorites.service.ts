// backend/src/favorites/favorites.service.ts
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllFavorites() {
    return await this.databaseService.getAllFavorites();
  }

  async addFavorite(movie: any) {
    return await this.databaseService.addFavorite(movie);
  }

  async removeFavorite(imdbID: string) {
    return await this.databaseService.removeFavorite(imdbID);
  }
}