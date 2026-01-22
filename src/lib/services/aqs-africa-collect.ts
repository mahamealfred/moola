// AQS Africa Collect Service
// Handles all interactions with the AQS Africa Collect API for dynamic forms
// Optimized with caching and performance improvements


const AQS_API_BASE = 'https://core-api.ddin.rw/v1/datacollection/external';
//const AQS_API_BASE = 'http://localhost:4000/v1/datacollection/external';

// Simple in-memory cache for form data
const formCache = new Map<string, { data: GetFormsResponse; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

/**
 * Get cached form data if available and not expired
 */
function getCachedForms(page: number, limit: number): GetFormsResponse | null {
  const cacheKey = `forms_${page}_${limit}`;
  const cached = formCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Using cached forms data for page', page);
    return cached.data;
  }

  return null;
}

/**
 * Store form data in cache
 */
function cacheForms(page: number, limit: number, data: GetFormsResponse): void {
  const cacheKey = `forms_${page}_${limit}`;
  formCache.set(cacheKey, { data, timestamp: Date.now() });
}

/**
 * Clear cache when needed
 */
function clearFormCache(): void {
  formCache.clear();
}

// Type definitions for AQS Africa Collect
export interface FormComponent {
  label: string;
  key: string;
  type: string;
  input?: boolean;
  tableView?: boolean;
  validateWhenHidden?: boolean;
  applyMaskOn?: string;
  provider?: string;
  components?: FormComponent[];
  datePicker?: {
    disableWeekends?: boolean;
    disableWeekdays?: boolean;
  };
  enableMinDateInput?: boolean;
  enableMaxDateInput?: boolean;
  widget?: {
    type?: string;
    displayInTimezone?: string;
    locale?: string;
    useLocaleSettings?: boolean;
    allowInput?: boolean;
    mode?: string;
    enableTime?: boolean;
    noCalendar?: boolean;
    format?: string;
    hourIncrement?: number;
    minuteIncrement?: number;
    time_24hr?: boolean;
    minDate?: string | null;
    disableWeekends?: boolean;
    disableWeekdays?: boolean;
    maxDate?: string | null;
  };
  disableOnInvalid?: boolean;
  customConditional?: string;
}

export interface FormDefinition {
  display: string;
  components: FormComponent[];
}

export interface Department {
  _id: string;
  name: string;
  code: string;
}

export interface Creator {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface AccessControl {
  viewDepartments: string[];
  editDepartments: string[];
  dataAccessDepartments: string[];
  reportAccessDepartments: string[];
  archiveFormsDepartments: string[];
}

export interface Analytics {
  totalSubmissions: number;
}

export interface FormTranslations {
  title: {
    en: string;
    fr: string;
    rw: string;
  };
  description: {
    en: string;
    fr: string;
    rw: string;
  };
}

export interface AQSForm {
  _id: string;
  title: string;
  description: string;
  department: Department;
  sector: string;
  country: string;
  formDefinition: FormDefinition;
  version: number;
  status: 'published' | 'draft' | 'archived';
  organization: string;
  creator: Creator;
  defaultLanguage: string;
  translations: FormTranslations;
  versionHistory: any[];
  lastUpdatedBy: string;
  createdAt: string;
  updatedAt: string;
  accessControl: AccessControl;
  analytics: Analytics;
  __v: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetFormsResponse {
  success: boolean;
  forms: AQSForm[];
  pagination: PaginationInfo;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface FormSubmissionPayload {
  [key: string]: any;
}

export interface FormSubmissionResponse {
  success: boolean;
  submissionId?: string;
  message?: string;
  data?: any;
}

/**
 * Fetch all available forms from AQS Africa Collect with caching
 */
export async function getAQSForms(
  page: number = 1,
  limit: number = 50
): Promise<GetFormsResponse> {
  try {
    // Check cache first
    const cachedData = getCachedForms(page, limit);
    if (cachedData) {
      return cachedData;
    }

    const url = new URL(`${AQS_API_BASE}/forms`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());

    console.log('Fetching AQS forms from:', url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('API Error:', response.status, responseText);
      throw new Error(`Failed to fetch forms: ${response.status} ${response.statusText} - ${responseText}`);
    }

    // Parse the response with the new structure
    const apiResponse = JSON.parse(responseText) as ApiResponse<GetFormsResponse>;

    if (!apiResponse.success) {
      throw new Error(`API returned error: ${apiResponse.message}`);
    }

    // Cache the successful response
    cacheForms(page, limit, apiResponse.data);

    // Extract the forms data from the nested structure
    return apiResponse.data;
  } catch (error) {
    console.error('Error fetching AQS forms:', error);
    throw error;
  }
}

/**
 * Fetch a specific form by ID
 */
export async function getAQSFormById(formId: string): Promise<AQSForm | null> {
  try {
    const url = `${AQS_API_BASE}/forms/${formId}`;
    console.log('Fetching form from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseText = await response.text();
    console.log('Form response:', responseText);

    if (!response.ok) {
      console.error('API Error:', response.status, responseText);
      throw new Error(`Failed to fetch form: ${response.status} ${response.statusText}`);
    }

    const apiResponse = JSON.parse(responseText) as ApiResponse<GetFormsResponse>;
    
    // Extract the first form from the forms array
    if (apiResponse.data && apiResponse.data.forms && apiResponse.data.forms.length > 0) {
      return apiResponse.data.forms[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching AQS form by ID:', error);
    throw error;
  }
}

/**
 * Get Bearer token from storage
 */
function getBearerToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    // Try to get from sessionStorage first (encrypted)
    if (typeof window.sessionStorage !== 'undefined') {
      const encryptedTokenData = window.sessionStorage.getItem('at');
      if (encryptedTokenData) {
        try {
          const decrypted = decodeURIComponent(atob(encryptedTokenData));
          const tokenData = JSON.parse(decrypted);
          return tokenData.accessToken || null;
        } catch {
          // Fall through to localStorage
        }
      }
    }

    // Try to get from localStorage as fallback
    if (typeof window.localStorage !== 'undefined') {
      const token = window.localStorage.getItem('accessToken');
      if (token) return token;
    }

    return null;
  } catch (error) {
    console.error('Error retrieving bearer token:', error);
    return null;
  }
}

/**
 * Get user-friendly error message based on HTTP status code and error response
 */
function getErrorMessage(statusCode: number, responseText: string): string {
  try {
    const errorData = JSON.parse(responseText);
    // If the API provided a message, use it
    if (errorData.message) {
      return errorData.message;
    }
  } catch {
    // Response is not JSON, use status-based message
  }

  // Provide user-friendly messages based on status codes
  switch (statusCode) {
    case 429:
      return 'Too many requests. Please wait a few moments before submitting again.';
    case 400:
      return 'Invalid form data. Please check your entries and try again.';
    case 401:
      return 'Your session has expired. Please log in again.';
    case 403:
      return 'You do not have permission to submit this form.';
    case 404:
      return 'Form not found. Please refresh and try again.';
    case 500:
      return 'Server error. Please try again later.';
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return `Failed to submit form. Please try again. (Error: ${statusCode})`;
  }
}

/**
 * Submit form data to AQS Africa Collect
 * Wraps form data in the required payload structure: { data: {...}, status: "submitted" }
 * Clears cache on successful submission to ensure fresh data on next fetch
 */
export async function submitAQSForm(
  formId: string,
  formData: FormSubmissionPayload
): Promise<FormSubmissionResponse> {
  try {
    // Construct the payload with the required structure
    const payload = {
      data: formData,
      status: 'submitted',
    };

    console.log('Submitting form with payload:', JSON.stringify(payload, null, 2));

    // Get Bearer token
    const token = getBearerToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Bearer token included in request headers');
    } else {
      console.warn('No bearer token found for form submission');
    }

    const response = await fetch(`${AQS_API_BASE}/forms/${formId}/submit`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log('Form submission response:', responseText);

    if (!response.ok) {
      console.error('API Error:', response.status, responseText);
      const userFriendlyMessage = getErrorMessage(response.status, responseText);
      throw new Error(userFriendlyMessage);
    }

    const apiResponse = JSON.parse(responseText) as ApiResponse<FormSubmissionResponse>;

    // Clear form cache on successful submission to get fresh data
    clearFormCache();

    return apiResponse.data;
  } catch (error) {
    console.error('Error submitting AQS form:', error);
    throw error;
  }
}

/**
 * Get form submissions (if API supports it)
 */
export async function getAQSFormSubmissions(
  formId: string,
  page: number = 1,
  limit: number = 50
): Promise<any> {
  try {
    const url = new URL(`${AQS_API_BASE}/forms/${formId}/submissions`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch submissions: ${response.statusText}`);
    }

    const apiResponse = await response.json() as ApiResponse<any>;
    return apiResponse.data;
  } catch (error) {
    console.error('Error fetching AQS form submissions:', error);
    throw error;
  }
}

/**
 * Get form by title or department
 */
export async function searchAQSForms(query: string): Promise<AQSForm[]> {
  try {
    const response = await getAQSForms();
    
    const lowerQuery = query.toLowerCase();
    return response.forms.filter(
      (form) =>
        form.title.toLowerCase().includes(lowerQuery) ||
        form.description.toLowerCase().includes(lowerQuery) ||
        form.department.name.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Error searching AQS forms:', error);
    throw error;
  }
}

/**
 * Validate form data against form definition
 */
export function validateFormData(
  formDefinition: FormDefinition,
  formData: FormSubmissionPayload
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  for (const component of formDefinition.components) {
    if (component.type === 'button') continue;

    const value = formData[component.key];

    // Basic validation based on type
    if (component.input && !value) {
      errors[component.key] = `${component.label} is required`;
      continue;
    }

    switch (component.type) {
      case 'email':
        if (value && !isValidEmail(value)) {
          errors[component.key] = 'Invalid email format';
        }
        break;
      case 'phoneNumber':
        if (value && !isValidPhoneNumber(value)) {
          errors[component.key] = 'Invalid phone number format';
        }
        break;
      case 'number':
        if (value && isNaN(Number(value))) {
          errors[component.key] = 'Must be a number';
        }
        break;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Helper function to validate email
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Helper function to validate phone number
 */
function isValidPhoneNumber(phone: string): boolean {
  // Accept various phone number formats
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Format form data for submission
 */
export function formatFormSubmission(
  formData: FormSubmissionPayload
): FormSubmissionPayload {
  const formatted: FormSubmissionPayload = {};

  for (const [key, value] of Object.entries(formData)) {
    if (value !== null && value !== undefined && value !== '') {
      formatted[key] = value;
    }
  }

  return formatted;
}
