import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { useResume } from "../context/ResumeContext";

// Define backend response structure
interface FeedbackItem {
  text: string;
  type: "positive" | "warning" | "critical";
}

interface CategoryResult {
  score: number;
  feedback: FeedbackItem[];
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
  const { clearResumeData } = useResume();

  const result = location.state?.result as AnalysisResult | undefined;

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
    return null; // Prevent rendering if navigation is triggered
  }

  const categories = [
    { key: "tone_style", title: "Tone & Style", color: "text-purple-700" },
    { key: "content", title: "Content", color: "text-indigo-700" },
    { key: "structure", title: "Structure", color: "text-teal-700" },
    { key: "skills", title: "Skills", color: "text-orange-700" },
  ] as const;

  // Function to get the appropriate icon based on feedback type
  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case "positive":
        return "✅"; // Green check
      case "warning":
        return "⚠️"; // Amber warning
      case "critical":
        return "❌"; // Red X
      default:
        return "•";
    }
  };

  // Function to get text color based on feedback type
  const getFeedbackColor = (type: string) => {
    switch (type) {
      case "positive":
        return "text-green-700";
      case "warning":
        return "text-yellow-700";
      case "critical":
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

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
                  <h4 className="font-medium text-gray-800 mb-3">Feedback</h4>
                  <ul className="space-y-2">
                    {result[key].feedback.map((item, index) => (
                      <li 
                        key={index} 
                        className={`flex items-start ${getFeedbackColor(item.type)}`}
                      >
                        <span className="mr-2 mt-1">{getFeedbackIcon(item.type)}</span>
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
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