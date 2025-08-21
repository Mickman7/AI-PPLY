import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-white text-blue-300 border-b border-gray-200">
      <h1 className="text-xl font-bold">AI-PPLY</h1>
      <ul className="flex items-center space-x-4">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">About</Link></li>
        <div className="flex justify-evenly items-center gap-2">
            <li><Link to="/login">Login</Link></li>
            <li className="p-2 border-1 rounded bg-blue-500"><Link to="/login" className="text-white">Sign Up</Link></li>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
