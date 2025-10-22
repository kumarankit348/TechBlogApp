import { useState, useContext } from "react";
import { registerUser } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
    location: "",
    gender: "",
    accountLevel: "bronze",
  });
  const [profileImage, setProfileImage] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = { ...form };

      // --- Upload profile picture first if selected ---
      if (profileImage) {
        const fd = new FormData();
        fd.append("profilePicture", profileImage);

        const uploadRes = await axios.post(
          "/api/v1/users/upload-profile-picture",
          fd,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (uploadRes.data.status === "success") {
          payload.profilePicture = uploadRes.data.profilePicture;
        }
      }

      // --- Register user ---
      const { data } = await registerUser(payload);

      if (!data.token) throw new Error("No token returned from backend");

      const userData = {
        id: data._id,
        username: data.username,
        email: data.email,
        role: data.role,
        profilePicture: data.profilePicture,
        bio: data.bio,
        location: data.location,
        gender: data.gender,
        accountLevel: data.accountLevel,
      };

      login(userData, data.token);
      navigate("/");
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side background */}
      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="w-full flex items-center justify-center bg-gradient-to-t from-black/70 via-black/30 to-transparent px-6">
          <h1 className="text-5xl font-extrabold text-white text-center leading-snug drop-shadow-lg">
            Join <span className="text-yellow-400">TechBlog</span> Today
          </h1>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-50">
        <form
          className="bg-white shadow-xl rounded-2xl p-8 w-96"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Create Your Account
          </h2>

          {/* Username */}
          <div className="flex items-center border rounded-lg mb-4 px-3 py-2">
            <FaUser className="text-gray-400 mr-2" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="flex-grow outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center border rounded-lg mb-4 px-3 py-2">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="flex-grow outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center border rounded-lg mb-4 px-3 py-2">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="flex-grow outline-none"
              required
            />
          </div>

          {/* Bio */}
          <textarea
            name="bio"
            placeholder="Tell us about yourself"
            value={form.bio}
            onChange={handleChange}
            className="w-full border rounded-lg mb-4 px-3 py-2"
          />

          {/* Location */}
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="w-full border rounded-lg mb-4 px-3 py-2"
          />

          {/* Gender */}
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full border rounded-lg mb-4 px-3 py-2"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="prefer not to say">Prefer not to say</option>
          </select>

          {/* Account Level */}
          <select
            name="accountLevel"
            value={form.accountLevel}
            onChange={handleChange}
            className="w-full border rounded-lg mb-4 px-3 py-2"
          >
            <option value="bronze">Bronze</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
          </select>

          {/* Profile Picture */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded-lg mb-4 px-3 py-2"
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Register
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/" className="text-indigo-600 font-semibold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
