'use client';

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader, Eye, EyeOff, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { AQSForm, FormComponent, FormSubmissionPayload, submitAQSForm, validateFormData, formatFormSubmission } from '@/lib/services/aqs-africa-collect';

interface DynamicFormProps {
  form: AQSForm;
  onSubmitSuccess?: (response: any) => void;
  onSubmitError?: (error: Error) => void;
  loading?: boolean;
  itemsPerStep?: number;
  showLogo?: boolean;
}

interface FormFieldState {
  [key: string]: any;
}

/**
 * Memoized Individual Form Field Component - optimized to prevent unnecessary re-renders
 */
const FormField = memo(
  ({
    component,
    value,
    onChange,
    error,
    index,
  }: {
    component: FormComponent;
    value: any;
    onChange: (value: any) => void;
    error?: string;
    index: number;
  }) => {
    const [showPassword, setShowPassword] = useState(false);

    if (component.type === 'button') {
      return null;
    }

    const baseInputClasses = `w-full px-2 md:px-3 py-1.5 md:py-2 rounded-lg border border-gray-300 dark:border-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 text-xs md:text-sm ${
      error
        ? 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-500 focus:ring-red-500/50'
        : 'bg-white dark:bg-gray-700 focus:border-[#ff6600] focus:ring-orange-500/30 dark:focus:ring-orange-400/30'
    } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`;

    const labelClasses = 'block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5';
    const errorClasses = 'text-red-500 dark:text-red-400 text-xs mt-0.5 flex items-center gap-1';

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="form-group"
      >
        {component.label && (
          <label className={labelClasses}>
            {component.label}
            {component.input && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Text Fields */}
        {(component.type === 'textfield' || component.type === 'email') && (
          <input
            type={component.type === 'email' ? 'email' : 'text'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClasses}
            placeholder={component.label}
            required={component.input}
          />
        )}

        {/* Phone Number */}
        {component.type === 'phoneNumber' && (
          <input
            type="tel"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClasses}
            placeholder={component.label || '+250 7XX XXX XXX'}
            required={component.input}
          />
        )}

        {/* Number */}
        {component.type === 'number' && (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClasses}
            placeholder={component.label}
            required={component.input}
          />
        )}

        {/* Textarea */}
        {component.type === 'textarea' && (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseInputClasses} resize-none`}
            placeholder={component.label}
            rows={4}
            required={component.input}
          />
        )}

        {/* Select */}
        {component.type === 'select' && (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClasses}
            required={component.input}
          >
            <option value="">Select {component.label}</option>
          </select>
        )}

        {/* Checkbox */}
        {component.type === 'checkbox' && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              className="w-3 h-3 md:w-4 md:h-4 rounded border-gray-300 dark:border-gray-600 accent-[#ff6600] focus:ring-2 focus:ring-orange-500"
            />
            <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">{component.label}</span>
          </label>
        )}

        {/* Radio Buttons */}
        {component.type === 'radio' && (
          <div className="space-y-3">
            {/* Add radio options from component data if available */}
          </div>
        )}

        {/* Date/DateTime */}
        {(component.type === 'date' || component.type === 'datetime') && (
          <div className="relative">
            <input
              type={component.type === 'datetime' ? 'datetime-local' : 'date'}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={baseInputClasses}
              required={component.input}
            />
            <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        )}

        {/* Address Component */}
        {component.type === 'address' && (
          <div className="space-y-2 p-2 md:p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
            {component.components?.map((subComponent) => (
              <div key={subComponent.key}>
                {subComponent.label && (
                  <label className={labelClasses}>{subComponent.label}</label>
                )}
                <input
                  type="text"
                  value={value[subComponent.key] || ''}
                  onChange={(e) => {
                    const addressData = value || {};
                    onChange({
                      ...addressData,
                      [subComponent.key]: e.target.value,
                    });
                  }}
                  className={`${baseInputClasses} text-xs`}
                  placeholder={subComponent.label}
                />
              </div>
            ))}
          </div>
        )}

        {/* File Upload */}
        {component.type === 'file' && (
          <label className="flex items-center justify-center w-full p-2 md:p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-[#ff6600] hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all cursor-pointer">
            <div className="text-center">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-xs text-gray-600 dark:text-gray-400">Click to upload</p>
            </div>
            <input
              type="file"
              onChange={(e) => onChange(e.target.files?.[0])}
              className="hidden"
              required={component.input}
            />
          </label>
        )}

        {/* Error Message */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={errorClasses}>
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </motion.div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for better performance - only re-render if these props change
    return (
      prevProps.value === nextProps.value &&
      prevProps.error === nextProps.error &&
      prevProps.component.key === nextProps.component.key
    );
  }
);

FormField.displayName = 'FormField';

/**
 * Beautiful Multi-Step Dynamic Form Component that renders forms from AQS Africa Collect API
 * Performance optimized with memoization and lazy evaluation
 */
export const DynamicAQSForm: React.FC<DynamicFormProps> = ({
  form,
  onSubmitSuccess,
  onSubmitError,
  loading = false,
  itemsPerStep = 3,
  showLogo = true,
}) => {
  const [formData, setFormData] = useState<FormFieldState>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Get form components (exclude buttons)
  const formComponents = useMemo(
    () => form.formDefinition.components.filter((c) => c.type !== 'button'),
    [form.formDefinition.components]
  );

  const totalSteps = useMemo(() => Math.ceil(formComponents.length / itemsPerStep), [formComponents.length, itemsPerStep]);

  const currentStepComponents = useMemo(
    () => formComponents.slice(currentStep * itemsPerStep, (currentStep + 1) * itemsPerStep),
    [formComponents, currentStep, itemsPerStep]
  );

  // Initialize form data with empty values
  useEffect(() => {
    const initialData: FormFieldState = {};
    form.formDefinition.components.forEach((component) => {
      if (component.type !== 'button') {
        initialData[component.key] = '';
      }
    });
    setFormData(initialData);
  }, [form]);

  const handleInputChange = useCallback((key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    setErrors((prev) => {
      if (prev[key]) {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const validateCurrentStep = useCallback((): boolean => {
    const stepErrors: Record<string, string> = {};
    currentStepComponents.forEach((component) => {
      if (component.input && !formData[component.key]) {
        stepErrors[component.key] = `${component.label} is required`;
      }
    });

    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return false;
    }
    return true;
  }, [currentStepComponents, formData]);

  const handleNext = useCallback(() => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [validateCurrentStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateCurrentStep()) {
        return;
      }

      const validation = validateFormData(form.formDefinition, formData);
      if (!validation.valid) {
        setErrors(validation.errors);
        return;
      }

      setIsSubmitting(true);
      setSubmitMessage(null);

      try {
        const formattedData = formatFormSubmission(formData);
        console.log('Submitting Form Data:', formattedData);
        const response = await submitAQSForm(form._id, formattedData);

        // Show toast notification with backend message
        const successMessage = response.message || 'Form submitted successfully!';
        toast.success(successMessage, {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#10b981',
            color: '#fff',
            fontWeight: '600',
          },
          icon: '✓',
        });

        setSubmitMessage({
          type: 'success',
          text: successMessage,
        });

        const resetData: FormFieldState = {};
        form.formDefinition.components.forEach((component) => {
          if (component.type !== 'button') {
            resetData[component.key] = '';
          }
        });
        setFormData(resetData);
        setCurrentStep(0);

        onSubmitSuccess?.(response);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred while submitting the form';

        // Show error toast
        toast.error(errorMessage, {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#ef4444',
            color: '#fff',
            fontWeight: '600',
          },
          icon: '✕',
        });

        setSubmitMessage({
          type: 'error',
          text: errorMessage,
        });
        onSubmitError?.(error instanceof Error ? error : new Error(errorMessage));
      } finally {
        setIsSubmitting(false);
      }
    },
    [form.formDefinition, formData, validateCurrentStep, onSubmitSuccess, onSubmitError]
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-3 md:py-6 px-2 md:px-3 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 md:mb-5 text-center"
        >
          {showLogo && (
            <div className="mb-3 inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white dark:bg-gray-700/50 shadow-lg border border-gray-200 dark:border-gray-600 p-1.5 mx-auto">
              <Image
                src="/logos/services/aqs.jpg"
                alt="AQS Logo"
                width={56}
                height={56}
                className="w-full h-full object-contain rounded-lg"
                priority
              />
            </div>
          )}
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">{form.title}</h1>
          {form.description && (
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed">{form.description}</p>
          )}
          {form.department && (
            <div className="mt-2 inline-block px-2.5 md:px-3 py-1 rounded-lg bg-orange-100/80 dark:bg-orange-900/40 border border-orange-200/50 dark:border-orange-700/50 backdrop-blur-sm">
              <p className="text-xs font-medium text-orange-700 dark:text-orange-300">
                {form.department.name}
              </p>
            </div>
          )}
        </motion.div>

        {/* Progress Bar */}
        {totalSteps > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 md:mb-5 bg-white dark:bg-gray-800/50 p-3 md:p-4 rounded-lg border border-gray-200 dark:border-gray-700/50"
          >
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                Step <span className="text-[#ff6600]">{currentStep + 1}</span> of <span className="text-[#ff6600]">{totalSteps}</span>
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {Math.round(((currentStep + 1) / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 md:h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-[#ff6600] to-orange-500 h-full rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {/* Submit Message */}
        <AnimatePresence>
          {submitMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-3 md:mb-4 p-3 md:p-4 rounded-lg border-l-4 flex items-start gap-2 text-xs md:text-sm backdrop-blur-sm ${
                submitMessage.type === 'success'
                  ? 'bg-green-50/80 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-300'
                  : 'bg-red-50/80 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-300'
              }`}
            >
              {submitMessage.type === 'success' ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold">{submitMessage.type === 'success' ? 'Success!' : 'Error'}</p>
                <p className="text-xs mt-0.5">{submitMessage.text}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Card */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800/80 rounded-xl shadow-lg hover:shadow-xl dark:shadow-2xl p-3 md:p-5 border border-gray-200 dark:border-gray-700/50 backdrop-blur-sm transition-shadow"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 md:space-y-4"
            >
              {currentStepComponents.map((component, index) => (
                <FormField
                  key={component.key}
                  component={component}
                  value={formData[component.key] || ''}
                  onChange={(value) => handleInputChange(component.key, value)}
                  error={errors[component.key]}
                  index={index}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-2 mt-4 md:mt-5">
            {currentStep > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handlePrevious}
                disabled={isSubmitting || loading}
                className="flex-1 px-3 md:px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold text-xs md:text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-1"
              >
                <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Back</span>
              </motion.button>
            )}
            
            {currentStep < totalSteps - 1 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleNext}
                disabled={isSubmitting || loading}
                className={`flex-1 px-3 md:px-4 py-2 bg-gradient-to-r from-[#ff6600] to-orange-500 text-white font-semibold text-xs md:text-sm rounded-lg hover:from-orange-700 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-1 ${
                  currentStep === 0 ? 'w-full' : ''
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || loading}
                className="flex-1 px-3 md:px-4 py-2 bg-gradient-to-r from-[#ff6600] to-orange-500 text-white font-semibold text-xs md:text-sm rounded-lg hover:from-orange-700 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-1"
              >
                {isSubmitting || loading ? (
                  <>
                    <Loader className="w-3 h-3 animate-spin" />
                    <span className="hidden sm:inline">Submitting...</span>
                  </>
                ) : (
                  'Submit'
                )}
              </motion.button>
            )}
          </div>
        </motion.form>
      </div>
    </div>
  );
};

/**
 * Export the dynamic form component for use in pages
 */
export default memo(DynamicAQSForm);
