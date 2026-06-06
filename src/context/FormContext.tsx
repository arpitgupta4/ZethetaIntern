import React, { createContext, useContext, useState, useEffect } from 'react';

// Type definitions for multi-step form data
export interface FormData {
  // Step 1: Loan Details
  loanType: 'Personal' | 'Home' | 'Business' | '';
  loanAmount: number;
  loanTenure: number;
  
  // Step 2 & 3 & 4: Personal, KYC & Address
  fullName: string;
  dob: string;
  panNumber: string;
  panVerified: boolean;
  aadhaarNumber: string;
  aadhaarVerified: boolean;
  pinCode: string;
  city: string;
  state: string;

  // Step 5: Employment
  employmentType: 'Salaried' | 'Self-Employed' | 'Business' | '';
  monthlyIncome?: number;
  companyName?: string;
  businessVintage?: number;

  // Step 6: Co-Applicant (Conditional)
  hasCoApplicant: boolean;
  coApplicantName?: string;
  coApplicantPan?: string;

  // Step 7: Docs & Signature
  documentUrl: string;
  signatureData: string; // Base64 signature data string
}

interface FormContextType {
  formData: FormData;
  currentStep: number;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  isStepVisible: (step: number) => boolean;
}

const initialFormState: FormData = {
  loanType: '',
  loanAmount: 0,
  loanTenure: 0,
  fullName: '',
  dob: '',
  panNumber: '',
  panVerified: false,
  aadhaarNumber: '',
  aadhaarVerified: false,
  pinCode: '',
  city: '',
  state: '',
  employmentType: '',
  hasCoApplicant: false,
  documentUrl: '',
  signatureData: '',
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Update dynamic cross-step dependencies inside state
  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Condition to check if Step 6 (Co-applicant) should be shown
  const isStepVisible = (step: number): boolean => {
    if (step === 6) {
      // Step 6 is mandatory if Personal Loan exceeds 5,00,000 INR
      return formData.loanType === 'Personal' && formData.loanAmount > 500000;
    }
    return true;
  };

  const nextStep = () => {
    let next = currentStep + 1;
    while (next <= 8 && !isStepVisible(next)) {
      next++;
    }
    if (next <= 8) setCurrentStep(next);
  };

  const prevStep = () => {
    let prev = currentStep - 1;
    while (prev >= 1 && !isStepVisible(prev)) {
      prev--;
    }
    if (prev >= 1) setCurrentStep(prev);
  };

  return (
    <FormContext.Provider value={{ formData, currentStep, updateFormData, nextStep, prevStep, setStep: setCurrentStep, isStepVisible }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) throw new Error('useFormContext must be used within a FormProvider');
  return context;
};