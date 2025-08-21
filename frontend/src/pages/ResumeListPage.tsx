import React from 'react'

const ResumeListPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Resumes</h1>
      <ul className="space-y-2">
        <li className="border p-4 rounded shadow">
          <p className="font-semibold">Resume 1</p>
          <p>Uploaded on: 2023-08-21</p>
        </li>
        <li className="border p-4 rounded shadow">
          <p className="font-semibold">Resume 2</p>
          <p>Uploaded on: 2023-08-15</p>
        </li>
      </ul>
    </div>
  )
}

export default ResumeListPage
