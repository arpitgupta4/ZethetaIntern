import React from 'react';
import { useFormContext } from '../../context/FormContext';

export const Step8Review: React.FC = () => {
  const { formData, prevStep } = useFormContext();

  const handleFinalSubmit = () => {
    // In a real app, you would send this to your API here.
    console.log("Submitting Application:", formData);
    alert("Application Submitted Successfully!");
  };

  return (
    <div className="space-y-6 w-full max-w-md mx-auto animate-in fade-in">
      <h2 className="text-2xl font-bold text-gray-900">Application Summary</h2>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        {Object.entries(formData).map(([key, value]) => {
          // Skip internal state/verification flags for the display
          if (['panVerified', 'aadhaarVerified', 'signature'].includes(key)) return null;
          
          return (
            <div key={key} className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className="font-semibold text-gray-900">
                {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 pt-4">
        <button type="button" onClick={prevStep} className="w-1/3 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">Back</button>
        <button type="button" onClick={handleFinalSubmit} className="w-2/3 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition shadow-md">Submit Application</button>
      </div>
    </div>
  );
};