import React from 'react'

const UploadCard = () => {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Upload Your Resume</h2>
      <input type="file" className="mb-2" />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>
    </div>
  )
}

export default UploadCard
