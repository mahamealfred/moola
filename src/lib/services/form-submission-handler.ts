/**
 * Form Submission Handler
 * Handles the complete flow of form submission with payload formatting
 */

export interface FormSubmissionRequest {
  data: Record<string, any>;
  status: 'submitted' | 'draft' | 'pending';
}

export interface FormSubmissionResult {
  success: boolean;
  submissionId?: string;
  message?: string;
  timestamp?: string;
  data?: any;
}

/**
 * Build a form submission payload with the required structure
 * @param formData - The collected form data object
 * @param status - The submission status (default: 'submitted')
 * @returns Formatted payload ready for API submission
 */
export function buildFormSubmissionPayload(
  formData: Record<string, any>,
  status: 'submitted' | 'draft' | 'pending' = 'submitted'
): FormSubmissionRequest {
  return {
    data: formData,
    status: status,
  };
}

/**
 * Submit form data to the AQS endpoint
 * @param formId - The ID of the form being submitted
 * @param formData - The collected form data
 * @returns Promise with the submission result
 */
export async function submitFormToAQS(
  formId: string,
  formData: Record<string, any>
): Promise<FormSubmissionResult> {
  const endpoint = `http://localhost:4000/v1/agency/external/forms/${formId}/submit`;
  const payload = buildFormSubmissionPayload(formData, 'submitted');

  try {
    console.log(`Submitting form ${formId} to:`, endpoint);
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Form submission failed:', response.status, responseData);
      return {
        success: false,
        message: responseData.message || `Failed to submit form: ${response.statusText}`,
      };
    }

    return {
      success: true,
      submissionId: responseData.data?.submissionId || responseData.submissionId,
      message: responseData.message || 'Form submitted successfully',
      timestamp: new Date().toISOString(),
      data: responseData.data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error submitting form:', errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }
}

/**
 * Example of how to use the form submission handler
 * Usage in a React component:
 *
 * const handleFormSubmit = async (formData: Record<string, any>) => {
 *   const result = await submitFormToAQS(formId, formData);
 *   if (result.success) {
 *     console.log('Submission ID:', result.submissionId);
 *   } else {
 *     console.error('Submission failed:', result.message);
 *   }
 * };
 */
