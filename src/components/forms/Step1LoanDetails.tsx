import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema } from '../../schemas/validationSchemas';
import { useFormContext } from '../../context/FormContext';

type Step1Data = { loanType: 'Personal' | 'Home' | 'Business'; loanAmount: number; loanTenure: number; };

export const Step1LoanDetails: React.FC = () => {
  const { formData, updateFormData, nextStep } = useFormContext();
  const { register, handleSubmit, formState: { errors } } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      loanType: (formData?.loanType as any) || 'Personal',
      loanAmount: formData?.loanAmount || undefined,
      loanTenure: formData?.loanTenure || undefined,
    },
  });

  const onSubmit = (data: Step1Data) => { updateFormData(data); nextStep(); };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Loan Type</label>
        <select {...register('loanType')} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="Personal">Personal Loan</option>
          <option value="Home">Home Loan</option>
          <option value="Business">Business Loan</option>
        </select>
        {errors.loanType && <p className="text-red-500 text-xs mt-1">{errors.loanType.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount (₹)</label>
        <input type="number" {...register('loanAmount')} placeholder="e.g. 500000" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        {errors.loanAmount && <p className="text-red-500 text-xs mt-1">{errors.loanAmount.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Loan Tenure (Months)</label>
        <input type="number" {...register('loanTenure')} placeholder="e.g. 24" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        {errors.loanTenure && <p className="text-red-500 text-xs mt-1">{errors.loanTenure.message}</p>}
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700">
        Save & Continue
      </button>
    </form>
  );
};