import React from 'react';
import { useForm } from 'react-hook-form';
import { useFormContext } from '../../context/FormContext';

export const Step5Employment: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();
  const { register, watch, handleSubmit } = useForm({
    defaultValues: formData,
  });

  const empType = watch('employmentType');

  const onSubmit = (data: any) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <select {...register('employmentType')} className="w-full p-3 border rounded">
        <option value="Salaried">Salaried</option>
        <option value="Self-Employed">Self-Employed</option>
        <option value="Business">Business</option>
      </select>

      <input type="number" {...register('monthlyIncome')} placeholder="Monthly Income" className="w-full p-3 border rounded" />

      {empType === 'Salaried' ? (
        <input {...register('companyName')} placeholder="Company Name" className="w-full p-3 border rounded" />
      ) : (
        <input type="number" {...register('businessVintage')} placeholder="Years in Business" className="w-full p-3 border rounded" />
      )}

      <div className="flex gap-4">
        <button type="button" onClick={prevStep} className="px-4 py-2 border rounded">Back</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Continue</button>
      </div>
    </form>
  );
};