import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type FormContextType = {
  formData: any;
  updateFormData: (newData: any) => void;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Try to load saved data from LocalStorage first!
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('lendswift_form_state');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [currentStep, setCurrentStep] = useState(1);

  const updateFormData = (newData: any) => {
    setFormData((prev: any) => ({ ...prev, ...newData }));
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  return (
    <FormContext.Provider value={{ formData, updateFormData, currentStep, nextStep, prevStep }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) throw new Error('useFormContext must be used within FormProvider');
  return context;
};