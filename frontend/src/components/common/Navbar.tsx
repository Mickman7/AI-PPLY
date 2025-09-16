import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig"; 
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/"); // redirect to home after logout
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white text-blue-300 border-b border-gray-200 ">
      <h1 className="text-lg font-bold">AI-PPLY</h1>
      <ul className="flex items-center space-x-4">
        <li><Link to="/">Home</Link></li>

        {/* Dashboard link changes to /upload if user is not logged in */}
        <li>
          <Link to={user ? "/dashboard" : "/upload"}>
            {user ? "Dashboard" : "Upload"}
          </Link>
        </li>

        {!isAuthPage && (
          <div className="flex justify-evenly items-center gap-2">
            {!user ? (
              <>
                <li><Link to="/login">Login</Link></li>
                <li className="p-2 border-1 rounded bg-blue-500">
                  <Link to="/signup" className="text-white">Sign Up</Link>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={handleLogout}
                  className="p-2 border-1 rounded bg-red-500 text-white"
                >
                  Logout
                </button>
              </li>
            )}
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
