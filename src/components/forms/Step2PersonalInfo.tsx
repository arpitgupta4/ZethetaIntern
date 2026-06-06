import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step2Schema } from '../../schemas/validationSchemas';
import { useFormContext } from '../../context/FormContext';

type Step2Data = {
  fullName: string;
  dob: string;
};

export const Step2PersonalInfo: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();

  const { register, handleSubmit, formState: { errors } } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      fullName: formData.fullName || '',
      dob: formData.dob || '',
    },
  });

  const onSubmit = (data: Step2Data) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (As per PAN)</label>
        <input 
          type="text" 
          {...register('fullName')} 
          placeholder="John Doe"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
        <input 
          type="date" 
          {...register('dob')} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
        <p className="text-xs text-gray-400 mt-1">Must be exactly 21 years or older.</p>
      </div>

      <div className="flex gap-4">
        <button type="button" onClick={prevStep} className="w-1/3 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Back
        </button>
        <button type="submit" className="w-2/3 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
          Save & Continue
        </button>
      </div>
    </form>
  );
};