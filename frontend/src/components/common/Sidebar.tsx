import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faFileAlt, faBriefcase, faBookmark, faCog, faSignOutAlt, faUpload } from '@fortawesome/free-solid-svg-icons';
import { auth } from '../../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Sidebar = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);


  return (
    <aside className="w-48 bg-gray-200 h-screen p-4 flex flex-col justify-between">
      <ul>
        <li className="mb-4 flex items-center">
          <FontAwesomeIcon icon={faHome} className="mr-2" />
          <Link to="/">Home</Link>
        </li>
        {user && (
          <li className="mb-4 flex items-center">
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            <Link to="/dashboard">Dashboard</Link>
          </li>
        )}

        

        <li className="mb-4 flex items-center">
          <FontAwesomeIcon icon={faUpload} className="mr-2" />
          <Link to="/upload">Upload</Link>
        </li>
        <li className="mb-4 flex items-center">
          <FontAwesomeIcon icon={faBookmark} className="mr-2" />
          <Link to="/results">Matches</Link>
        </li>


        {user && (
          <>
            <li className="mb-4 flex items-center">
              <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
              <Link to="/resumes">Resumes</Link>
            </li>
            <li className="mb-4 flex items-center">
              <FontAwesomeIcon icon={faCog} className="mr-2" />
              <Link to="/settings">Settings</Link>
            </li>
          </>
        )}
      </ul>

    </aside>
  );
};

export default Sidebar;
