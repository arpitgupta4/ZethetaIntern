import React from 'react';
import { FormProvider, useFormContext } from './context/FormContext';
import { Stepper } from './components/layout/Stepper';
import { Step1LoanDetails } from './components/forms/Step1LoanDetails';

const FormContent = () => {
  const { currentStep } = useFormContext();
  return currentStep === 1 ? <Step1LoanDetails /> : <div>Other Steps...</div>;
};

function App() {
  return (
    <FormProvider>
      <div className="min-h-screen bg-slate-50 p-12">
        <Stepper />
        <FormContent />
      </div>
    </FormProvider>
  );
}

export default App;