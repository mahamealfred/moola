import { useState, useCallback, useEffect } from 'react';
import {
  getAQSForms,
  submitAQSForm,
  getAQSFormSubmissions,
  searchAQSForms,
  AQSForm,
  GetFormsResponse,
  FormSubmissionResponse,
  FormSubmissionPayload,
} from '@/lib/services/aqs-africa-collect';

interface UseAQSFormsOptions {
  page?: number;
  limit?: number;
}

/**
 * Custom hook for managing AQS Africa Collect forms
 */
export function useAQSForms(options: UseAQSFormsOptions = {}) {
  const { page = 1, limit = 50 } = options;

  const [forms, setForms] = useState<AQSForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    page,
    limit,
    total: 0,
    totalPages: 0,
  });

  const fetchForms = useCallback(
    async (pageNum: number = page, pageLimit: number = limit) => {
      setLoading(true);
      setError(null);

      try {
        const response: GetFormsResponse = await getAQSForms(pageNum, pageLimit);
        setForms(response.forms);
        setPagination(response.pagination);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch forms');
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [page, limit]
  );

  return {
    forms,
    loading,
    error,
    pagination,
    fetchForms,
  };
}

/**
 * Custom hook for managing a single AQS form
 * Gets form from the forms array instead of making a separate API call
 */
export function useAQSForm(formId?: string, allForms?: AQSForm[]) {
  const [form, setForm] = useState<AQSForm | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const selectForm = useCallback((id: string, forms: AQSForm[]) => {
    const foundForm = forms.find((f) => f._id === id);
    if (foundForm) {
      setForm(foundForm);
      setError(null);
    } else {
      setError(new Error('Form not found in the loaded list'));
      setForm(null);
    }
  }, []);

  // Select form on mount if both formId and allForms are provided
  useEffect(() => {
    if (formId && allForms && allForms.length > 0 && !form) {
      selectForm(formId, allForms);
    }
  }, [formId, allForms, form, selectForm]);

  return {
    form,
    loading,
    error,
    selectForm,
  };
}

/**
 * Custom hook for submitting AQS forms
 */
export function useAQSFormSubmit() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState<FormSubmissionResponse | null>(null);

  const submit = useCallback(
    async (formId: string, formData: FormSubmissionPayload) => {
      setSubmitting(true);
      setError(null);
      setSuccess(false);
      setResponse(null);

      try {
        const result = await submitAQSForm(formId, formData);
        setResponse(result);
        setSuccess(result.success);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to submit form');
        setError(error);
        setSuccess(false);
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setSubmitting(false);
    setError(null);
    setSuccess(false);
    setResponse(null);
  }, []);

  return {
    submit,
    submitting,
    error,
    success,
    response,
    reset,
  };
}

/**
 * Custom hook for searching AQS forms
 */
export function useAQSFormSearch() {
  const [results, setResults] = useState<AQSForm[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setSearching(true);
    setError(null);

    try {
      const foundForms = await searchAQSForms(query);
      setResults(foundForms);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to search forms');
      setError(error);
    } finally {
      setSearching(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResults([]);
    setSearching(false);
    setError(null);
  }, []);

  return {
    results,
    searching,
    error,
    search,
    reset,
  };
}

/**
 * Custom hook for fetching form submissions
 */
export function useAQSFormSubmissions(formId: string, page: number = 1, limit: number = 50) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    page,
    limit,
    total: 0,
    totalPages: 0,
  });

  const fetchSubmissions = useCallback(
    async (pageNum: number = page, pageLimit: number = limit) => {
      setLoading(true);
      setError(null);

      try {
        const response = await getAQSFormSubmissions(formId, pageNum, pageLimit);
        setSubmissions(response.submissions || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch submissions');
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [formId, page, limit]
  );

  return {
    submissions,
    loading,
    error,
    pagination,
    fetchSubmissions,
  };
}
