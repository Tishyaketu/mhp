// frontend/components/MovieCard.tsx
'use client';

import { Movie } from '@/lib/api';

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function MovieCard({ movie, isFavorite, onToggleFavorite }: MovieCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200 bg-white">
      {/* M1: Display Poster with fallback - Responsive height */}
      <div className="relative h-48 xs:h-56 sm:h-64 md:h-72 bg-gray-200 flex items-center justify-center overflow-hidden">
        {movie.Poster ? (
          <img 
            src={movie.Poster} 
            alt={movie.Title}
            className="h-full w-full object-cover hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="text-center p-4">
            <div className="text-3xl sm:text-4xl mb-2">🎬</div>
            <span className="text-gray-500 text-xs sm:text-sm">No Image</span>
          </div>
        )}
      </div>
      
      {/* Movie details section */}
      <div className="p-3 sm:p-4">
        {/* M1: Display Title and Year */}
        <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
          {movie.Title}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
          📅 {movie.Year}
        </p>
        
        {/* M2/M3: Add/Remove button - Responsive text and padding */}
        <button
          onClick={onToggleFavorite}
          className={`w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all duration-200 ${
            isFavorite 
              ? 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm' 
              : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-sm'
          }`}
        >
          {isFavorite ? '❌ Remove' : '⭐ Add to Favorites'}
        </button>
      </div>
    </div>
  );
}