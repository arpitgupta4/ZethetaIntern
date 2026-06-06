import { z } from 'zod';

// --- Step 1: Loan Details ---
export const step1Schema = z.object({
  loanType: z.enum(['Personal', 'Home', 'Business'], {
    errorMap: () => ({ message: 'Please select a valid loan type' }),
  }),
  loanAmount: z.coerce.number({ invalid_type_error: 'Amount must be a valid number' })
    .min(10000, 'Minimum loan amount is ₹10,000')
    .max(50000000, 'Maximum loan amount is ₹5,00,00,000'),
  loanTenure: z.coerce.number({ invalid_type_error: 'Tenure must be a valid number' })
    .min(6, 'Minimum tenure is 6 months')
    .max(360, 'Maximum tenure is 360 months'),
});

// --- Step 2: Personal Information ---
export const step2Schema = z.object({
  fullName: z.string()
    .min(3, 'Full name must be at least 3 characters long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  dob: z.string().refine((dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 21;
  }, { message: 'Applicant must be exactly 21 years or older.' }),
});

// --- Step 3: Identity Verification (KYC) ---
export const step3Schema = z.object({
  panNumber: z.string()
    .toUpperCase()
    .regex(
      /^[A-Z]{3}[PCHABGJLFT][A-Z][0-9]{4}[A-Z]$/, 
      'PAN 4th character must indicate entity type'
    ),
  aadhaarNumber: z.string()
    .regex(/^\d{12}$/, 'Aadhaar number must be exactly 12 digits long'),
});

// --- Step 4: Address Information ---
export const step4Schema = z.object({
  pinCode: z.string()
    .regex(/^[0-9]{6}$/, 'PIN Code must be exactly 6 digits'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
});

// --- Step 5: Employment & Income ---
export const step5Schema = z.object({
  employmentType: z.enum(['Salaried', 'Self-Employed', 'Business']),
  monthlyIncome: z.coerce.number({ invalid_type_error: 'Income must be a valid number' })
    .min(10000, 'Minimum income is ₹10,000'),
  companyName: z.string().optional(),
  businessVintage: z.coerce.number({ invalid_type_error: 'Vintage must be a number' }).optional(),
});

// --- Step 6: Co-Applicant ---
export const step6Schema = z.object({
  hasCoApplicant: z.boolean().default(false),
  coApplicantName: z.string().optional(),
  coApplicantPan: z.string().toUpperCase().optional(),
})
.refine((data) => !data.hasCoApplicant || (data.coApplicantName && data.coApplicantName.length >= 3), {
  message: "Name must be at least 3 characters", 
  path: ["coApplicantName"]
})
.refine((data) => !data.hasCoApplicant || (data.coApplicantPan && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.coApplicantPan)), {
  message: "Valid PAN format required (e.g., ABCDE1234F)", 
  path: ["coApplicantPan"]
});
// --- Step 7: Documents & E-Signature ---
export const step7Schema = z.object({
  documentsUploaded: z.boolean().refine((val) => val === true, {
    message: "Please upload your required documents",
  }),
  signature: z.string().min(20, "Please provide your e-signature"),
});