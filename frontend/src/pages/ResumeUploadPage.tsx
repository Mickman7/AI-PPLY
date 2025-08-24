import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadCard from "../components/common/UploadCard";

// Define backend response structure
interface AnalysisResult {
  match_score: number;
  overview: {
    matches: string;
    gaps: string;
  };
}

const ResumeUploadPage: React.FC = () => {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobText, setJobText] = useState<string>("");

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
  
      const result: AnalysisResult = await response.json();
      console.log("Analysis Result:", result);
  
      navigate("/results", { state: { result } });
      
    } catch (error) {
      console.error("Error analyzing resume:", error);
      alert("Analysis failed. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <main className="flex flex-col items-center mt-12">
        <h1 className="text-2xl font-semibold mb-6">Upload Your Resume</h1>
        <p className="text-gray-600 mb-4">
          Drag and drop your resume here, or click to upload. Supported formats: PDF, DOCX, TXT.
        </p>

        {/* Pass callback for file selection */}
        <UploadCard onFileSelected={setSelectedFile} />

        {/* Job Description Section */}
        <section className="mt-12 w-full max-w-xl">
          <h2 className="text-xl font-semibold mb-4">Paste Job Description</h2>
          <textarea
            className="w-full h-40 border border-gray-300 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste the job description text here..."
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
          />
        </section>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Analyze Resume
        </button>
      </main>
    </div>
  );
};

export default ResumeUploadPage;
