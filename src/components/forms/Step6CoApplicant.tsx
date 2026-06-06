import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step6Schema } from '../../schemas/validationSchemas';
import { useFormContext } from '../../context/FormContext';

type Step6Data = {
  hasCoApplicant: boolean;
  coApplicantName?: string;
  coApplicantPan?: string;
};

export const Step6CoApplicant: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Step6Data>({
    resolver: zodResolver(step6Schema),
    defaultValues: {
      hasCoApplicant: formData?.hasCoApplicant ?? false,
      coApplicantName: formData?.coApplicantName ?? '',
      coApplicantPan: formData?.coApplicantPan ?? '',
    },
  });

  // Watch the checkbox to conditionally show/hide co-applicant fields
  const hasCoApplicant = watch('hasCoApplicant');

  const onSubmit = (data: Step6Data) => {
    // If they unchecked the box, clear out co-applicant details
    const cleanedData = data.hasCoApplicant
      ? data
      : { hasCoApplicant: false, coApplicantName: '', coApplicantPan: '' };
    updateFormData(cleanedData);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md mx-auto">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Co-Applicant Details</h2>
        <p className="text-sm text-gray-500">
          A co-applicant can help improve your loan eligibility.
        </p>
      </div>

      {/* Toggle Checkbox */}
      <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
        <input
          type="checkbox"
          {...register('hasCoApplicant')}
          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <div>
          <p className="font-medium text-gray-800">Include a Co-Applicant</p>
          <p className="text-xs text-gray-400">Required for high-value personal loans</p>
        </div>
      </label>

      {/* Conditionally render co-applicant fields only when checkbox is checked */}
      {hasCoApplicant && (
        <div className="space-y-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Co-Applicant Full Name
            </label>
            <input
              type="text"
              {...register('coApplicantName')}
              placeholder="e.g. Jane Doe"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            {errors.coApplicantName && (
              <p className="text-red-500 text-xs mt-1">{errors.coApplicantName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Co-Applicant PAN Number
            </label>
            <input
              type="text"
              {...register('coApplicantPan')}
              placeholder="ABCDE1234F"
              maxLength={10}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white uppercase"
            />
            {errors.coApplicantPan && (
              <p className="text-red-500 text-xs mt-1">{errors.coApplicantPan.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="w-1/3 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="w-2/3 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          Save &amp; Continue
        </button>
      </div>
    </form>
  );
};