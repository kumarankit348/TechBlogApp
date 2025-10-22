import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-center text-center md:text-left px-6 py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        {/* Left Content */}
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to <span className="text-yellow-300">TechBlog</span>
          </h1>
          <p className="max-w-xl text-lg md:text-xl mb-8 opacity-90">
            Share your knowledge, connect with developers, and stay updated with
            the latest in technology 🚀
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <Link
              to="/register"
              className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold shadow hover:bg-yellow-300 transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-white/20 border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Right Illustration (changed to tech theme) */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2920/2920244.png"
            alt="Tech blogging"
            className="w-72 md:w-96 drop-shadow-lg"
          />
        </div>
      </section>

      {/* Wrap Features + CTA in flex-grow so footer sticks */}
      <div className="flex-grow">
        {/* Features Section */}
        <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <div className="bg-white shadow-md p-8 rounded-xl hover:shadow-lg transition">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1006/1006363.png"
              alt="Read Blogs"
              className="w-20 mx-auto mb-4"
            />
            <h3 className="text-xl font-bold mb-3">📚 Read Blogs</h3>
            <p className="text-gray-600">
              Discover blogs written by developers, engineers, and tech
              enthusiasts.
            </p>
          </div>
          <div className="bg-white shadow-md p-8 rounded-xl hover:shadow-lg transition">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
              alt="Write & Share"
              className="w-20 mx-auto mb-4"
            />
            <h3 className="text-xl font-bold mb-3">✍️ Write & Share</h3>
            <p className="text-gray-600">
              Express your thoughts, tutorials, or ideas and share them with the
              world.
            </p>
          </div>
          <div className="bg-white shadow-md p-8 rounded-xl hover:shadow-lg transition">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2092/2092660.png"
              alt="Connect"
              className="w-20 mx-auto mb-4"
            />
            <h3 className="text-xl font-bold mb-3">🤝 Connect</h3>
            <p className="text-gray-600">
              Follow other creators, comment on blogs, and grow your tech
              network.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gray-900 text-white py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-gray-300 mb-6">
            Join thousands of developers sharing and learning every day.
          </p>
          <Link
            to="/register"
            className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            Join Now
          </Link>
        </section>
      </div>
    </div>
  );
}
