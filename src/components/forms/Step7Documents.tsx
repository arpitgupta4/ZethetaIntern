import React, { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step7Schema } from '../../schemas/validationSchemas';
import { useFormContext } from '../../context/FormContext';
import { UploadCloud, FileCheck, Eraser } from 'lucide-react';

type Step7Data = {
  documentsUploaded: boolean;
  signature: string;
};

export const Step7Documents: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Step7Data>({
    resolver: zodResolver(step7Schema),
    defaultValues: {
      documentsUploaded: formData?.documentsUploaded || false,
      signature: formData?.signature || '',
    },
  });

  // --- HTML5 CANVAS SIGNATURE LOGIC ---
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get correct coordinates for both mouse and touch
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    // Save the canvas drawing as a Base64 string to our form state
    if (canvasRef.current) {
      setValue('signature', canvasRef.current.toDataURL('image/png'), { shouldValidate: true });
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    setValue('signature', '', { shouldValidate: true });
  };

  // Setup Canvas style on load
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#1e293b'; // Slate 800
      }
    }
  }, []);

  // --- FILE UPLOAD MOCK ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setValue('documentsUploaded', true, { shouldValidate: true });
    }
  };

  const onSubmit = (data: Step7Data) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full max-w-md mx-auto animate-in fade-in">
      
      {/* Document Upload Section */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-3">1. Upload KYC Documents</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition relative">
          <input 
            type="file" 
            accept=".pdf, image/jpeg, image/png"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          />
          {fileName ? (
            <div className="flex flex-col items-center text-green-600">
              <FileCheck size={40} className="mb-2" />
              <p className="font-medium">{fileName}</p>
              <p className="text-xs text-gray-500 mt-1">Click to replace</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <UploadCloud size={40} className="mb-2 text-blue-500" />
              <p className="font-medium">Drag & drop or click to upload</p>
              <p className="text-xs mt-1">Supports PDF, JPG, PNG (Max 2MB)</p>
            </div>
          )}
        </div>
        {errors.documentsUploaded && <p className="text-red-500 text-xs mt-2">{errors.documentsUploaded.message}</p>}
      </div>

      {/* E-Signature Section */}
      <div>
        <div className="flex justify-between items-end mb-3">
          <h2 className="text-lg font-bold text-gray-800">2. E-Signature</h2>
          <button type="button" onClick={clearSignature} className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1 transition">
            <Eraser size={14} /> Clear
          </button>
        </div>
        
        <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-inner">
          <canvas
            ref={canvasRef}
            width={400}
            height={200}
            className="w-full cursor-crosshair touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">Draw your signature inside the box above</p>
        {errors.signature && <p className="text-red-500 text-xs mt-1 text-center">{errors.signature.message}</p>}
      </div>

      <div className="flex gap-4 pt-4">
        <button type="button" onClick={prevStep} className="w-1/3 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Back</button>
        <button type="submit" className="w-2/3 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md">Review Application</button>
      </div>
    </form>
  );
};