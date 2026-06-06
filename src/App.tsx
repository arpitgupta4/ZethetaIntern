import React from 'react';
import { FormProvider, useFormContext } from './context/FormContext';
import { useAutoSave } from './hooks/useAutoSave';
import { Stepper } from './components/layout/Stepper';

// Import our new forms!
import { Step1LoanDetails } from './components/forms/Step1LoanDetails';
import { Step2PersonalInfo } from './components/forms/Step2PersonalInfo';

const FormOrchestrator = () => {
  const { formData, updateFormData, currentStep } = useFormContext();
  useAutoSave(formData, updateFormData);

  // Dynamic rendering function based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <Step1LoanDetails />;
      case 2: return <Step2PersonalInfo />;
      default: return (
        <div className="text-center py-10">
          <p className="text-gray-500 font-medium">Form for Step {currentStep} coming soon...</p>
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
        
        {/* Render the active form here */}
        <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
          {renderStepContent()}
        </div>

      </div>
    </div>
  );
};

function App() {
  return (
    <FormProvider>
      <FormOrchestrator />
    </FormProvider>
  );
}

export default App;