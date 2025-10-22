import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPost, likePost, clapPost, addComment } from "../services/api";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      const { data } = await fetchPost(id);
      setPost(data.singlePost);
    } catch (err) {
      console.error("Failed to fetch post:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    await likePost(id);
    loadPost();
  };

  const handleClap = async () => {
    await clapPost(id);
    loadPost();
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await addComment(id, commentText); // now sends { message: ... }
    setCommentText("");
    loadPost();
  };

  if (loading) return <p className="text-center mt-10">Loading post...</p>;
  if (!post) return <p className="text-center mt-10">Post not found.</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6 mt-6">
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-80 object-cover rounded-lg mb-4"
        />
      )}
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        By {post.author?.username} •{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <p className="text-gray-700 leading-relaxed mb-6">{post.content}</p>

      <div className="flex space-x-6 text-gray-600 text-sm mb-4">
        <span>👏 {post.claps || 0}</span>
        <span>❤️ {post.likes?.length || 0}</span>
        <span>💬 {post.comments?.length || 0}</span>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={handleLike}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          👍 Like
        </button>
        <button
          onClick={handleClap}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          👏 Clap
        </button>
      </div>

      {/* Comments */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Comments</h2>
        {post.comments?.length > 0 ? (
          <ul className="space-y-2">
            {post.comments.map((c) => (
              <li key={c._id} className="p-3 bg-gray-100 rounded-lg text-sm">
                <p>{c.message}</p>
                <span className="text-xs text-gray-500">
                  By {c.author?.username || "Unknown"} on{" "}
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mt-4 flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-grow border rounded-lg px-3 py-2"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
