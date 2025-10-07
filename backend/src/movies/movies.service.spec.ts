// backend/src/movies/movies.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    jest.clearAllMocks();
  });

  describe('searchMovies', () => {
    it('should return movies with pagination metadata', async () => {
      const mockResponse = {
        data: {
          Response: 'True',
          Search: [
            {
              imdbID: 'tt0111161',
              Title: 'The Shawshank Redemption',
              Year: '1994',
              Poster: 'https://example.com/poster.jpg',
            },
            {
              imdbID: 'tt0468569',
              Title: 'The Dark Knight',
              Year: '2008',
              Poster: 'https://example.com/poster2.jpg',
            },
          ],
          totalResults: '503',
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await service.searchMovies('batman', 1);

      expect(result.movies).toHaveLength(2);
      expect(result.movies[0].Title).toBe('The Shawshank Redemption');
      expect(result.totalResults).toBe(503);
      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(51);
      expect(mockedAxios.get).toHaveBeenCalledWith('', {
        params: {
          apikey: '',
          s: 'batman',
          type: 'movie',
          page: 1,
        },
      });
    });

    it('should handle N/A poster values', async () => {
      const mockResponse = {
        data: {
          Response: 'True',
          Search: [
            {
              imdbID: 'tt0111161',
              Title: 'Test Movie',
              Year: '1994',
              Poster: 'N/A',
            },
          ],
          totalResults: '1',
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await service.searchMovies('test', 1);

      expect(result.movies[0].Poster).toBeNull();
    });

    it('should handle movie not found error', async () => {
      const mockResponse = {
        data: {
          Response: 'False',
          Error: 'Movie not found!',
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await service.searchMovies('nonexistent', 1);

      expect(result.movies).toEqual([]);
      expect(result.totalResults).toBe(0);
      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(0);
      expect(result.error).toBeUndefined();
    });

    it('should handle API errors', async () => {
      const mockResponse = {
        data: {
          Response: 'False',
          Error: 'Too many results.',
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await service.searchMovies('a', 1);

      expect(result.movies).toEqual([]);
      expect(result.error).toBe('Too many results.');
      expect(result.totalResults).toBe(0);
    });

    it('should handle network errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      const result = await service.searchMovies('batman', 1);

      expect(result.movies).toEqual([]);
      expect(result.error).toBe('Failed to fetch movies');
      expect(result.totalResults).toBe(0);
    });

    it('should handle pagination correctly for page 2', async () => {
      const mockResponse = {
        data: {
          Response: 'True',
          Search: [
            {
              imdbID: 'tt0111162',
              Title: 'Movie on Page 2',
              Year: '1995',
              Poster: 'https://example.com/poster3.jpg',
            },
          ],
          totalResults: '503',
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await service.searchMovies('batman', 2);

      expect(result.currentPage).toBe(2);
      expect(result.totalPages).toBe(51);
      expect(mockedAxios.get).toHaveBeenCalledWith('', {
        params: {
          apikey: '',
          s: 'batman',
          type: 'movie',
          page: 2,
        },
      });
    });

    it('should default to page 1 when no page is provided', async () => {
      const mockResponse = {
        data: {
          Response: 'True',
          Search: [],
          totalResults: '0',
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await service.searchMovies('test');

      expect(mockedAxios.get).toHaveBeenCalledWith('', {
        params: {
          apikey: '',
          s: 'test',
          type: 'movie',
          page: 1,
        },
      });
    });
  });
});
