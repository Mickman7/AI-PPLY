import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faFileAlt, faBriefcase, faBookmark, faCog, faSignOutAlt, faUpload } from '@fortawesome/free-solid-svg-icons'

const Sidebar = () => {
  return (
    <aside className="w-48 bg-gray-200 h-screen p-4 flex flex-col justify-between">
      <ul>
        <li className="mb-4 flex items-center">
          <FontAwesomeIcon icon={faHome} className="mr-2" />
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className="mb-4 flex items-center">
          <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
          <Link to="/resumes">Resumes</Link>
        </li>
        <li className="mb-4 flex items-center">
          <FontAwesomeIcon icon={faUpload} className="mr-2" />
          <Link to="/upload">Upload</Link>
        </li>
        <li className="mb-4 flex items-center">
          <FontAwesomeIcon icon={faBookmark} className="mr-2" />
          <Link to="/results">Matches</Link>
        </li>
        <li className="flex items-center">
          <FontAwesomeIcon icon={faCog} className="mr-2" />
          <Link to="/settings">Settings</Link>
        </li>
      </ul>
      <button className="mt-auto bg-red-500 text-white py-2 px-4 rounded flex items-center">
        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
        Logout
      </button>
    </aside>
  )
}

export default Sidebar
