// backend/src/favorites/favorites.service.spec.ts
import { Test } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { DatabaseService } from '../database/database.service';

// Mock DatabaseService for testing
const mockDatabaseService = {
  getAllFavorites: jest.fn().mockResolvedValue([
    {
      imdbID: 'tt0468569',
      Title: 'The Dark Knight',
      Year: '2008',
      Poster: 'https://example.com/poster.jpg',
    }
  ]),
  addFavorite: jest.fn().mockResolvedValue({
    imdbID: 'tt0111161',
    Title: 'Test Movie',
    Year: '1994',
    Poster: null,
  }),
  removeFavorite: jest.fn().mockResolvedValue({ success: true }),
};

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
  });

  // M7: Basic unit test
  it('should have seed data', async () => {
    const favorites = await service.getAllFavorites();
    expect(favorites.length).toBe(1);
    expect(favorites[0].imdbID).toBe('tt0468569');
  });

  it('should add a favorite', async () => {
    const movie = {
      imdbID: 'tt0111161',
      Title: 'Test Movie',
      Year: '1994',
      Poster: null,
    };
    
    const result = await service.addFavorite(movie);
    expect(result.imdbID).toBe('tt0111161');
    expect(mockDatabaseService.addFavorite).toHaveBeenCalledWith(movie);
  });
});