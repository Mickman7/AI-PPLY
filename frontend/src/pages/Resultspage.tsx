import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Define backend response structure
interface AnalysisResult {
  match_score: number;
  overview: {
    matches: string;
    gaps: string;
  };
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

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <main className="flex flex-col items-center mt-12 max-w-2xl w-full">
        <h1 className="text-2xl font-semibold mb-6">Analysis Results</h1>

        {/* Match Score */}
        <div className="w-full mb-6 p-4 border rounded-lg shadow-sm bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Match Score</h2>
          <p className="text-blue-600 text-3xl font-bold">
            {result.match_score}%
          </p>
        </div>

        {/* Matches Section */}
        <div className="w-full mb-6 p-4 border rounded-lg shadow-sm bg-green-50">
          <h2 className="text-lg font-semibold mb-2 text-green-700">Matches</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {result.overview.matches}
          </p>
        </div>

        {/* Gaps Section */}
        <div className="w-full p-4 border rounded-lg shadow-sm bg-red-50">
          <h2 className="text-lg font-semibold mb-2 text-red-700">Gaps</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {result.overview.gaps}
          </p>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Upload Another Resume
        </button>
      </main>
    </div>
  );
};

export default ResultsPage;
