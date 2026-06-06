import React from 'react';
import { FormProvider, useFormContext } from './context/FormContext';
import { useAutoSave } from './hooks/useAutoSave';
import { Stepper } from './components/layout/Stepper';

const FormOrchestrator = () => {
  const { formData, updateFormData, currentStep, nextStep, prevStep } = useFormContext();
  
  // Initialize Auto-Save
  useAutoSave(formData, updateFormData);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">LendSwift</h1>
          <p className="text-gray-500 mt-2">Digital Loan Application</p>
        </div>

        {/* Dynamic Stepper */}
        <Stepper />
        
        {/* Step Content Area (Placeholder for now) */}
        <div className="min-h-[400px] border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center mb-8 bg-gray-50">
          <p className="text-gray-500 font-medium text-lg">
            Form for Step {currentStep} will render here.
          </p>
        </div>

        {/* Temporary Navigation Controls */}
        <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
          <button 
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button 
            onClick={nextStep}
            disabled={currentStep === 8}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Next Step
          </button>
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