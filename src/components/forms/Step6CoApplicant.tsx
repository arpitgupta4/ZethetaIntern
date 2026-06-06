import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step6Schema } from '../../schemas/validationSchemas';
import { useFormContext } from '../../context/FormContext';
import { Users } from 'lucide-react';

type Step6Data = {
  hasCoApplicant: boolean;
  coApplicantName?: string;
  coApplicantPan?: string;
};

export const Step6CoApplicant: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();

  const { register, watch, handleSubmit, formState: { errors } } = useForm<Step6Data>({
    resolver: zodResolver(step6Schema),
    defaultValues: {
      hasCoApplicant: formData?.hasCoApplicant || false,
      coApplicantName: formData?.coApplicantName || '',
      coApplicantPan: formData?.coApplicantPan || '',
    },
  });

  const hasCoApp = watch('hasCoApplicant');

  const onSubmit = (data: Step6Data) => {
    updateFormData(data);
    nextStep();
  };

  // --- THE UX SKIPPER LOGIC ---
  const isPersonalLoan = formData?.loanType === 'Personal';
  const isAmountHigh = Number(formData?.loanAmount) > 500000;
  const isStepRequired = isPersonalLoan && isAmountHigh;

  if (!isStepRequired) {
    return (
      <div className="text-center py-10 animate-in fade-in">
        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="text-gray-400" size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Co-Applicant Not Required</h2>
        <p className="text-gray-500 mt-2 mb-8 max-w-sm mx-auto">
          Based on your loan criteria, a co-applicant is not legally required. You can skip this step.
        </p>
        <div className="flex gap-4 justify-center max-w-xs mx-auto">
          <button type="button" onClick={prevStep} className="w-1/3 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">Back</button>
          <button type="button" onClick={() => { updateFormData({ hasCoApplicant: false }); nextStep(); }} className="w-2/3 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition shadow-md">Skip to Step 7</button>
        </div>
      </div>
    );
  }

  // --- STANDARD RENDER ---
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md mx-auto">
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
         <p className="text-sm text-blue-800 font-medium">
           Because your personal loan exceeds ₹5,00,000, you have the option to add a co-applicant to improve approval odds.
         </p>
      </div>

      <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
        <input type="checkbox" {...register('hasCoApplicant')} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
        <span className="font-medium text-gray-700">Include a Co-Applicant</span>
      </label>

      {hasCoApp && (
        <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300 border-t border-gray-200 pt-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Co-Applicant Full Name</label>
            <input type="text" {...register('coApplicantName')} placeholder="e.g. Jane Doe" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.coApplicantName && <p className="text-red-500 text-xs mt-1">{errors.coApplicantName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Co-Applicant PAN</label>
            <input type="text" {...register('coApplicantPan')} placeholder="ABCDE1234F" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 uppercase" />
            {errors.coApplicantPan && <p className="text-red-500 text-xs mt-1">{errors.coApplicantPan.message}</p>}
          </div>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button type="button" onClick={prevStep} className="w-1/3 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Back</button>
        <button type="submit" className="w-2/3 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md">Save & Continue</button>
      </div>
    </form>
  );
};