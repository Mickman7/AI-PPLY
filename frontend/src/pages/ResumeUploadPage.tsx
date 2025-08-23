import React from 'react'

const ResumeUploadPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <main className="flex flex-col items-center mt-12">
        <h1 className="text-2xl font-semibold mb-6">Upload Your Resume</h1>
        <p className="text-gray-600 mb-4">Drag and drop your resume here, or click to upload. Supported formats: PDF, DOCX.</p>
        <div className="w-full max-w-lg border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p>Drag & drop your resume file here</p>
          <button className="text-blue-500 hover:underline">or browse to upload</button>
        </div>
        
        {/* Job Description Section */}
        <section className="mt-12 w-full max-w-xl">
          <h2 className="text-xl font-semibold mb-4">Paste Job Description</h2>
          <p className="text-gray-600 mb-4">Paste the job description text below for analysis.</p>
          <textarea 
            className="w-full h-40 border border-gray-300 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Paste the job description text here..."
          ></textarea>
        </section>

        {/* Single Analyze Button */}
        <button className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Analyze Resume
        </button>
      </main>
    </div>
  )
}

export default ResumeUploadPage