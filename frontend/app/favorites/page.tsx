// frontend/app/favorites/page.tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFavorites, removeFavorite, Movie } from '@/lib/api';
import { MovieCard } from '@/components/MovieCard';

export default function FavoritesPage() {
  const queryClient = useQueryClient();

  // M3: Get all favorites
  const { data: favorites = [], isLoading, error } = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavorites,
  });

  // M3: Remove from favorites
  const removeMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const handleRemove = (imdbID: string) => {
    removeMutation.mutate(imdbID);
  };

  // M6: Loading state
  if (isLoading) return <p>Loading favorites...</p>;

  // M6: Error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error loading favorites
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Favorites</h1>
      
      {/* M6: Empty state */}
      {favorites.length === 0 ? (
        <p className="text-gray-500">No favorites yet. Start by searching for movies!</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {favorites.map((movie: Movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              isFavorite={true}
              onToggleFavorite={() => handleRemove(movie.imdbID)}
            />
          ))}
        </div>
      )}
    </div>
  );
}