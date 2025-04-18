'use client';
import { useState } from 'react';
import { MagnifyingGlassIcon, UserCircleIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { searchMedia } from '@/lib/api';
import { MediaItem } from '@/types/media';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [photographer, setPhotographer] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const handleSearch = async (newPage: number = 1) => {
    try {
      setLoading(true);
      const response = await searchMedia({
        query: searchTerm,
        photographer,
        from_date: startDate,
        to_date: endDate,
        page: newPage,
        size: 12
      });

      if (newPage === 1) {
        setResults(response.data.results);
      } else {
        setResults(prev => [...prev, ...response.data.results]);
      }
      setTotal(response.data.count);
      setPage(newPage);
    } finally {
      setLoading(false);
    }
  };

  return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">IMAGO Media Search</h1>

          {/* Search Form */}
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Search Term Input */}
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search keywords..."
                    className="input-field pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Photographer Filter */}
              <div className="relative">
                <UserCircleIcon className="h-5 w-5 absolute left-3 top-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Photographer..."
                    className="input-field pl-10"
                    value={photographer}
                    onChange={(e) => setPhotographer(e.target.value)}
                />
              </div>

              {/* Date Range */}
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <CalendarIcon className="h-5 w-5 absolute left-3 top-4 text-gray-400" />
                  <input
                      type="date"
                      className="input-field pl-10"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="relative flex-1">
                  <CalendarIcon className="h-5 w-5 absolute left-3 top-4 text-gray-400" />
                  <input
                      type="date"
                      className="input-field pl-10"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
                onClick={() => handleSearch(1)}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Searching...' : 'Search Media'}
            </button>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((item) => (
                <div key={item.id} className="card">
                  <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover bg-gray-100"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.jpg';
                        e.currentTarget.classList.remove('bg-gray-100');
                      }}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                      {item.metadata.photographer && (
                          <p className="flex items-center">
                            <UserCircleIcon className="h-4 w-4 mr-2" />
                            {item.metadata.photographer}
                          </p>
                      )}
                      {item.metadata.date && (
                          <p className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {new Date(item.metadata.date).toLocaleDateString()}
                          </p>
                      )}
                      {item.metadata.copyright && (
                          <p className="text-xs text-gray-500 mt-2">
                            © {item.metadata.copyright}
                          </p>
                      )}
                    </div>
                  </div>
                </div>
            ))}
          </div>

          {/* Pagination */}
          {total > results.length && (
              <div className="mt-8 flex justify-center">
                <button
                    onClick={() => handleSearch(page + 1)}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
          )}
        </div>
      </main>
  );
}
