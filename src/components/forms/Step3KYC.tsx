import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step3Schema } from '../../schemas/validationSchemas';
import { useFormContext } from '../../context/FormContext';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

type Step3Data = {
  panNumber: string;
  aadhaarNumber: string;
};

export const Step3KYC: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();
  
  // Local state for our simulated API loading spinners
  const [isVerifyingPan, setIsVerifyingPan] = useState(false);
  const [isVerifyingAadhaar, setIsVerifyingAadhaar] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      panNumber: formData.panNumber || '',
      aadhaarNumber: formData.aadhaarNumber || '',
    },
  });

  const panValue = watch('panNumber');
  const aadhaarValue = watch('aadhaarNumber');

  // --- Simulated API Functions ---
  const verifyPanAPI = async () => {
    if (errors.panNumber || !panValue) return; // Don't verify if schema is invalid
    setIsVerifyingPan(true);
    // Simulate a 1.5-second network request to a government server
    await new Promise((resolve) => setTimeout(resolve, 1500));
    updateFormData({ panVerified: true });
    setIsVerifyingPan(false);
  };

  const verifyAadhaarAPI = async () => {
    if (errors.aadhaarNumber || !aadhaarValue) return;
    setIsVerifyingAadhaar(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    updateFormData({ aadhaarVerified: true });
    setIsVerifyingAadhaar(false);
  };

  const onSubmit = (data: Step3Data) => {
    // Prevent moving to the next step if they haven't clicked "Verify"
    if (!formData.panVerified || !formData.aadhaarVerified) {
      alert("Please verify both PAN and Aadhaar before continuing.");
      return;
    }
    updateFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md mx-auto">
      
      {/* PAN Input Group */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            {...register('panNumber')} 
            placeholder="ABCDE1234F"
            disabled={formData.panVerified} // Lock input once verified
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase disabled:bg-gray-100 outline-none"
          />
          <button
            type="button"
            onClick={verifyPanAPI}
            disabled={formData.panVerified || !!errors.panNumber || !panValue || isVerifyingPan}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 transition flex items-center min-w-[100px] justify-center"
          >
            {isVerifyingPan ? <Loader2 size={18} className="animate-spin" /> : 
             formData.panVerified ? <CheckCircle2 size={18} className="text-green-400" /> : 'Verify'}
          </button>
        </div>
        {errors.panNumber && (
          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
            <AlertCircle size={12} /> {errors.panNumber.message}
          </p>
        )}
      </div>

      {/* Aadhaar Input Group */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            {...register('aadhaarNumber')} 
            placeholder="1234 5678 9012"
            maxLength={12}
            disabled={formData.aadhaarVerified}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 outline-none"
          />
          <button
            type="button"
            onClick={verifyAadhaarAPI}
            disabled={formData.aadhaarVerified || !!errors.aadhaarNumber || !aadhaarValue || isVerifyingAadhaar}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 transition flex items-center min-w-[100px] justify-center"
          >
            {isVerifyingAadhaar ? <Loader2 size={18} className="animate-spin" /> : 
             formData.aadhaarVerified ? <CheckCircle2 size={18} className="text-green-400" /> : 'Verify'}
          </button>
        </div>
        {errors.aadhaarNumber && (
          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
            <AlertCircle size={12} /> {errors.aadhaarNumber.message}
          </p>
        )}
      </div>

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