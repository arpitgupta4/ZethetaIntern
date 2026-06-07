import { FormProvider, useFormContext } from './context/FormContext';
import { useAutoSave } from './hooks/useAutoSave';
import { Stepper } from './components/layout/Stepper';

// Form Steps
import { Step1LoanDetails } from './components/forms/Step1LoanDetails';
import { Step2PersonalInfo } from './components/forms/Step2PersonalInfo';
import { Step3KYC } from './components/forms/Step3KYC';
import { Step4Address } from './components/forms/Step4Address';
import { Step5Employment } from './components/forms/Step5Employment'; 
import { Step6CoApplicant } from './components/forms/Step6CoApplicant'; 
import { Step7Documents } from './components/forms/Step7Documents'; 
import { Step8Review } from './components/forms/Step8Review'; 
const FormOrchestrator = () => {
  const { formData, currentStep } = useFormContext();
  useAutoSave(formData);
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <Step1LoanDetails />;
      case 2: return <Step2PersonalInfo />;
      case 3: return <Step3KYC />;
      case 4: return <Step4Address />;
      case 5: return <Step5Employment />; 
      case 6: return <Step6CoApplicant />; 
      case 7: return <Step7Documents />;
      case 8: return <Step8Review />;
      default: return (
        <div className="py-10 text-center">
          <p className="font-medium text-gray-500">Step {currentStep} coming soon...</p>
        </div>
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-slate-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl p-8 bg-white shadow-xl rounded-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">LendSwift</h1>
          <p className="mt-2 text-gray-500">Digital Loan Application</p>
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