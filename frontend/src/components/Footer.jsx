// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="p-4 bg-gray-800 text-white text-center mt-8">
      <p>&copy; {new Date().getFullYear()} TechBlog. All rights reserved.</p>
      <div className="mt-2 space-x-4">
        <Link to="/about" className="hover:underline">
          About
        </Link>
        <Link to="/contact" className="hover:underline">
          Contact
        </Link>
        <Link to="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
