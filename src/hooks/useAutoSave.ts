import { useEffect } from 'react';

export const useAutoSave = (formData: any, updateFormData: any) => {
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem('lendswift_form_state', JSON.stringify(formData));
    }
  }, [formData]);
};