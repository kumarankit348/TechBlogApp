import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
      <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-white font-semibold text-lg mb-3">About Us</h2>
          <p className="text-sm leading-6">
            We are a community-driven platform sharing knowledge, tutorials, and
            insights on web development, software engineering, and emerging tech
            trends.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-white font-semibold text-lg mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="/posts" className="hover:text-white">
                Posts
              </a>
            </li>
            <li>
              <a href="/login" className="hover:text-white">
                Login
              </a>
            </li>
            <li>
              <a href="/register" className="hover:text-white">
                Register
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-white font-semibold text-lg mb-3">Contact</h2>
          <ul className="space-y-2 text-sm">
            <li>Email: support@devconnect.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Address: 45, Tech Park, Bhopal, India</li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="text-white font-semibold text-lg mb-3">Follow Us</h2>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-blue-400">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="hover:text-sky-400">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="hover:text-pink-500">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="hover:text-red-500">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} DevConnect. All rights reserved.
      </div>
    </footer>
  );
}
