import React from "react"
import { useLocation, useNavigate } from "react-router-dom"

const ResultsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { result } = location.state || {}

  // Redirect to upload page if no result is passed
  if (!result) {
    navigate("/upload")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Resume Analysis Results</h1>

      <div className="bg-white p-6 rounded shadow-md w-full max-w-xl">
        <p className="text-lg mb-2">
          <strong>Match Score:</strong> {result.match_score}%
        </p>

        <div className="mb-4">
          <h2 className="font-semibold mb-1">What Matches Well:</h2>
          <p>{result.overview.matches}</p>
        </div>

        <div>
          <h2 className="font-semibold mb-1">What’s Missing / Weak:</h2>
          <p>{result.overview.gaps}</p>
        </div>
      </div>

      <button
        onClick={() => navigate("/upload")}
        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Analyze Another Resume
      </button>
    </div>
  )
}

export default ResultsPage
