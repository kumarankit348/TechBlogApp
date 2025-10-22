import { useEffect, useState } from "react";
import {
  fetchPosts,
  likePost,
  clapPost,
  followUser,
  searchPosts,
} from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // search/filter states
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data } = await fetchPosts();
      setPosts(data.allPosts || []);
    } catch (err) {
      console.error(
        "Failed to fetch posts:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const { data } = await searchPosts({ author, category });
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Search failed:", err.message);
    }
  };

  const handleLike = async (id) => {
    try {
      await likePost(id);
      loadPosts();
    } catch (err) {
      console.error("Like failed:", err.message);
    }
  };

  const handleClap = async (id) => {
    try {
      await clapPost(id);
      loadPosts();
    } catch (err) {
      console.error("Clap failed:", err.message);
    }
  };

  const handleFollow = async (authorId) => {
    try {
      await followUser(authorId);
      alert("You followed this user!");
    } catch (err) {
      console.error("Follow failed:", err.message);
    }
  };

  const handleShare = (id) => {
    const url = `${window.location.origin}/post/${id}`;
    navigator.clipboard.writeText(url);
    alert("Post link copied to clipboard!");
  };

  // sort posts before rendering
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "likes")
      return (b.likes?.length || 0) - (a.likes?.length || 0);
    if (sortBy === "claps") return (b.claps || 0) - (a.claps || 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (loading) return <p className="text-center mt-10">Loading posts...</p>;

  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
        <div className="bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/memphis-mini.png')] bg-fixed bg-cover bg-center min-h-screen py-8 px-4">
          <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
            {/* 🔝 Hero Section */}
            <div className="mb-10 w-full rounded-xl shadow-lg overflow-hidden">
              {/* Background with gradient + image */}
              <div className="relative bg-gradient-to-r from-pink-200 via-purple-200 to-orange-200">
                <div className="absolute inset-0 opacity-20 bg-[url('https://source.unsplash.com/1600x500/?abstract,pattern,design')] bg-cover bg-center"></div>

                {/* Content */}
                <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 text-center">
                  {/* Heading */}
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 leading-tight">
                    Share Your <span className="text-purple-700">Ideas</span>,
                    <br /> Inspire the{" "}
                    <span className="text-pink-600">World</span>
                  </h1>
                  {/* Subheading */}
                  <p className="mt-4 text-lg sm:text-xl text-gray-700 font-medium">
                    A modern blogging platform to connect creators and readers
                    ✍️
                  </p>

                  {/* Search + Filter */}
                  <form
                    onSubmit={handleSearch}
                    className="mt-8 flex flex-wrap gap-3 justify-center"
                  >
                    <input
                      type="text"
                      placeholder="Search by author..."
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="border rounded-lg px-3 py-2 w-52"
                    />

                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="border rounded-lg px-3 py-2 w-40"
                    >
                      <option value="">All Categories</option>
                      <option value="tech">Tech</option>
                      <option value="lifestyle">Lifestyle</option>
                      <option value="education">Education</option>
                      <option value="business">Business</option>
                    </select>

                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      onClick={loadPosts}
                      className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                    >
                      Reset
                    </button>
                  </form>

                  {/* Sort + Create Post */}
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Sort by:
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                      >
                        <option value="latest">Latest</option>
                        <option value="likes">Most Liked</option>
                        <option value="claps">Most Clapped</option>
                      </select>
                    </div>

                    <Link
                      to="/create-post"
                      className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-purple-700 transition"
                    >
                      ➕ Create Post
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 📝 Posts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg hover:-translate-y-1 transition duration-200 cursor-pointer flex flex-col"
                  onClick={() => navigate(`/post/${post._id}`)}
                >
                  {/* Post Image */}
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-56 object-cover"
                    />
                  )}

                  <div className="p-4 flex flex-col flex-grow">
                    {/* Category badge */}
                    {post.category && (
                      <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full mb-2 self-start">
                        {post.category}
                      </span>
                    )}

                    {/* Header */}
                    <div className="flex items-center mb-3 justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                          {post.author?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <p className="font-semibold">
                            {post.author?.username}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollow(post.author._id);
                        }}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        + Follow
                      </button>
                    </div>

                    {/* Title + Content */}
                    <h2 className="text-lg font-bold mb-2 text-gray-800">
                      {post.title || "Untitled Post"}
                    </h2>
                    <p className="text-gray-600 text-sm flex-grow line-clamp-3">
                      {post.content || "No description available."}
                    </p>

                    {/* Stats */}
                    <div className="flex justify-between text-xs text-gray-500 mt-4 mb-2">
                      <span>👏 {post.claps || 0}</span>
                      <span>❤️ {post.likes?.length || 0}</span>
                      <span>💬 {post.comments?.length || 0}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-around border-t pt-2 text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(post._id);
                        }}
                        className="hover:text-blue-500 transition"
                      >
                        👍 Like
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClap(post._id);
                        }}
                        className="hover:text-purple-500 transition"
                      >
                        👏 Clap
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/post/${post._id}`);
                        }}
                        className="hover:text-green-500 transition"
                      >
                        💬 Comment
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(post._id);
                        }}
                        className="hover:text-pink-500 transition"
                      >
                        ↗️ Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
