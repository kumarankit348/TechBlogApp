import { useEffect, useState } from "react";
import axios from "axios";
import Edit from "./Edit";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/v1/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched user:", res.data.user);
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  if (loading) {
    return <p>Loading Dashboard...</p>;
  }

  if (!user) {
    return (
      <p className="text-red-500">No user data found. Please log in again.</p>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded-lg mt-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.username}</h1>

      {/* Profile picture */}
      <img
        src={user.profilePicture || "https://via.placeholder.com/150"}
        alt="Profile"
        className="w-32 h-32 rounded-full mb-4"
      />

      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Bio:</strong> {user.bio || "No bio added yet"}
      </p>
      <p>
        <strong>Location:</strong> {user.location || "Not specified"}
      </p>
      <p>
        <strong>Gender:</strong> {user.gender || "Not specified"}
      </p>
      <p>
        <strong>Account Level:</strong> {user.accountLevel}
      </p>

      <button
        onClick={() => setEditing(true)}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
      >
        Edit Profile
      </button>

      {/* Edit Profile Modal */}
      {editing && (
        <Edit
          user={user}
          onClose={() => setEditing(false)}
          reload={() => window.location.reload()}
        />
      )}
    </div>
  );
}
