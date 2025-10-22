import React from "react";
import { Link } from "react-router-dom";
import Register from "../Users/Register";
import PublicPosts from "../Posts/PublicPosts";

const Homepage = () => {
  return (
    <div>
      {/* Hero + Call-to-Action Buttons */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 py-20">
        <div className="container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center">
          {/* Left content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left mt-10 lg:mt-0">
            <span className="inline-block bg-green-500 text-white text-xs font-semibold uppercase tracking-wider py-1 px-3 rounded-full shadow-md mb-5">
              Welcome
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Build. Share. <span className="text-green-600">Connect.</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-10">
              Join our growing community where learners, developers, and
              creators exchange ideas, grow skills, and inspire others to
              innovate.
            </p>

            {/* Buttons for Register and Login */}
            <div className="flex justify-center lg:justify-start gap-4 mb-10">
              <Link
                to="/register"
                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition"
              >
                Login
              </Link>
            </div>

            <ul className="space-y-4 text-left inline-block">
              <li className="flex items-start">
                <span className="flex items-center justify-center w-7 h-7 bg-green-500 rounded-full text-white mt-1 mr-3">
                  <i className="fa-solid fa-check text-sm"></i>
                </span>
                <p className="text-gray-700 text-lg">
                  ✨ Discover trending discussions and new perspectives.
                </p>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center w-7 h-7 bg-green-500 rounded-full text-white mt-1 mr-3">
                  <i className="fa-solid fa-check text-sm"></i>
                </span>
                <p className="text-gray-700 text-lg">
                  🌍 Connect with passionate developers worldwide.
                </p>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center w-7 h-7 bg-green-500 rounded-full text-white mt-1 mr-3">
                  <i className="fa-solid fa-check text-sm"></i>
                </span>
                <p className="text-gray-700 text-lg">
                  🚀 Share your projects and get instant feedback.
                </p>
              </li>
            </ul>
          </div>

          {/* Right illustration */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <img
              src="https://cdn.dribbble.com/users/1162077/screenshots/3848914/programmer.gif"
              alt="Developer illustration"
              className="max-w-sm md:max-w-md lg:max-w-lg rounded-xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Register Form Section */}
      {/* <section className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            Join the Community
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            Create your free account and start connecting with like-minded
            developers around the world.
          </p>

          <div className="max-w-md mx-auto"><Register /></div>
        </div>
      </section> */}

      {/* Public Posts */}
      <div className="mt-0 py-16 bg-gray-50">
        <PublicPosts />
      </div>
    </div>
  );
};

export default Homepage;
