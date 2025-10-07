// frontend/app/page.test.tsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SearchPage from './page';
import * as api from '@/lib/api';

jest.mock('@/lib/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('SearchPage', () => {
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

  it('renders search input', () => {
    mockedApi.getFavorites.mockResolvedValue([]);

    render(<SearchPage />, { wrapper });

    expect(screen.getByPlaceholderText('Search for movies...')).toBeInTheDocument();
    expect(screen.getByText('Search Movies')).toBeInTheDocument();
  });

  it('displays loading state while searching', async () => {
    mockedApi.getFavorites.mockResolvedValue([]);
    mockedApi.searchMovies.mockImplementation(
      () => new Promise(() => {}) // Never resolves to keep loading state
    );

    render(<SearchPage />, { wrapper });

    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.change(input, { target: { value: 'batman' } });

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  it('displays search results with infinite scroll data', async () => {
    mockedApi.getFavorites.mockResolvedValue([]);
    mockedApi.searchMovies.mockResolvedValue({
      movies: [
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
      ],
      totalResults: 503,
      currentPage: 1,
      totalPages: 51,
    });

    render(<SearchPage />, { wrapper });

    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.change(input, { target: { value: 'batman' } });

    await waitFor(() => {
      expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument();
      expect(screen.getByText('The Dark Knight')).toBeInTheDocument();
    });

    // Check for results counter
    expect(screen.getByText(/Showing 2 of 503 results/)).toBeInTheDocument();
  });

  it('displays empty state when no results found', async () => {
    mockedApi.getFavorites.mockResolvedValue([]);
    mockedApi.searchMovies.mockResolvedValue({
      movies: [],
      totalResults: 0,
      currentPage: 1,
      totalPages: 0,
    });

    render(<SearchPage />, { wrapper });

    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.change(input, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.getByText('No movies found')).toBeInTheDocument();
    });
  });

  it('displays error message when API returns error', async () => {
    mockedApi.getFavorites.mockResolvedValue([]);
    mockedApi.searchMovies.mockResolvedValue({
      movies: [],
      error: 'Too many results.',
      totalResults: 0,
      currentPage: 1,
      totalPages: 0,
    });

    render(<SearchPage />, { wrapper });

    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.change(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(screen.getByText('Too many results.')).toBeInTheDocument();
    });
  });

  it('shows correct favorite button state', async () => {
    mockedApi.getFavorites.mockResolvedValue([
      {
        imdbID: 'tt0468569',
        Title: 'The Dark Knight',
        Year: '2008',
        Poster: 'https://example.com/poster.jpg',
      },
    ]);
    mockedApi.searchMovies.mockResolvedValue({
      movies: [
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
      ],
      totalResults: 2,
      currentPage: 1,
      totalPages: 1,
    });

    render(<SearchPage />, { wrapper });

    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.change(input, { target: { value: 'batman' } });

    await waitFor(() => {
      const addButtons = screen.getAllByText('Add to Favorites');
      const removeButtons = screen.getAllByText('Remove');
      
      expect(addButtons).toHaveLength(1); // Not favorited
      expect(removeButtons).toHaveLength(1); // Already favorited
    });
  });

  it('handles add to favorites', async () => {
    mockedApi.getFavorites.mockResolvedValue([]);
    mockedApi.searchMovies.mockResolvedValue({
      movies: [
        {
          imdbID: 'tt0111161',
          Title: 'The Shawshank Redemption',
          Year: '1994',
          Poster: null,
        },
      ],
      totalResults: 1,
      currentPage: 1,
      totalPages: 1,
    });
    mockedApi.addFavorite.mockResolvedValue({
      imdbID: 'tt0111161',
      Title: 'The Shawshank Redemption',
      Year: '1994',
      Poster: null,
    });

    render(<SearchPage />, { wrapper });

    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.change(input, { target: { value: 'shawshank' } });

    await waitFor(() => {
      expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument();
    });

    const addButton = screen.getByText('Add to Favorites');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockedApi.addFavorite).toHaveBeenCalledWith({
        imdbID: 'tt0111161',
        Title: 'The Shawshank Redemption',
        Year: '1994',
        Poster: null,
      });
    });
  });

  it('displays "No more movies to load" when all pages are loaded', async () => {
    mockedApi.getFavorites.mockResolvedValue([]);
    mockedApi.searchMovies.mockResolvedValue({
      movies: [
        {
          imdbID: 'tt0111161',
          Title: 'Test Movie',
          Year: '1994',
          Poster: null,
        },
      ],
      totalResults: 1,
      currentPage: 1,
      totalPages: 1, // Only 1 page
    });

    render(<SearchPage />, { wrapper });

    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.change(input, { target: { value: 'test' } });

    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
      expect(screen.getByText('No more movies to load')).toBeInTheDocument();
    });
  });
});
