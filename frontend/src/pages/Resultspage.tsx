import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";


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

  const result = location.state?.result as AnalysisResult | undefined;

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-xl font-semibold mb-4">No results available</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  const categories = [
    { key: "tone_style", title: "Tone & Style", color: "text-purple-700" },
    { key: "content", title: "Content", color: "text-indigo-700" },
    { key: "structure", title: "Structure", color: "text-teal-700" },
    { key: "skills", title: "Skills", color: "text-orange-700" },
  ] as const;

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

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mt-8 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Upload Another Resume
        </button>
      </main>
    </div>
  );
};

export default ResultsPage;
