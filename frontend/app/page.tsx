// frontend/app/page.tsx
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchMovies, getFavorites, addFavorite, removeFavorite, Movie } from '@/lib/api';
import { MovieCard } from '@/components/MovieCard';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  // M1: Search movies
  const { data: searchData, isLoading, error } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => searchMovies(searchQuery),
    enabled: searchQuery.length > 0,
  });

  // M2: Get favorites to check status
  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavorites,
  });

  // M2: Add to favorites
  const addMutation = useMutation({
    mutationFn: addFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  // M2: Remove from favorites
  const removeMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const isFavorite = (imdbID: string) => {
    return favorites.some((fav: Movie) => fav.imdbID === imdbID);
  };

  const handleToggleFavorite = (movie: Movie) => {
    if (isFavorite(movie.imdbID)) {
      removeMutation.mutate(movie.imdbID);
    } else {
      addMutation.mutate(movie);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Search Movies</h1>
      
      {/* Search input */}
      <input
        type="text"
        placeholder="Search for movies..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      {/* M6: Loading state */}
      {isLoading && <p>Loading...</p>}

      {/* M6: Error handling */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: Failed to search movies
        </div>
      )}

      {/* M6: OMDb API error */}
      {searchData?.error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          {searchData.error}
        </div>
      )}

      {/* M6: Empty state */}
      {searchData?.movies?.length === 0 && !searchData.error && (
        <p className="text-gray-500">No movies found</p>
      )}

      {/* Movie grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {searchData?.movies?.map((movie: Movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            isFavorite={isFavorite(movie.imdbID)}
            onToggleFavorite={() => handleToggleFavorite(movie)}
          />
        ))}
      </div>
    </div>
  );
}