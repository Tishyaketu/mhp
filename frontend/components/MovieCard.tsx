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
    <div className="border rounded-lg p-4 shadow">
      {/* M1: Display Poster with fallback */}
      <div className="h-64 bg-gray-200 mb-4 flex items-center justify-center">
        {movie.Poster ? (
          <img 
            src={movie.Poster} 
            alt={movie.Title}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <span className="text-gray-500">No Image</span>
        )}
      </div>
      
      {/* M1: Display Title and Year */}
      <h3 className="font-bold mb-1">{movie.Title}</h3>
      <p className="text-gray-600 mb-2">{movie.Year}</p>
      
      {/* M2/M3: Add/Remove button */}
      <button
        onClick={onToggleFavorite}
        className={`w-full py-2 px-4 rounded ${
          isFavorite 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {isFavorite ? 'Remove' : 'Add to Favorites'}
      </button>
    </div>
  );
}