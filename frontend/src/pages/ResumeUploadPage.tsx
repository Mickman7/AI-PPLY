import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadCard from "../components/common/UploadCard";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/Scan.json";
import { useResume } from "../context/ResumeContext"; // Import the context hook

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

const ResumeUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { resumeData, setResumeData } = useResume(); // Use the context

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Use the values from context instead of local state
  const selectedFile = resumeData.selectedFile;
  const jobText = resumeData.jobText;

  const handleFileSelected = (file: File | null) => {
    setResumeData({ ...resumeData, selectedFile: file });
  };

  const handleJobTextChange = (text: string) => {
    setResumeData({ ...resumeData, jobText: text });
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !jobText.trim()) {
      console.error("Missing file or job description");
      alert("Please select a file and enter job description");
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);
    formData.append("job_text", jobText);

    try {
      console.log("Sending request...");
      setIsLoading(true);

      const response = await fetch("http://localhost:8000/api/upload-text", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`Failed to analyze: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log("Analysis Result:", result);

      // Navigate to results page with the result data
      navigate("/results", { state: { result } });
    } catch (error) {
      console.error("Error analyzing resume:", error);
      alert("Analysis failed. Check console for details.");
    } finally {
      setIsLoading(false); // Ensure loader is hidden
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center relative">
      {/* Loader overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="w-64 h-64">
            <Lottie animationData={loadingAnimation} loop={true} />
          </div>
          <p className="absolute bottom-20 text-lg font-semibold text-gray-700">
            Analyzing your resume...
          </p>
        </div>
      )}

      <main className="flex flex-col items-center mt-12 w-full">
        <h1 className="text-2xl font-semibold mb-6">Upload Your Resume</h1>
        <p className="text-gray-600 mb-4">
          Drag and drop your resume here, or click to upload. Supported formats: PDF, DOCX, TXT.
        </p>

        {/* Pass both the callback and the current file */}
        <UploadCard onFileSelected={handleFileSelected} file={selectedFile} />

        {/* Job Description Section */}
        <section className="mt-12 w-full max-w-xl">
          <h2 className="text-xl font-semibold mb-4">Paste Job Description</h2>
          <textarea
            className="w-full h-40 border border-gray-300 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste the job description text here..."
            value={jobText}
            onChange={(e) => handleJobTextChange(e.target.value)}
          />
        </section>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className={`mt-6 px-6 py-2 rounded text-white ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Analyze Resume
        </button>
      </main>
    </div>
  );
};

export default ResumeUploadPage;