import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step4Schema } from '../../schemas/validationSchemas';
import { useFormContext } from '../../context/FormContext';
import { Loader2, MapPin } from 'lucide-react';

type Step4Data = {
  pinCode: string;
  city: string;
  state: string;
};

const mockPinDatabase: Record<string, { city: string; state: string }> = {
  '110001': { city: 'New Delhi', state: 'Delhi' },
  '400001': { city: 'Mumbai', state: 'Maharashtra' },
  '560001': { city: 'Bengaluru', state: 'Karnataka' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu' },
  '700001': { city: 'Kolkata', state: 'West Bengal' },
};

export const Step4Address: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();
  const [isLookingUp, setIsLookingUp] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      pinCode: formData?.pinCode || '',
      city: formData?.city || '',
      state: formData?.state || '',
    },
  });

  const pinValue = watch('pinCode');

  useEffect(() => {
    const fetchLocation = async () => {
      if (pinValue?.length === 6) {
        setIsLookingUp(true);
        
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const location = mockPinDatabase[pinValue];
        if (location) {
          setValue('city', location.city, { shouldValidate: true });
          setValue('state', location.state, { shouldValidate: true });
        } else {
          setValue('city', '');
          setValue('state', '');
        }
        setIsLookingUp(false);
      }
    };

    fetchLocation();
  }, [pinValue, setValue]);

  const onSubmit = (data: Step4Data) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md mx-auto">
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
        <div className="relative flex items-center">
          <MapPin className="absolute left-3 text-gray-400" size={20} />
          <input 
            type="text" 
            {...register('pinCode')} 
            placeholder="e.g., 400001"
            maxLength={6}
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          {isLookingUp && <Loader2 className="absolute right-3 animate-spin text-blue-500" size={20} />}
        </div>
        {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode.message}</p>}
        <p className="text-xs text-gray-400 mt-1">Try: 110001, 400001, or 560001</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input 
            type="text" 
            {...register('city')} 
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none text-gray-600"
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <input 
            type="text" 
            {...register('state')} 
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none text-gray-600"
          />
          {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
        </div>
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