// contexts/ResumeContext.tsx
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface ResumeData {
  selectedFile: File | null;
  jobText: string;
}

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  clearResumeData: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resumeData, setResumeData] = useState<ResumeData>({
    selectedFile: null,
    jobText: '',
  });

  const clearResumeData = () => {
    setResumeData({ selectedFile: null, jobText: '' });
  };

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData, clearResumeData }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};