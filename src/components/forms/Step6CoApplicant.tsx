import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { step6Schema } from '../../schemas/validationSchemas';
import { useFormContext } from '../../context/FormContext';
import { Users } from 'lucide-react';

type Step6Data = z.infer<typeof step6Schema>;
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
      <div className="py-10 text-center animate-in fade-in">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
          <Users className="text-gray-400" size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Co-Applicant Not Required</h2>
        <p className="max-w-sm mx-auto mt-2 mb-8 text-gray-500">
          Based on your loan criteria, a co-applicant is not legally required. You can skip this step.
        </p>
        <div className="flex justify-center max-w-xs gap-4 mx-auto">
          <button type="button" onClick={prevStep} className="w-1/3 py-3 text-gray-700 transition border border-gray-300 rounded-lg hover:bg-gray-50">Back</button>
          <button type="button" onClick={() => { updateFormData({ hasCoApplicant: false }); nextStep(); }} className="w-2/3 py-3 font-semibold text-white transition bg-blue-600 rounded-lg shadow-md hover:bg-blue-700">Skip to Step 7</button>
        </div>
      </div>
    );
  }

  // --- STANDARD RENDER ---
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto space-y-6">
      
      <div className="p-4 border border-blue-100 rounded-lg bg-blue-50">
         <p className="text-sm font-medium text-blue-800">
           Because your personal loan exceeds ₹5,00,000, you have the option to add a co-applicant to improve approval odds.
         </p>
      </div>

      <label className="flex items-center p-4 space-x-3 transition border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
        <input type="checkbox" {...register('hasCoApplicant')} className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
        <span className="font-medium text-gray-700">Include a Co-Applicant</span>
      </label>

      {hasCoApp && (
        <div className="pt-5 space-y-5 duration-300 border-t border-gray-200 animate-in fade-in slide-in-from-top-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Co-Applicant Full Name</label>
            <input type="text" {...register('coApplicantName')} placeholder="e.g. Jane Doe" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.coApplicantName && <p className="mt-1 text-xs text-red-500">{errors.coApplicantName.message}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Co-Applicant PAN</label>
            <input type="text" {...register('coApplicantPan')} placeholder="ABCDE1234F" className="w-full p-3 uppercase border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.coApplicantPan && <p className="mt-1 text-xs text-red-500">{errors.coApplicantPan.message}</p>}
          </div>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button type="button" onClick={prevStep} className="w-1/3 py-3 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50">Back</button>
        <button type="submit" className="w-2/3 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg shadow-md hover:bg-blue-700">Save & Continue</button>
      </div>
    </form>
  );
};