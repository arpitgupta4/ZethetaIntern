import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { Check } from 'lucide-react';

const stepNames = [
  "Loan Details", "Personal Info", "KYC", "Address",
  "Employment", "Co-Applicant", "Uploads", "Review"
];

export const Stepper: React.FC = () => {
  const { currentStep, isStepVisible } = useFormContext();

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-200 -z-10" />
        
        {stepNames.map((name, index) => {
          const stepNumber = index + 1;
          
          // If the step shouldn't be visible (like Step 6 for small loans), skip it
          if (!isStepVisible(stepNumber)) return null;

          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;

          return (
            <div key={name} className="flex flex-col items-center bg-white px-2 z-10">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors
                ${isActive ? 'border-blue-600 bg-blue-50 text-blue-600' : 
                  isCompleted ? 'border-green-500 bg-green-500 text-white' : 
                  'border-gray-200 bg-white text-gray-400'}`}
              >
                {isCompleted ? <Check size={16} /> : stepNumber}
              </div>
              <span className={`text-xs mt-2 hidden sm:block font-medium
                ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}
              >
                {name}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Overall Progress Bar */}
      <div className="mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStep / 8) * 100}%` }}
        />
      </div>
    </div>
  );
};