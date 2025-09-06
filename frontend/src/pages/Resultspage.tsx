// ResultsPage.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { useResume } from "../context/ResumeContext";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Import your Firebase config

// Define backend response structure
interface CategoryResult {
  score: number;
  matches: string;
  gaps: string;
}

interface AnalysisResult {
  match_score: number;
  tone_style: CategoryResult;
  content: CategoryResult;
  structure: CategoryResult;
  skills: CategoryResult;
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resumeData, clearResumeData } = useResume();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const result = location.state?.result as AnalysisResult | undefined;

  // Save analysis to Firestore
  const saveAnalysis = async () => {
    if (!result || !resumeData.selectedFile) return;
    
    setSaving(true);
    setSaveError(null);
    
    try {
      await addDoc(collection(db, "analyses"), {
        resumeName: resumeData.selectedFile.name,
        jobDescription: resumeData.jobText,
        result: result,
        createdAt: Timestamp.now(),
      });
      
      setSaved(true);
      console.log("Analysis saved to Firestore");
    } catch (error) {
      console.error("Error saving analysis:", error);
      setSaveError("Failed to save analysis. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Save automatically when page loads
  useEffect(() => {
    if (result && resumeData.selectedFile && !saved) {
      saveAnalysis();
    }
  }, [result, resumeData]);

  // Validate the result object and its properties
  useEffect(() => {
    if (
      !result ||
      typeof result.match_score !== "number" ||
      !result.tone_style ||
      !result.content ||
      !result.structure ||
      !result.skills
    ) {
      alert("Invalid or incomplete analysis data. Please try again.");
      navigate("/upload");
    }
  }, [result, navigate]);

  if (
    !result ||
    typeof result.match_score !== "number" ||
    !result.tone_style ||
    !result.content ||
    !result.structure ||
    !result.skills
  ) {
    return null;
  }

  const categories = [
    { key: "tone_style", title: "Tone & Style", color: "text-purple-700" },
    { key: "content", title: "Content", color: "text-indigo-700" },
    { key: "structure", title: "Structure", color: "text-teal-700" },
    { key: "skills", title: "Skills", color: "text-orange-700" },
  ] as const;

  const handleEditPrevious = () => {
    navigate("/upload");
  };

  const handleNewUpload = () => {
    clearResumeData();
    navigate("/upload");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <main className="flex flex-col items-center mt-12 max-w-5xl w-full">
        <h1 className="text-2xl font-semibold mb-6">Analysis Results</h1>

        {/* Save Status */}
        {saving && (
          <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">
            Saving your analysis...
          </div>
        )}
        
        {saveError && (
          <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
            {saveError}
            <button 
              onClick={saveAnalysis}
              className="ml-2 bg-red-600 text-white px-2 py-1 rounded text-sm"
            >
              Retry
            </button>
          </div>
        )}
        
        {saved && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
            Analysis saved successfully!
          </div>
        )}

        {/* Overall Match Score */}
        <div className="w-full mb-6 p-4 rounded-lg shadow-sm bg-gray-100">
          <div className="mb-2 p-4">
            <h2 className="text-lg font-semibold mb-2">Overall Match Score</h2>
            <p className="text-blue-600 text-4xl font-bold">
              {result.match_score}%
            </p>
          </div>

          {/* Scores Summary */}
          <div className="flex flex-col gap-2 w-full mb-8">
            {categories.map(({ key, title, color }) => (
              <div
                key={key}
                className="p-4 rounded-lg shadow-sm bg-gray-50 flex flex-row justify-between "
              >
                <h3 className={`text-md font-semibold mb-2 ${color}`}>{title}</h3>
                <p className="text-blue-600 text-xl font-bold">
                  {result[key].score}/100
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Details Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {categories.map(({ key, title, color }) => (
            <AccordionItem key={key} value={key}>
              <AccordionTrigger>
                <span className={`font-semibold ${color}`}>{title} Details</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                  <h4 className="font-medium text-green-700 mb-1">Matches</h4>
                  <p className="text-gray-700 whitespace-pre-line mb-4">
                    {result[key].matches}
                  </p>
                  <h4 className="font-medium text-red-700 mb-1">Gaps</h4>
                  <p className="text-gray-700 whitespace-pre-line">
                    {result[key].gaps}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleEditPrevious}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Edit Previous Upload
          </button>
          <button
            onClick={handleNewUpload}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Upload New Resume
          </button>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;