"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Movie {
  _id: string;
  name: string;
  image: string;
  downloadLinks: {
    p480?: string;
    p720?: string;
    p1080?: string;
  };
}

export default function MovieDetailsPage() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);

  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchMovieDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/movies/${id}`);
          const data = await res.json();
          if (data.success) {
            setMovie(data.data);
            // Set default video quality
            if (data.data.downloadLinks) {
              if (data.data.downloadLinks.p1080) {
                setSelectedQuality(data.data.downloadLinks.p1080);
              } else if (data.data.downloadLinks.p720) {
                setSelectedQuality(data.data.downloadLinks.p720);
              } else if (data.data.downloadLinks.p480) {
                setSelectedQuality(data.data.downloadLinks.p480);
              }
            }
          } else {
            setError(data.message || 'Failed to load movie details.');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setLoading(false);
        }
      };
      fetchMovieDetails();
    }
  }, [id]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">Loading movie details...</div>;
  }

  if (error) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-900 text-red-400">Error: {error}</div>;
  }

  if (!movie) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">Movie not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col">
          <div className="w-full">
            <h1 className="text-4xl font-bold mb-4">{movie.name}</h1>

            {selectedQuality && (
              <div className="mb-4">
                <video key={selectedQuality} controls className="w-full rounded-lg">
                  <source src={`/api/proxy?url=${encodeURIComponent(selectedQuality)}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            <div className="space-y-4">
              {movie.downloadLinks.p480 && (
                <button
                  onClick={() => setSelectedQuality(movie.downloadLinks.p480 as string)}
                  className={`block w-full text-center rounded-md px-4 py-3 font-bold text-white ${selectedQuality === movie.downloadLinks.p480 ? 'bg-red-800' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  Play 480p
                </button>
              )}
              {movie.downloadLinks.p720 && (
                <button
                  onClick={() => setSelectedQuality(movie.downloadLinks.p720 as string)}
                  className={`block w-full text-center rounded-md px-4 py-3 font-bold text-white ${selectedQuality === movie.downloadLinks.p720 ? 'bg-red-800' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  Play 720p
                </button>
              )}
              {movie.downloadLinks.p1080 && (
                <button
                  onClick={() => setSelectedQuality(movie.downloadLinks.p1080 as string)}
                  className={`block w-full text-center rounded-md px-4 py-3 font-bold text-white ${selectedQuality === movie.downloadLinks.p1080 ? 'bg-red-800' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  Play 1080p
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}