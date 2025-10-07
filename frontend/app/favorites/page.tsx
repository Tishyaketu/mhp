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
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading favorites...</p>
      </div>
    );
  }

  // M6: Error state
  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error</p>
        <p>Failed to load favorites</p>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          ⭐ My Favorites
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} saved
        </p>
      </div>
      
      {/* M6: Empty state */}
      {favorites.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="text-4xl sm:text-6xl mb-4">⭐</div>
          <p className="text-gray-600 text-base sm:text-lg mb-2">No favorites yet</p>
          <p className="text-gray-400 text-sm sm:text-base">
            Start by searching for movies and adding them to your favorites!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
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