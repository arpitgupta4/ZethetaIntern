import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step5Schema } from '../../schemas/validationSchemas';
import { useFormContext } from '../../context/FormContext';

type Step5Data = {
  employmentType: 'Salaried' | 'Self-Employed' | 'Business';
  monthlyIncome: number;
  companyName?: string;
  businessVintage?: number;
};

export const Step5Employment: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();

  const { register, watch, handleSubmit, formState: { errors } } = useForm<Step5Data>({
    resolver: zodResolver(step5Schema),
    defaultValues: {
      employmentType: (formData?.employmentType as 'Salaried' | 'Self-Employed' | 'Business') || 'Salaried',
      monthlyIncome: formData?.monthlyIncome || undefined,
      companyName: formData?.companyName || '',
      businessVintage: formData?.businessVintage || undefined,
    },
  });

  // Watch this field to dynamically show/hide inputs!
  const empType = watch('employmentType');

  const onSubmit = (data: Step5Data) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md mx-auto">
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
        <select {...register('employmentType')} className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="Salaried">Salaried</option>
          <option value="Self-Employed">Self-Employed</option>
          <option value="Business">Business</option>
        </select>
        {errors.employmentType && <p className="text-red-500 text-xs mt-1">{errors.employmentType.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income (₹)</label>
        <input type="number" {...register('monthlyIncome')} placeholder="e.g. 50000" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
        {errors.monthlyIncome && <p className="text-red-500 text-xs mt-1">{errors.monthlyIncome.message}</p>}
      </div>

      {/* Dynamic Render: Only shows if Salaried */}
      {empType === 'Salaried' && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input type="text" {...register('companyName')} placeholder="e.g. Acme Corp" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
        </div>
      )}

      {/* Dynamic Render: Only shows if Self-Employed or Business */}
      {empType !== 'Salaried' && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Vintage (Years)</label>
          <input type="number" {...register('businessVintage')} placeholder="e.g. 3" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.businessVintage && <p className="text-red-500 text-xs mt-1">{errors.businessVintage.message}</p>}
        </div>
      )}

      <div className="flex gap-4 pt-4">
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