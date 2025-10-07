// frontend/app/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

  // Flatten all pages into a single array of movies and remove duplicates
  const allMovies = React.useMemo(() => {
    const movies = searchData?.pages?.flatMap(page => page.movies) || [];
    // Remove duplicates by imdbID
    const uniqueMovies = movies.reduce((acc: Movie[], movie: Movie) => {
      if (!acc.find(m => m.imdbID === movie.imdbID)) {
        acc.push(movie);
      }
      return acc;
    }, []);
    return uniqueMovies;
  }, [searchData]);

  return (
    <div className="pb-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
        Search Movies
      </h1>
      
      {/* Search input */}
      <div className="mb-4 sm:mb-6">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 sm:p-4 text-base sm:text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 shadow-sm"
        />
      </div>

      {/* M6: Loading state */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      )}

      {/* M6: Error handling */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>Failed to search movies</p>
        </div>
      )}

      {/* M6: OMDb API error */}
      {searchData?.pages?.[0]?.error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 px-4 py-3 rounded mb-4">
          {searchData.pages[0].error}
        </div>
      )}

      {/* M6: Empty state */}
      {allMovies.length === 0 && !searchData?.pages?.[0]?.error && searchQuery && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">🎬</p>
          <p className="text-gray-600 mt-2">No movies found</p>
          <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
        </div>
      )}

      {/* Results count */}
      {searchData?.pages?.[0]?.totalResults > 0 && (
        <div className="mb-4 sm:mb-6">
          <p className="text-sm sm:text-base text-gray-600">
            Showing <span className="font-semibold">{allMovies.length}</span> of{' '}
            <span className="font-semibold">{searchData.pages[0].totalResults}</span> results
          </p>
        </div>
      )}

      {/* Movie grid - Responsive: 1 col on mobile, 2 on sm, 3 on md, 4 on lg */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
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
        <div className="text-center py-6 sm:py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-500 text-sm sm:text-base">Loading more movies...</p>
        </div>
      )}

      {/* End of results indicator */}
      {!hasNextPage && allMovies.length > 0 && (
        <div className="text-center py-6 sm:py-8">
          <p className="text-gray-500 text-sm sm:text-base">✓ All movies loaded</p>
        </div>
      )}
    </div>
  );
}