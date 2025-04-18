'use client';
import { useState } from 'react';
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { searchMedia } from '@/lib/api';
import { MediaItem, SearchParams } from '@/types/media';
import dayjs from 'dayjs';
import ImageModal from '@/components/ImageModal';
import ImageWithFallback from '@/components/ImageWithFallback';

export default function Home() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '*',
    page: 1,
    size: 12
  });
  const [results, setResults] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (searchParams.photographer && searchParams.photographer.length < 2) {
      newErrors.photographer = 'Photographer name must be at least 2 characters';
    }

    if (searchParams.from_date && !dayjs(searchParams.from_date).isValid()) {
      newErrors.from_date = 'Invalid start date';
    }

    if (searchParams.to_date && !dayjs(searchParams.to_date).isValid()) {
      newErrors.to_date = 'Invalid end date';
    }

    if (searchParams.from_date && searchParams.to_date) {
      if (dayjs(searchParams.from_date).isAfter(searchParams.to_date)) {
        newErrors.dates = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = async (newPage: number = 1) => {
    if (!validateFields()) return;

    try {
      setLoading(true);

      const params: SearchParams = {
        query: searchParams.query,
        page: newPage,
        size: searchParams.size
      };

      if (searchParams.photographer && searchParams.photographer.length >= 2) {
        params.photographer = searchParams.photographer;
      }

      if (searchParams.from_date) {
        params.from_date = dayjs(searchParams.from_date).format('YYYY-MM-DD');
      }

      if (searchParams.to_date) {
        params.to_date = dayjs(searchParams.to_date).format('YYYY-MM-DD');
      }

      const response = await searchMedia(params);
      setResults(prev => newPage === 1 ? response.data.results : [...prev, ...response.data.results]);
      setTotal(response.data.count);
      setSearchParams(prev => ({ ...prev, page: newPage }));
      setErrors({});
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SearchParams, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value,
      page: 1
    }));
  };

  return (
      <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              IMAGO Media Explorer
            </h1>
            <p className="text-gray-600">Search millions of professional images</p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg mb-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              {/* Search Input */}
              <div className="md:col-span-5">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                  <input
                      type="text"
                      placeholder="Search keywords..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-400"
                      value={searchParams.query}
                      onChange={(e) => handleInputChange('query', e.target.value)}
                  />
                </div>
              </div>

              {/* Photographer Input */}
              <div className="md:col-span-4">
                <div className="relative">
                  <UserCircleIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                  <input
                      type="text"
                      placeholder="Photographer..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-400"
                      value={searchParams.photographer || ''}
                      onChange={(e) => handleInputChange('photographer', e.target.value)}
                  />
                  {errors.photographer && (
                      <p className="text-red-500 text-sm mt-1">{errors.photographer}</p>
                  )}
                </div>
              </div>

              {/* Date Inputs */}
              <div className="md:col-span-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                      type="date"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                      value={searchParams.from_date || ''}
                      onChange={(e) => handleInputChange('from_date', e.target.value)}
                  />
                  <input
                      type="date"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                      value={searchParams.to_date || ''}
                      onChange={(e) => handleInputChange('to_date', e.target.value)}
                  />
                </div>
                {(errors.from_date || errors.to_date || errors.dates) && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.from_date || errors.to_date || errors.dates}
                    </p>
                )}
              </div>
            </div>

            <button
                onClick={() => handleSearch(1)}
                disabled={loading || Object.keys(errors).length > 0}
                className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search Media'}
            </button>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((item) => (
                <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedImage(item)}
                >
                  <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                    {item.metadata.photographer && (
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {item.metadata.photographer}
                        </p>
                    )}
                  </div>
                </div>
            ))}
          </div>

          <ImageModal
              item={selectedImage}
              isOpen={!!selectedImage}
              onClose={() => setSelectedImage(null)}
          />

          {/* Pagination */}
          {total > results.length && (
              <div className="mt-8 flex justify-center">
                <button
                    onClick={() => handleSearch(searchParams.page! + 1)}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
          )}
        </div>
      </main>
  );
}
