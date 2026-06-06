import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step3Schema } from '../../schemas/validationSchemas';
import { useFormContext } from '../../context/FormContext';
import { CheckCircle2, Loader2 } from 'lucide-react';

type Step3Data = { panNumber: string; aadhaarNumber: string; };

export const Step3KYC: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();
  const [isVerifyingPan, setIsVerifyingPan] = useState(false);
  const [isVerifyingAadhaar, setIsVerifyingAadhaar] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: { 
      panNumber: formData?.panNumber || '', 
      aadhaarNumber: formData?.aadhaarNumber || '' 
    },
  });

  const panValue = watch('panNumber');
  const aadhaarValue = watch('aadhaarNumber');

  const verifyPanAPI = async () => {
    if (errors.panNumber || !panValue) return;
    setIsVerifyingPan(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateFormData({ panVerified: true });
    setIsVerifyingPan(false);
  };

  const verifyAadhaarAPI = async () => {
    if (errors.aadhaarNumber || !aadhaarValue) return;
    setIsVerifyingAadhaar(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateFormData({ aadhaarVerified: true });
    setIsVerifyingAadhaar(false);
  };

  const onSubmit = (data: Step3Data) => {
    if (!formData.panVerified || !formData.aadhaarVerified) {
      alert("Please verify both documents."); 
      return;
    }
    updateFormData(data); 
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md mx-auto">
      // PAN Section
<div className="bg-white p-4 rounded-xl border border-gray-200">
  <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
  <div className="flex gap-2">
    <input 
      type="text" 
      {...register('panNumber')} 
      disabled={formData?.panVerified} 
      className="w-full p-3 border border-gray-300 rounded-lg uppercase disabled:bg-gray-50 disabled:text-gray-500" 
    />
    <button 
      type="button" 
      onClick={verifyPanAPI} 
      disabled={formData?.panVerified || isVerifyingPan || !!errors.panNumber || !panValue} 
      className="px-4 py-2 bg-slate-800 text-white rounded-lg flex items-center justify-center min-w-[100px]"
    >
      {isVerifyingPan ? <Loader2 className="animate-spin" /> : formData?.panVerified ? <CheckCircle2 className="text-green-400" /> : 'Verify'}
    </button>
  </div>
  {errors.panNumber && <p className="text-red-500 text-xs mt-1">{errors.panNumber.message}</p>}
</div>

// Aadhaar Section
<div className="bg-white p-4 rounded-xl border border-gray-200">
  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
  <div className="flex gap-2">
    <input 
      type="text" 
      {...register('aadhaarNumber')} 
      maxLength={12} 
      disabled={formData?.aadhaarVerified} 
      className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500" 
    />
    <button 
      type="button" 
      onClick={verifyAadhaarAPI} 
      disabled={formData?.aadhaarVerified || isVerifyingAadhaar || !!errors.aadhaarNumber || !aadhaarValue} 
      className="px-4 py-2 bg-slate-800 text-white rounded-lg flex items-center justify-center min-w-[100px]"
    >
       {isVerifyingAadhaar ? <Loader2 className="animate-spin" /> : formData?.aadhaarVerified ? <CheckCircle2 className="text-green-400" /> : 'Verify'}
    </button>
  </div>
  {errors.aadhaarNumber && <p className="text-red-500 text-xs mt-1">{errors.aadhaarNumber.message}</p>}
</div>

      <div className="flex gap-4">
        <button type="button" onClick={prevStep} className="w-1/3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">Back</button>
        <button type="submit" className="w-2/3 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700">Save & Continue</button>
      </div>
    </form>
  );
};