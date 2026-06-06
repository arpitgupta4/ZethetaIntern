import React from 'react';
import { FormProvider, useFormContext } from './context/FormContext';
import { useAutoSave } from './hooks/useAutoSave';

// We create an inner component to use the context hooks
const FormOrchestrator = () => {
  const { formData, updateFormData, currentStep } = useFormContext();
  
  // Initialize the auto-save engine!
  useAutoSave(formData, updateFormData);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">LendSwift Application</h1>
        
        {/* Temporary UI to prove state works */}
        <div className="p-4 bg-blue-50 text-blue-800 rounded-lg mb-6">
          <p>Current Step: {currentStep} of 8</p>
          <p className="text-sm mt-2 opacity-70">
            (Check your browser console to see the auto-save triggering every 30 seconds, or look at LocalStorage in the Application tab!)
          </p>
        </div>
      </div>
    </div>
  );
};

// The main App component wraps everything in the Provider
function App() {
  return (
    <FormProvider>
      <FormOrchestrator />
    </FormProvider>
  );
}

export default App;