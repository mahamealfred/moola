'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getAQSForms, getAQSFormById, AQSForm } from '@/lib/services/aqs-africa-collect';
import { DynamicAQSForm } from '@/components/DynamicAQSForm';

/**
 * AQS Africa Collect Forms Page
 * Displays available forms and allows users to fill and submit them
 */
export default function AQSFormsPage() {
  const [forms, setForms] = useState<AQSForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<AQSForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch forms on component mount and when page changes
  useEffect(() => {
    fetchForms(page);
  }, [page]);

  const fetchForms = async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAQSForms(pageNum, 10);
      setForms(response.forms);
      setTotalPages(response.pagination.totalPages);
      setSelectedForm(null); // Clear selected form when fetching new list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch forms');
      console.error('Error fetching forms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectForm = async (formId: string) => {
    try {
      setLoading(true);
      const form = await getAQSFormById(formId);
      if (form) {
        setSelectedForm(form);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch form details');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedForm(null);
  };

  if (error && !selectedForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <button
            onClick={handleBackToList}
            className="mb-4 inline-flex items-center px-3 py-1.5 text-sm text-[#ff6600] hover:text-[#e55a00] font-medium transition-colors"
          >
            ← Back to Forms
          </button>
          <DynamicAQSForm
            form={selectedForm}
            onSubmitSuccess={() => {
              setSelectedForm(null);
              fetchForms(page);
            }}
            onSubmitError={(error) => {
              console.error('Form submission error:', error);
            }}
            loading={loading}
            showLogo={false}
          />
        </div>
      </div>
    );
  }

  // Show forms list
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-start">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">AQS Africa Collect Forms</h1>
          <p className="text-gray-600 mt-2">Select a form to fill out and submit</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-6">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6600]"></div>
            </div>
            <p className="mt-3 text-gray-600 text-sm">Loading forms...</p>
          </div>
        )}

        {/* Forms Grid */}
        {!loading && forms.length > 0 && (
          <>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {forms.map((form) => (
                <div
                  key={form._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer w-full max-w-sm"
                  onClick={() => handleSelectForm(form._id)}
                >
                  <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center p-4">
                    <div className="relative w-24 h-24">
                      <Image
                        src="/logos/services/aqs.jpg"
                        alt={form.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">{form.title}</h3>
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">{form.description}</p>
                    <div className="space-y-1 mb-3">
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold">Department:</span> {form.department?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold">Country:</span> {form.country}
                      </p>
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold">Status:</span>{' '}
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            form.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : form.status === 'draft'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {form.status}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleSelectForm(form._id)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-[#ff6600] to-orange-500 text-white text-xs font-medium rounded-md hover:from-[#e55a00] hover:to-orange-600 transition-colors"
                    >
                      Fill Form
                    </button>
                  </div>
                </div>
              ))}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 rounded-md ${
                        pageNum === page ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* No Forms Message */}
        {!loading && forms.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg">
            <p className="text-gray-600 mb-3 text-sm">No forms found</p>
            <button
              onClick={() => fetchForms(1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
