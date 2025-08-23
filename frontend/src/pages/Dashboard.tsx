import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-blue-100 p-8 rounded-xl shadow-lg">
        <h5 className="text-sm font-medium text-gray-500">Friday, August 2nd</h5>
        <h2 className="text-3xl font-bold text-gray-800 mt-1">Good Morning, Sarah Chen.</h2>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white p-8 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-6">
          <button className="bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700">
            Upload Resume
          </button>
          <button className="bg-gray-200 text-gray-800 py-3 rounded-lg shadow-md hover:bg-gray-300">
            View Matches
          </button>
        </div>
      </div>

      {/* Recent Matches */}
      <div className="mt-8 bg-white p-8 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Matches</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-3 text-left">Job Title</th>
              <th className="py-3 text-left">Match Score</th>
              <th className="py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-4 text-gray-800">Senior Full Stack Engineer</td>
              <td className="py-4 text-gray-800">88%</td>
              <td className="py-4 text-gray-500">2 hours ago</td>
            </tr>
            <tr className="border-b">
              <td className="py-4 text-gray-800">Digital Marketing Specialist</td>
              <td className="py-4 text-gray-800">62%</td>
              <td className="py-4 text-gray-500">1 day ago</td>
            </tr>
            <tr className="border-b">
              <td className="py-4 text-gray-800">Data Analyst (Entry Level)</td>
              <td className="py-4 text-gray-800">91%</td>
              <td className="py-4 text-gray-500">2 days ago</td>
            </tr>
            <tr className="border-b">
              <td className="py-4 text-gray-800">Product Manager (FinTech)</td>
              <td className="py-4 text-red-500">45%</td>
              <td className="py-4 text-gray-500">3 days ago</td>
            </tr>
            <tr>
              <td className="py-4 text-gray-800">UX Designer - Mobile Apps</td>
              <td className="py-4 text-gray-800">78%</td>
              <td className="py-4 text-gray-500">4 days ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;