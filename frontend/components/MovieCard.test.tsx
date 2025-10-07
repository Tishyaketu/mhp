// frontend/components/MovieCard.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MovieCard } from './MovieCard';

// M7: Basic React component test
describe('MovieCard', () => {
  const mockMovie = {
    imdbID: 'tt0111161',
    Title: 'The Shawshank Redemption',
    Year: '1994',
    Poster: null,
  };

  it('renders movie information', () => {
    render(
      <MovieCard 
        movie={mockMovie} 
        isFavorite={false} 
        onToggleFavorite={() => {}}
      />
    );
    
    expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument();
    expect(screen.getByText('1994')).toBeInTheDocument();
    expect(screen.getByText('No Image')).toBeInTheDocument();
  });

  it('shows correct button text', () => {
    const { rerender } = render(
      <MovieCard 
        movie={mockMovie} 
        isFavorite={false} 
        onToggleFavorite={() => {}}
      />
    );
    
    expect(screen.getByText('Add to Favorites')).toBeInTheDocument();
    
    rerender(
      <MovieCard 
        movie={mockMovie} 
        isFavorite={true} 
        onToggleFavorite={() => {}}
      />
    );
    
    expect(screen.getByText('Remove')).toBeInTheDocument();
  });
});