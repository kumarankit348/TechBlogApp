import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, getProfile, sendVerificationEmail } from "../services/api";

export default function CreatePost() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const { data } = await getProfile();
        console.log("Profile API response:", data);
        setVerified(data?.user?.isVerified || false);
      } catch (err) {
        console.error("Failed to check profile:", err);
      }
    };
    checkVerification();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verified) {
      alert("⚠️ Please verify your email before creating a post.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("category", form.category);
    if (form.image) formData.append("image", form.image);

    // 🔎 Debug log all FormData entries
    for (let [key, value] of formData.entries()) {
      console.log("FormData:", key, value);
    }

    try {
      setLoading(true);
      await createPost(formData);
      alert("✅ Post created successfully!");
      navigate("/");
    } catch (err) {
      console.error("Post creation failed:", err.response?.data || err.message);
      alert("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerification = async () => {
    try {
      await sendVerificationEmail();
      alert("📧 Verification email sent! Please check your inbox.");
    } catch (err) {
      console.error("Failed to send verification email:", err);
      alert("Error sending verification email.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-10">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center text-purple-600">
          ✍️ Create New Post
        </h1>

        {!verified && (
          <div className="mb-4 text-center">
            <p className="text-red-600 mb-2">
              ⚠️ Your email is not verified. Please verify before posting.
            </p>
            <button
              onClick={handleSendVerification}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
            >
              Verify Email 📧
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Post title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <textarea
            name="content"
            placeholder="Write your content..."
            value={form.content}
            onChange={handleChange}
            className="w-full border p-2 rounded h-28"
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />

          <button
            type="submit"
            disabled={loading || !verified}
            className={`w-full py-2 rounded font-bold text-white ${
              verified
                ? "bg-purple-500 hover:bg-purple-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Uploading..." : "Publish Post 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}
