import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPrivatePostsAction,
  // you can add actions for like, clap, follow later if available in redux
} from "../../redux/slices/posts/postSlices";
import { Link, useNavigate } from "react-router-dom";

export default function PostList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { posts, loading, error } = useSelector((state) => state?.posts);

  // search/filter states
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    dispatch(fetchPrivatePostsAction());
  }, [dispatch]);

  // 🔍 filter + search (client-side since redux doesn’t have API here)
  const filteredPosts = posts?.filter((post) => {
    const byAuthor = author
      ? post?.author?.username?.toLowerCase().includes(author.toLowerCase())
      : true;
    const byCategory = category ? post?.category?.name === category : true;
    return byAuthor && byCategory;
  });

  // 🔽 sort posts
  const sortedPosts = [...(filteredPosts || [])].sort((a, b) => {
    if (sortBy === "likes")
      return (b.likes?.length || 0) - (a.likes?.length || 0);
    if (sortBy === "claps") return (b.claps || 0) - (a.claps || 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (loading) return <p className="text-center mt-10">Loading posts...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">{error?.message}</p>;

  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
        {/* 🔝 Hero Section */}
        <div className="mb-10 w-full rounded-xl shadow-lg overflow-hidden">
          <div className="relative bg-gradient-to-r from-pink-200 via-purple-200 to-orange-200">
            <div className="absolute inset-0 opacity-20 bg-[url('https://source.unsplash.com/1600x500/?abstract,pattern,design')] bg-cover bg-center"></div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 leading-tight">
                Read <span className="text-purple-700">Trending Posts</span>
                <br /> Inspire the{" "}
                <span className="text-pink-600">Community</span>
              </h1>
              <p className="mt-4 text-lg sm:text-xl text-gray-700 font-medium">
                A modern blogging platform to connect creators and readers ✍️
              </p>

              {/* 🔍 Search + Filter */}
              <form
                onSubmit={(e) => e.preventDefault()}
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
                  <option value="Tech">Tech</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Education">Education</option>
                  <option value="Business">Business</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setAuthor("");
                    setCategory("");
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                >
                  Reset
                </button>
              </form>

              {/* 🔽 Sort */}
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
          {sortedPosts?.length === 0 ? (
            <p className="text-center text-gray-600 col-span-full">
              No posts found.
            </p>
          ) : (
            sortedPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg hover:-translate-y-1 transition duration-200 cursor-pointer flex flex-col"
                onClick={() =>
                  navigate(`/posts/${post._id}`, { state: { post } })
                }
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-56 object-cover"
                  />
                )}

                <div className="p-4 flex flex-col flex-grow">
                  {post.category?.name && (
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full mb-2 self-start">
                      {post.category?.name}
                    </span>
                  )}

                  {/* Author */}
                  <div className="flex items-center mb-3 justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                        {post.author?.username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="font-semibold">{post.author?.username}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-lg font-bold mb-2 text-gray-800">
                    {post.title || "Untitled Post"}
                  </h2>
                  <p className="text-gray-600 text-sm flex-grow line-clamp-3">
                    {post.content?.substring(0, 150) ||
                      "No description available."}
                  </p>

                  {/* Stats */}
                  <div className="flex justify-between text-xs text-gray-500 mt-4 mb-2">
                    <span>👏 {post.claps || 0}</span>
                    <span>❤️ {post.likes?.length || 0}</span>
                    <span>💬 {post.comments?.length || 0}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
