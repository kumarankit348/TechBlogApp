// src/components/Users/PrivateUserProfile.jsx
import { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  getPrivateProfileAction,
  updatePrivateProfileAction,
} from "../../redux/slices/users/userSlices";

export default function PrivateUserProfile() {
  const dispatch = useDispatch();

  // stable selectors
  const token = useSelector(
    (s) => s.users.userAuth?.userInfo?.token,
    shallowEqual
  );
  const user = useSelector((s) => s.users.user, shallowEqual);
  const loading = useSelector((s) => s.users.loading);
  const isUpdating = useSelector((s) => s.users.isUpdating);
  const error = useSelector((s) => s.users.error);

  // local editable state
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [coverPicture, setCoverPicture] = useState("");

  // populate local fields when user becomes available
  useEffect(() => {
    if (user) {
      setUsername(user.username ?? "");
      setBio(user.bio ?? "");
      setProfilePicture(user.profilePicture ?? "");
      setCoverPicture(user.coverPicture ?? "");
    }
  }, [user]);

  // fetch private profile once when token present and we don't already have user/loading
  useEffect(() => {
    if (!token) return; // not logged in
    if (!user && !loading) {
      dispatch(getPrivateProfileAction());
    }
  }, [dispatch, token, user, loading]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePicture(URL.createObjectURL(file));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setCoverPicture(URL.createObjectURL(file));
  };

  const handleSave = () => {
    const payload = { username, bio, profilePicture, coverPicture };
    dispatch(updatePrivateProfileAction(payload));
  };

  // Render states in a single, consistent flow
  if (!token) {
    return (
      <div className="p-6">
        <p className="text-yellow-600">
          You must be logged in to view your profile.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          Failed to load profile: {error.message ?? error}
        </p>
      </div>
    );
  }

  // if token present but user still null (should be rare if thunk worked), show friendly message
  if (!user) {
    return (
      <div className="p-6">
        <p>No profile data available.</p>
      </div>
    );
  }

  // MAIN UI when user exists
  return (
    <div className="flex h-full">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <main className="relative flex-1 overflow-y-auto focus:outline-none xl:order-last">
          <article className="max-w-6xl mx-auto">
            {/* Cover image */}
            <div className="relative">
              <img
                className="h-48 w-full object-cover"
                src={
                  coverPicture ||
                  user.coverPicture ||
                  "https://images.unsplash.com/photo-1444628838545-ac4016a5418a?auto=format&fit=crop&w=1950&q=80"
                }
                alt="cover"
              />
              <div className="absolute top-4 right-4">
                <label className="p-2 rounded-full bg-white cursor-pointer">
                  <FiUpload className="w-5 h-5 text-gray-800" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverImageChange}
                  />
                </label>
              </div>
            </div>

            {/* Profile info card */}
            <div className="-mt-16 px-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      className="h-28 w-28 rounded-full ring-4 ring-white object-cover"
                      src={
                        profilePicture ||
                        user.profilePicture ||
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=512&q=80"
                      }
                      alt="profile"
                    />
                    <label className="absolute bottom-0 right-0 p-1 rounded-full bg-white cursor-pointer">
                      <FiUpload className="w-4 h-4 text-gray-800" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImageChange}
                      />
                    </label>
                  </div>

                  <div className="flex-1 min-w-0">
                    <input
                      className="text-2xl font-bold text-gray-900 truncate border-b px-2 py-1"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <textarea
                      className="mt-2 w-full text-gray-700 text-sm border rounded p-2"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Write something about yourself..."
                    />
                  </div>

                  <div>
                    <button
                      onClick={handleSave}
                      disabled={isUpdating}
                      className={`px-4 py-2 rounded ${
                        isUpdating
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      } text-white`}
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>

                {/* counts row */}
                <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {user.followers?.length ?? 0}
                    </span>
                    <span>Followers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {user.following?.length ?? 0}
                    </span>
                    <span>Following</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {user.posts?.length ?? 0}
                    </span>
                    <span>Posts</span>
                  </div>
                </div>
              </div>

              {/* Posts */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(user.posts || []).map((p) => (
                  <div key={p._id} className="p-3 rounded-md bg-gray-50 border">
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {p.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
