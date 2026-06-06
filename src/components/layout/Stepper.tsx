import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { Check } from 'lucide-react';

const steps = [
  { id: 1, name: 'Loan Details' },
  { id: 2, name: 'Personal Info' },
  { id: 3, name: 'KYC Verification' },
  { id: 4, name: 'Address' },
];

export const Stepper: React.FC = () => {
  const { currentStep } = useFormContext();

  return (
    <div className="flex justify-between items-center w-full mb-8 relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
      {steps.map((step) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        
        return (
          <div key={step.id} className="flex flex-col items-center bg-white px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
              isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
              isCompleted ? 'bg-green-500 text-white' :
              'bg-gray-100 text-gray-400'
            }`}>
              {isCompleted ? <Check size={20} /> : step.id}
            </div>
            <span className={`text-xs mt-2 font-medium hidden sm:block ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
              {step.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};