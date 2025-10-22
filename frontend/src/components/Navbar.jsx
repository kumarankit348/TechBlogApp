import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="flex justify-between items-center p-4 bg-gray-700 text-white">
      <Link to="/" className="text-2xl font-bold">
        TechBlog
      </Link>

      {user ? (
        <div className="flex items-center space-x-4">
          {/* Profile */}
          <Link
            to="/profile"
            className="flex items-center space-x-2 hover:underline"
          >
            <img
              src={user?.profilePicture || "https://via.placeholder.com/40"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-semibold text-white">
              {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
            </span>
          </Link>

          {/* Logout */}
          <button
            onClick={logout}
            className="ml-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <Link to="/login" className="hover:underline">
            Login
          </Link>
          <Link to="/register" className="hover:underline">
            Register
          </Link>
        </div>
      )}
    </header>
  );
}
