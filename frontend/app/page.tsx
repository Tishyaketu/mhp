// frontend/app/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchMovies, getFavorites, addFavorite, removeFavorite, Movie } from '@/lib/api';
import { MovieCard } from '@/components/MovieCard';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  // M1: Search movies with infinite scrolling
  const {
    data: searchData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['search', searchQuery],
    queryFn: ({ pageParam = 1 }) => searchMovies(searchQuery, pageParam),
    enabled: searchQuery.length > 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
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

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1000 && // Load more when 1000px from bottom
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Flatten all pages into a single array of movies
  const allMovies = searchData?.pages?.flatMap(page => page.movies) || [];

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
      {searchData?.pages?.[0]?.error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          {searchData.pages[0].error}
        </div>
      )}

      {/* M6: Empty state */}
      {allMovies.length === 0 && !searchData?.pages?.[0]?.error && searchQuery && !isLoading && (
        <p className="text-gray-500">No movies found</p>
      )}

      {/* Results count */}
      {searchData?.pages?.[0]?.totalResults > 0 && (
        <p className="text-sm text-gray-600 mb-4">
          Showing {allMovies.length} of {searchData.pages[0].totalResults} results
        </p>
      )}

      {/* Movie grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {allMovies.map((movie: Movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            isFavorite={isFavorite(movie.imdbID)}
            onToggleFavorite={() => handleToggleFavorite(movie)}
          />
        ))}
      </div>

      {/* Load more indicator */}
      {isFetchingNextPage && (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading more movies...</p>
        </div>
      )}

      {/* End of results indicator */}
      {!hasNextPage && allMovies.length > 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500">No more movies to load</p>
        </div>
      )}
    </div>
  );
}