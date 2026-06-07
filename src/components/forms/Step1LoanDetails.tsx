import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema } from '../../schemas/validationSchemas';
import { useFormContext } from '../../context/FormContext';

type Step1Data = z.infer<typeof step1Schema>;
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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto space-y-6">
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Loan Type</label>
        <select {...register('loanType')} className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          <option value="Personal">Personal Loan</option>
          <option value="Home">Home Loan</option>
          <option value="Business">Business Loan</option>
        </select>
        {errors.loanType && <p className="mt-1 text-xs text-red-500">{errors.loanType.message}</p>}
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Loan Amount (₹)</label>
        <input type="number" {...register('loanAmount')} placeholder="e.g. 500000" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        {errors.loanAmount && <p className="mt-1 text-xs text-red-500">{errors.loanAmount.message}</p>}
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Loan Tenure (Months)</label>
        <input type="number" {...register('loanTenure')} placeholder="e.g. 24" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        {errors.loanTenure && <p className="mt-1 text-xs text-red-500">{errors.loanTenure.message}</p>}
      </div>

      <button type="submit" className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
        Save & Continue
      </button>
    </form>
  );
};