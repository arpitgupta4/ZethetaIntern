import React from 'react';
import { FormProvider, useFormContext } from './context/FormContext';
import { useAutoSave } from './hooks/useAutoSave';
import { Stepper } from './components/layout/Stepper';

// Form Steps
import { Step1LoanDetails } from './components/forms/Step1LoanDetails';
import { Step2PersonalInfo } from './components/forms/Step2PersonalInfo';
import { Step3KYC } from './components/forms/Step3KYC';
import { Step4Address } from './components/forms/Step4Address';
import { Step5Employment } from './components/forms/Step5Employment'; 

const FormOrchestrator = () => {
  const { formData, updateFormData, currentStep } = useFormContext();
  useAutoSave(formData, updateFormData);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <Step1LoanDetails />;
      case 2: return <Step2PersonalInfo />;
      case 3: return <Step3KYC />;
      case 4: return <Step4Address />;
      case 5: return <Step5Employment />; 
      default: return (
        <div className="text-center py-10">
          <p className="text-gray-500 font-medium">Step {currentStep} coming soon...</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">LendSwift</h1>
          <p className="text-gray-500 mt-2">Digital Loan Application</p>
        </div>
        <Stepper />
        <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-100 min-h-[400px]">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <FormProvider>
      <FormOrchestrator />
    </FormProvider>
  );
}