import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  return (
    <nav className="flex justify-between items-center p-4 bg-white text-blue-300 border-b border-gray-200">
      <h1 className="text-lg font-bold">AI-PPLY</h1>
      <ul className="flex items-center space-x-4">
        {/* <div className="flex justify-between items-center"> */}
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dashboard">About</Link></li>
          {!isAuthPage && (
            <div className="flex justify-evenly items-center gap-2">
              <li><Link to="/login">Login</Link></li>
              <li className="p-2 border-1 rounded bg-blue-500">
                <Link to="/signup" className="text-white">Sign Up</Link>
              </li>
            </div>
          )}
      {/* </div> */}
      </ul>
    </nav>
  );
};

export default Navbar;
