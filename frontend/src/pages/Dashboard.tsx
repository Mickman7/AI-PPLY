import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useUser } from '../context/UserContext';

interface SavedAnalysis {
  id: string;
  resumeName: string;
  jobDescription: string;
  result: {
    match_score: number;
  };
  createdAt: any;
}

const Dashboard = () => {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [loadingAnalyses, setLoadingAnalyses] = useState(true);
  const { userProfile, loading: userLoading } = useUser();

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const q = query(collection(db, 'analyses'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const analysesData: SavedAnalysis[] = [];
        const seenIds = new Set();
        
        querySnapshot.forEach((doc) => {
          if (!seenIds.has(doc.id)) {
            seenIds.add(doc.id);
            analysesData.push({
              id: doc.id,
              ...doc.data(),
            } as SavedAnalysis);
          }
        });
        
        setAnalyses(analysesData);
      } catch (error) {
        console.error('Error fetching analyses:', error);
      } finally {
        setLoadingAnalyses(false);
      }
    };

    fetchAnalyses();
  }, []);

  // Function to extract job title from job description (simple approach)
  const extractJobTitle = (jobDescription: string) => {
    if (!jobDescription) return 'Unknown Position';
    
    // Try to find a job title pattern
    const titleMatch = jobDescription.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Engineer|Developer|Designer|Manager|Analyst|Specialist))/);
    if (titleMatch) return titleMatch[0];
    
    // Fallback: return first few words
    return jobDescription.split(' ').slice(0, 4).join(' ') + '...';
  };

  // Format date relative to now
  const formatRelativeTime = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    
    const date = timestamp.toDate();
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} day${Math.floor(diffInHours / 24) > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  // Get color based on match score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-gray-800';
    return 'text-red-500';
  };

  if (userLoading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="text-center py-8">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-blue-100 p-8 rounded-xl shadow-lg">
        <h5 className="text-sm font-medium text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h5>
        <h2 className="text-3xl font-bold text-gray-800 mt-1">
          Good Morning, {userProfile?.name || 'User'}.
        </h2>
        
        {/* Profile Completion Prompt */}
        {!userProfile?.completedProfile && (
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
            <p className="text-yellow-800">
              Please complete your profile to get the most out of AI-PPLY.
            </p>
            <button 
              onClick={() => window.location.href = '/settings'}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Complete Profile
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white p-8 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-6">
          <button 
            onClick={() => window.location.href = '/upload'}
            className="bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700"
          >
            Upload Resume
          </button>
          <button 
            onClick={() => window.location.href = '/upload'}
            className="bg-gray-200 text-gray-800 py-3 rounded-lg shadow-md hover:bg-gray-300"
          >
            View Matches
          </button>
        </div>
      </div>

      {/* Recent Matches */}
      <div className="mt-8 bg-white p-8 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Matches</h3>
        
        {loadingAnalyses ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading your matches...</p>
          </div>
        ) : analyses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No matches yet. Upload a resume to get started!</p>
            <button 
              onClick={() => window.location.href = '/upload'}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Upload Your First Resume
            </button>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-3 text-left">Job Title</th>
                <th className="py-3 text-left">Match Score</th>
                <th className="py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {analyses.slice(0, 5).map((analysis) => (
                <tr key={analysis.id} className="border-b">
                  <td className="py-4 text-gray-800">
                    {extractJobTitle(analysis.jobDescription)}
                  </td>
                  <td className={`py-4 font-medium ${getScoreColor(analysis.result.match_score)}`}>
                    {analysis.result.match_score}%
                  </td>
                  <td className="py-4 text-gray-500">
                    {formatRelativeTime(analysis.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;