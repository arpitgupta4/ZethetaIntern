import { useEffect, useState } from 'react';
import { FormData } from '../context/FormContext';

const STORAGE_KEY = 'lendswift_form_state';
const SECRET = 'LendSwift_AES_256_Secret_Key'; // In a real app, this goes in .env

// --- Web Crypto API Utility Functions ---
const getCryptoKey = async () => {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.digest('SHA-256', enc.encode(SECRET));
  return crypto.subtle.importKey('raw', keyMaterial, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
};

const encryptData = async (data: string): Promise<string> => {
  try {
    const key = await getCryptoKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(data));
    
    // Combine IV and Encrypted data into a single Base64 string for storage
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error("Encryption failed:", error);
    return "";
  }
};

const decryptData = async (encryptedBase64: string): Promise<string> => {
  try {
    const key = await getCryptoKey();
    const combined = new Uint8Array(atob(encryptedBase64).split('').map(c => c.charCodeAt(0)));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (error) {
    console.error("Decryption failed:", error);
    return "";
  }
};

// --- The React Hook ---
export const useAutoSave = (formData: FormData, updateFormData: (data: Partial<FormData>) => void) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isRestored, setIsRestored] = useState(false);

  // 1. Attempt to restore data when the app first loads
  useEffect(() => {
    const loadSavedData = async () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const decrypted = await decryptData(saved);
        if (decrypted) {
          try {
            const parsedData = JSON.parse(decrypted);
            updateFormData(parsedData);
            console.log('Previous session restored safely.');
          } catch (e) {
            console.error('Failed to parse saved data');
          }
        }
      }
      setIsRestored(true); // Mark as restored so we can start overwriting safely
    };
    loadSavedData();
  }, []); // Empty dependency array = runs once on mount

  // 2. Auto-save loop (Every 30 Seconds)
  useEffect(() => {
    if (!isRestored) return; // Prevent overwriting with empty state before load

    const autoSaveInterval = setInterval(async () => {
      const encrypted = await encryptData(JSON.stringify(formData));
      if (encrypted) {
        localStorage.setItem(STORAGE_KEY, encrypted);
        setLastSaved(new Date());
      }
    }, 30000); // 30,000 ms = 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [formData, isRestored]);

  return { lastSaved };
};