'use client';

import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import Image from 'next/image';
import { getAQSForms, AQSForm } from '@/lib/services/aqs-africa-collect';

// Lazy load the DynamicAQSForm component to reduce initial bundle size
const DynamicAQSForm = lazy(() => import('@/components/DynamicAQSForm').then((mod) => ({ default: mod.DynamicAQSForm })));

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
const FormCard = React.memo(({ form, onSelect }: { form: AQSForm; onSelect: (id: string) => void }) => (
  <div
    className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer w-full max-w-sm"
    onClick={() => onSelect(form._id)}
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
      <button
        onClick={() => onSelect(form._id)}
        className="w-full px-4 py-2 bg-[#ff6600] text-white text-sm font-medium rounded-md hover:bg-[#e55a00] active:scale-95 transition-colors"
      >
        Fill Form
      </button>
    </div>
  </div>
));

FormCard.displayName = 'FormCard';

/**
 * AQS Africa Collect Forms Page - Performance Optimized
 */
export default function AQSFormsPage() {
  const [forms, setForms] = useState<AQSForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<AQSForm | null>(null);
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
      setSelectedForm(null);
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

  // Memoize form selection handler
  const handleSelectForm = useCallback((formId: string) => {
    const form = forms.find((f) => f._id === formId);
    if (form) {
      setSelectedForm(form);
    } else {
      setError('Form not found in the loaded list');
    }
  }, [forms]);

  const handleBackToList = useCallback(() => {
    setSelectedForm(null);
  }, []);

  const handleSubmitSuccess = useCallback(() => {
    setSelectedForm(null);
    fetchForms(page);
  }, [page, fetchForms]);

  // Memoize pagination buttons
  const paginationButtons = useMemo(() => {
    if (totalPages <= 1) return null;
    // Show max 5 page buttons to avoid rendering too many
    const maxButtons = 5;
    let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [page, totalPages]);

  if (error && !selectedForm) {
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

  // Show selected form
  if (selectedForm) {
    return (
      <div className="w-full flex flex-col items-center justify-start min-h-screen px-4">
        <div className="w-full max-w-2xl">
          <button
            onClick={handleBackToList}
            className="mb-6 px-4 py-2 text-black hover:text-gray-800 dark:text-white dark:hover:text-gray-200 underline flex items-center gap-2"
          >
            ← Back to Forms
          </button>
          <Suspense fallback={<div className="text-center py-12 text-gray-600">Loading form...</div>}>
            <DynamicAQSForm
              form={selectedForm}
              onSubmitSuccess={handleSubmitSuccess}
              onSubmitError={(error) => {
                console.error('Form submission error:', error);
              }}
            />
          </Suspense>
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
      </div>

      {/* Loading State with Skeletons */}
      {loading && (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <FormCardSkeleton key={i} />
            ))}
          </div>
        </div>
      )}

      {/* Forms Grid */}
      {!loading && forms.length > 0 && (
        <>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {forms.map((form) => (
                <FormCard key={form._id} form={form} onSelect={handleSelectForm} />
              ))}
            </div>
          </div>

          {/* Pagination */}
          {paginationButtons && paginationButtons.length > 0 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {paginationButtons.map((pageNum) => (
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
                ))}
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
        </>
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
