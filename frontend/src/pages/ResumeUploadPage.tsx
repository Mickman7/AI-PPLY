import React, { useState } from 'react'
import UploadCard from '../components/common/UploadCard'
import { useNavigate } from "react-router-dom"

const ResumeUploadPage = () => {
  // Track uploaded file
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  // Track pasted job description
  const [jobText, setJobText] = useState<string>("")
  // Track result from backend
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Function to send data to backend
  const handleAnalyze = async () => {
    if (!resumeFile || !jobText) {
      alert("Please upload a resume and paste a job description")
      return
    }
  
    setLoading(true)
  
    try {
      const formData = new FormData()
      formData.append("resume", resumeFile)
      formData.append("job_text", jobText)
  
      const response = await fetch("http://localhost:8000/compare/upload-text", {
        method: "POST",
        body: formData,
      })
  
      const data = await response.json()

      console.log("Backend response:", data)
  
      // Navigate to /matches and pass the result as state
      navigate("/results", { state: { result: data } })
    } catch (error) {
      console.error("Error analyzing:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <main className="flex flex-col items-center mt-12">
        <h1 className="text-2xl font-semibold mb-6">Upload Your Resume</h1>
        <p className="text-gray-600 mb-4">
          Drag and drop your resume here, or click to upload. Supported formats: PDF, DOCX.
        </p>

        {/* Pass setResumeFile to UploadCard */}
        <UploadCard setFile={setResumeFile} />

        {/* Job Description Section */}
        <section className="mt-12 w-full max-w-xl">
          <h2 className="text-xl font-semibold mb-4">Paste Job Description</h2>
          <p className="text-gray-600 mb-4">
            Paste the job description text below for analysis.
          </p>
          <textarea
            className="w-full h-40 border border-gray-300 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste the job description text here..."
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
          ></textarea>
        </section>

        {/* Single Analyze Button */}
        <button
          onClick={handleAnalyze}
          className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {/* Display result */}
        {result && (
          <div className="mt-6 p-4 border rounded w-full max-w-xl">
            <p><strong>Match Score:</strong> {result.match_score}%</p>
            <p><strong>Overview:</strong> {result.overview}</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default ResumeUploadPage
