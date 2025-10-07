// frontend/app/favorites/page.test.tsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FavoritesPage from './page';
import * as api from '@/lib/api';

jest.mock('@/lib/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('FavoritesPage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('renders favorites page title', async () => {
    mockedApi.getFavorites.mockResolvedValue([]);

    render(<FavoritesPage />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/My Favorites/)).toBeInTheDocument();
    });
  });

  it('displays loading state', async () => {
    mockedApi.getFavorites.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<FavoritesPage />, { wrapper });

    expect(screen.getByText('Loading favorites...')).toBeInTheDocument();
  });

  it('displays empty state when no favorites', async () => {
    mockedApi.getFavorites.mockResolvedValue([]);

    render(<FavoritesPage />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('No favorites yet')).toBeInTheDocument();
      expect(screen.getByText(/Start by searching for movies/)).toBeInTheDocument();
    });
  });

  it('displays list of favorites', async () => {
    mockedApi.getFavorites.mockResolvedValue([
      {
        imdbID: 'tt0111161',
        Title: 'The Shawshank Redemption',
        Year: '1994',
        Poster: null,
      },
      {
        imdbID: 'tt0468569',
        Title: 'The Dark Knight',
        Year: '2008',
        Poster: 'https://example.com/poster.jpg',
      },
    ]);

    render(<FavoritesPage />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument();
      expect(screen.getByText('The Dark Knight')).toBeInTheDocument();
    });
  });

  it('displays error state', async () => {
    mockedApi.getFavorites.mockRejectedValue(new Error('Failed to fetch'));

    render(<FavoritesPage />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Failed to load favorites')).toBeInTheDocument();
    });
  });

  it('handles remove from favorites', async () => {
    mockedApi.getFavorites.mockResolvedValue([
      {
        imdbID: 'tt0111161',
        Title: 'The Shawshank Redemption',
        Year: '1994',
        Poster: null,
      },
    ]);
    mockedApi.removeFavorite.mockResolvedValue(undefined);

    render(<FavoritesPage />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument();
    });

    const removeButton = screen.getByText(/Remove/);
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(mockedApi.removeFavorite).toHaveBeenCalled();
      expect(mockedApi.removeFavorite.mock.calls[0][0]).toBe('tt0111161');
    });
  });

  it('shows all favorites as favorited (Remove button)', async () => {
    mockedApi.getFavorites.mockResolvedValue([
      {
        imdbID: 'tt0111161',
        Title: 'Movie 1',
        Year: '1994',
        Poster: null,
      },
      {
        imdbID: 'tt0468569',
        Title: 'Movie 2',
        Year: '2008',
        Poster: null,
      },
    ]);

    render(<FavoritesPage />, { wrapper });

    await waitFor(() => {
      const removeButtons = screen.getAllByText(/Remove/);
      expect(removeButtons).toHaveLength(2);
    });
  });
});
