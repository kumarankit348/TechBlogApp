import { useEffect, useState } from "react";
import { getProfile } from "../services/api";
import Edit from "./Edit"; // import Edit form

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await getProfile();
      setUser(data.user);
    } catch (err) {
      console.error("Failed to load profile:", err.message);
    }
  };

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  if (editMode) {
    return (
      <Edit
        user={user}
        onClose={() => setEditMode(false)}
        reload={loadProfile}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow mt-6">
      <div className="flex items-center space-x-4">
        <img
          src={user.profilePicture || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-24 h-24 rounded-full border"
        />
        <div>
          <h2 className="text-xl font-bold">{user.username}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500">Role: {user.role}</p>
          <p className="text-sm text-gray-500">
            Account Level: {user.accountLevel}
          </p>
          <p className="text-sm text-gray-500">
            Gender: {user.gender || "Not specified"}
          </p>
          <p className="text-sm text-gray-500">
            Verified: {user.isVerified ? "✅ Yes" : "❌ No"}
          </p>
        </div>
      </div>

      <p className="mt-4">{user.bio || "No bio yet"}</p>
      <p className="text-sm text-gray-500">{user.location || "No location"}</p>

      {/* Stats Section */}
      <div className="flex space-x-6 mt-6">
        <div>
          <p className="font-bold">{user.posts?.length || 0}</p>
          <p className="text-gray-500 text-sm">Posts</p>
        </div>
        <div>
          <p className="font-bold">{user.followers?.length || 0}</p>
          <p className="text-gray-500 text-sm">Followers</p>
        </div>
        <div>
          <p className="font-bold">{user.following?.length || 0}</p>
          <p className="text-gray-500 text-sm">Following</p>
        </div>
        <div>
          <p className="font-bold">{user.profileViewers?.length || 0}</p>
          <p className="text-gray-500 text-sm">Profile Views</p>
        </div>
        <div>
          <p className="font-bold">{user.blockedUsers?.length || 0}</p>
          <p className="text-gray-500 text-sm">Blocked</p>
        </div>
      </div>

      <button
        onClick={() => setEditMode(true)}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Edit Profile
      </button>
    </div>
  );
}
