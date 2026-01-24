'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { getAQSForms, AQSForm } from '@/lib/services/aqs-africa-collect';

// Skeleton loading component
const FormCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 w-full max-w-sm animate-pulse">
    <div className="h-32 bg-gray-200 dark:bg-gray-700"></div>
    <div className="p-6 space-y-4">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mt-4"></div>
    </div>
  </div>
);

// Memoized form card component
const FormCard = React.memo(({ form }: { form: AQSForm }) => (
  <div
    className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700 w-full max-w-sm"
  >
    <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="relative w-24 h-24">
        <Image
          src="/logos/services/aqs.jpg"
          alt={form.title}
          fill
          className="object-contain"
          priority={false}
          loading="lazy"
        />
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">{form.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{form.description}</p>
      <div className="space-y-2 mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Department:</span> {form.department?.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Country:</span> {form.country}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Status:</span>{' '}
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              form.status === 'published'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                : form.status === 'draft'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
            }`}
          >
            {form.status}
          </span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Fields:</span> {form.formDefinition.components.length}
        </p>
      </div>
      <a
        href="https://ee.kobotoolbox.org/x/NXTZ9h8r"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full px-4 py-2 bg-[#ff6600] text-white text-sm font-medium rounded-md hover:bg-[#e55a00] active:scale-95 transition-colors inline-block text-center"
      >
        Fill Form
      </a>
    </div>
  </div>
));

FormCard.displayName = 'FormCard';

/**
 * AQS Africa Collect Forms Page - Performance Optimized
 */
export default function AQSFormsPage() {
  const [forms, setForms] = useState<AQSForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch forms with useCallback to prevent unnecessary recreations
  const fetchForms = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAQSForms(pageNum, 10);
      setForms(response.forms);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch forms';
      setError(errorMessage);
      console.error('Error fetching forms:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch forms on component mount and when page changes
  useEffect(() => {
    fetchForms(page);
  }, [page, fetchForms]);

  if (error) {
    return (
      <div className="w-full">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
          <button onClick={() => fetchForms(1)} className="mt-3 text-red-600 underline hover:text-red-800">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show forms list
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AQS Africa Collect Forms</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Select a form to fill out and submit</p>
        
        {/* External Form Link */}
        <div className="mt-6 flex justify-center">
          <a
            href="https://ee.kobotoolbox.org/x/NXTZ9h8r"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-[#ff6600] text-white font-semibold rounded-lg hover:bg-[#e55a00] transition-colors shadow-md hover:shadow-lg"
          >
            Open AQS Form Directly
          </a>
        </div>
      </div>

      {/* Loading State with Skeletons */}
      {loading && (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 max-w-7xl">
            {Array.from({ length: 6 }).map((_, i) => (
              <FormCardSkeleton key={i} />
            ))}
          </div>
        </div>
      )}

      {/* Forms Grid */}
      {!loading && forms.length > 0 && (
        <div className="flex flex-col items-center w-full">
          <div className="flex justify-center w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {forms.map((form) => (
                <FormCard key={form._id} form={form} />
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex gap-2 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = Math.max(1, page - Math.floor(5 / 2)) + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 rounded-md transition-colors ${
                        pageNum === page 
                          ? 'bg-[#ff6600] text-white' 
                          : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* No Forms Message */}
      {!loading && forms.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No forms found</p>
          <button
            onClick={() => fetchForms(1)}
            className="px-4 py-2 bg-[#ff6600] text-white rounded-md hover:bg-[#e55a00] transition-colors"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}
