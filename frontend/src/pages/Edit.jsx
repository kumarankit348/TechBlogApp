import { useState } from "react";
import axios from "axios";

export default function Edit({ user, onClose, reload }) {
  const [formData, setFormData] = useState(user);
  const [profileImage, setProfileImage] = useState(null);
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Save button clicked ✅");
    try {
      let updatedFormData = { ...formData };

      // --- Upload new image if selected ---
      if (profileImage) {
        const fd = new FormData();
        fd.append("profilePicture", profileImage);

        console.log("Uploading image...", profileImage);

        const res = await axios.put(
          "/api/v1/users/upload-profile-picture", // ✅ match backend route
          fd,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Upload response:", res.data);

        if (res.data.status === "success") {
          updatedFormData.profilePicture = res.data.profilePicture;
        }
      }

      // --- Update profile details ---
      console.log("Submitting profile update:", updatedFormData);

      const result = await axios.put(
        `/api/v1/users/profile/${form._id}`,
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Profile update response:", result.data);

      if (result.data.status === "success") {
        reload();
        onClose();
      } else {
        alert("Profile update failed");
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("Error updating profile. Check console.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-3xl mx-auto bg-white p-6 rounded-lg shadow mt-6"
    >
      <input
        type="text"
        name="username"
        value={formData.username || ""}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="bio"
        placeholder="Your bio"
        value={formData.bio || ""}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="location"
        placeholder="Your location"
        value={formData.location || ""}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      {/* Profile picture */}
      <div>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <select
        name="gender"
        value={formData.gender || ""}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="prefer not to say">Prefer not to say</option>
      </select>

      <select
        name="accountLevel"
        value={formData.accountLevel || "bronze"}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="bronze">Bronze</option>
        <option value="silver">Silver</option>
        <option value="gold">Gold</option>
      </select>

      <div className="flex space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
