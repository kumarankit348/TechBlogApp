import { useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  userPublicProfileAction,
  followUserAction,
  unfollowUserAction,
  blockUserAction,
  unblockUserAction,
} from "../../redux/slices/users/userSlices";

export default function PublicUserProfile() {
  const { userId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) dispatch(userPublicProfileAction(userId));
  }, [userId, dispatch]);

  // store selectors
  const profileState = useSelector((state) => state.users.profile);
  const user = profileState?.user ?? null;

  const isUpdating = useSelector((state) => state.users.isUpdating);
  const authUser =
    useSelector((state) => state.users.userAuth.userInfo) ?? null;
  const myId = authUser?._id ?? null;

  // computed display values
  const name = user?.username ?? "Unknown User";
  const imageUrl =
    user?.profilePicture ||
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=512&q=80";
  const coverImageUrl =
    (user?.posts && user.posts.length > 0 && user.posts[0].image) ||
    "https://images.unsplash.com/photo-1444628838545-ac4016a5418a?auto=format&fit=crop&w=1950&q=80";

  const about =
    user?.bio ??
    `<p>${name} hasn't written an about section yet. ${
      user?.accountLevel ? `Account level: ${user.accountLevel}.` : ""
    }</p>`;

  const fields = {
    Email: user?.email ?? "—",
    Role: user?.role ?? "—",
    "Account Level": user?.accountLevel ?? "—",
    Posts: user?.posts?.length ?? 0,
    Followers: user?.followers?.length ?? 0,
    Following: user?.following?.length ?? 0,
    "Last Login": user?.lastlogin
      ? new Date(user.lastlogin).toLocaleString()
      : "—",
    Joined: user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString()
      : "—",
  };

  // BLOCK/UNBLOCK logic that's robust to where blacklist is stored
  const authBlockedList = Array.isArray(authUser?.blockedUsers)
    ? authUser.blockedUsers
    : authUser?.user?.blockedUsers ?? []; // try alternate shape
  const profileBlockedList = Array.isArray(user?.blockedUsers)
    ? user.blockedUsers
    : [];

  // three useful flags:
  const amOwner = myId && user && myId === user._id;
  // did I block this profile? (auth user's blockedUsers includes target's id)
  const iBlockedThem = myId && authBlockedList.includes(user?._id);
  // did they block me? (profile.user.blockedUsers includes my id)
  const theyBlockedMe = myId && profileBlockedList.includes(myId);
  // following detection
  const isFollowing =
    myId && Array.isArray(user?.followers) && user.followers.includes(myId);

  // handlers
  const handleFollowToggle = async () => {
    if (!myId) return alert("Please login to follow users.");
    if (!user) return;
    try {
      if (isFollowing) {
        await dispatch(unfollowUserAction({ userId: user._id }));
      } else {
        await dispatch(followUserAction({ userId: user._id }));
      }
      await dispatch(userPublicProfileAction(user._id));
    } catch (err) {
      console.error("Follow/unfollow error:", err);
    }
  };

  const handleBlockToggle = async () => {
    console.log({ myId, user, iBlockedThem, theyBlockedMe });

    if (!myId) return alert("Please login to block users.");
    if (!user) return;
    try {
      // If they blocked you, you can't unblock them locally — server must handle.
      if (theyBlockedMe && !iBlockedThem) {
        // Inform user they are blocked by the other user (can't unblock)
        alert("You are blocked by this user. You can't unblock them.");
        return;
      }

      if (iBlockedThem) {
        await dispatch(unblockUserAction({ userId: user._id }));
      } else {
        await dispatch(blockUserAction({ userIdToBlock: user._id }));
      }
      // refresh profile & auth user (server may have updated either)
      await dispatch(userPublicProfileAction(user._id));
      // also refresh auth user by re-loading token user info from server if you have such an endpoint.
    } catch (err) {
      console.error("Block/unblock error:", err);
    }
  };

  // UI helpers for nicer look
  const Button = ({ children, onClick, color = "blue", disabled = false }) => {
    const base =
      "inline-flex items-center justify-center gap-x-2 px-3 py-2 text-sm font-semibold rounded-md shadow-sm focus:outline-none";
    const colors = {
      blue: "bg-blue-600 text-white hover:bg-blue-700",
      gray: "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
      red: "bg-red-600 text-white hover:bg-red-700",
      yellow: "bg-yellow-500 text-white hover:bg-yellow-600",
    };
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${base} ${colors[color] ?? colors.blue} ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="flex h-full">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="relative z-0 flex flex-1 overflow-hidden">
          <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none xl:order-last">
            <article className="max-w-6xl mx-auto">
              {/* Cover with gradient overlay */}
              <div className="relative">
                <img
                  className="h-48 w-full object-cover"
                  src={coverImageUrl}
                  alt={`${name} cover`}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/10" />
                <div className="absolute top-4 right-4">
                  <button
                    className="p-2 rounded-full bg-white/90 hover:bg-white"
                    aria-label="Upload cover image"
                  >
                    <FiUpload className="w-5 h-5 text-gray-800" />
                  </button>
                </div>
              </div>

              {/* Info card overlapping cover */}
              <div className="-mt-16 px-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <img
                        className="h-28 w-28 rounded-full ring-4 ring-white object-cover"
                        src={imageUrl}
                        alt={`${name} avatar`}
                      />
                      <button
                        className="absolute bottom-0 right-0 p-1 rounded-full bg-white hover:bg-gray-100"
                        aria-label="Upload profile image"
                      >
                        <FiUpload className="w-4 h-4 text-gray-800" />
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h1 className="text-2xl font-bold text-gray-900 truncate">
                        {name}
                      </h1>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="text-sm text-gray-500">
                          {user?.role ?? "User"}
                        </span>
                        <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-800 rounded-full">
                          {user?.accountLevel ?? "bronze"}
                        </span>
                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full">
                          {fields.Posts} posts
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3">
                      {/* Hide actions on your own profile */}
                      {!amOwner && (
                        <>
                          {/* If they're the ones who blocked me and I didn't block them, disable actions */}
                          {theyBlockedMe && !iBlockedThem ? (
                            <div className="text-sm text-red-600 px-3 py-2 rounded-md bg-red-50">
                              You are blocked by this user
                            </div>
                          ) : (
                            <>
                              <Button
                                onClick={handleFollowToggle}
                                color={isFollowing ? "gray" : "blue"}
                                disabled={isUpdating}
                              >
                                {isUpdating
                                  ? "Processing..."
                                  : isFollowing
                                  ? "Unfollow"
                                  : "Follow"}
                              </Button>

                              <Button
                                onClick={handleBlockToggle}
                                color={iBlockedThem ? "yellow" : "red"}
                                disabled={isUpdating}
                              >
                                {isUpdating
                                  ? "Processing..."
                                  : iBlockedThem
                                  ? "Unblock"
                                  : "Block"}
                              </Button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* counts row */}
                  <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {fields.Followers}
                      </span>
                      <span>Followers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {fields.Following}
                      </span>
                      <span>Following</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {fields.Posts}
                      </span>
                      <span>Posts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {user?.profileViewers?.length ?? 0}
                      </span>
                      <span>Profile views</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details + about */}
              <div className="mt-6 px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-lg font-medium text-gray-900">About</h2>
                    <div
                      className="mt-4 text-sm text-gray-700"
                      dangerouslySetInnerHTML={{ __html: about }}
                    />
                    {/* optionally show recent posts preview */}
                    {user?.posts?.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-sm font-semibold text-gray-800">
                          Recent posts
                        </h3>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {user.posts.slice(0, 4).map((p) => (
                            <div
                              key={p._id}
                              className="p-3 rounded-md bg-gray-50 border"
                            >
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
                    )}
                  </div>

                  <aside className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="text-sm font-medium text-gray-900">
                      Details
                    </h3>
                    <dl className="mt-3 space-y-3 text-sm text-gray-700">
                      {Object.entries(fields).map(([field, value]) => (
                        <div key={field} className="flex justify-between">
                          <dt className="text-gray-500">{field}</dt>
                          <dd className="font-medium text-gray-900">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </aside>
                </div>
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}

// import { useEffect } from "react";
// import { FiUpload } from "react-icons/fi";
// import { useDispatch } from "react-redux";
// import { useParams } from "react-router-dom";
// import { userPublicProfileAction } from "../../redux/slices/users/userSlices";
// const profile = {
//   name: "Ricardo Cooper",
//   imageUrl:
//     "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
//   coverImageUrl:
//     "https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
//   about: `
//     <p>Tincidunt quam neque in cursus viverra orci, dapibus nec tristique. Nullam ut sit dolor consectetur urna, dui cras nec sed. Cursus risus congue arcu aenean posuere aliquam.</p>
//     <p>Et vivamus lorem pulvinar nascetur non. Pulvinar a sed platea rhoncus ac mauris amet. Urna, sem pretium sit pretium urna, senectus vitae. Scelerisque fermentum, cursus felis dui suspendisse velit pharetra. Augue et duis cursus maecenas eget quam lectus. Accumsan vitae nascetur pharetra rhoncus praesent dictum risus suspendisse.</p>
//   `,
//   fields: {
//     Phone: "(555) 123-4567",
//     Email: "ricardocooper@example.com",
//     Title: "Senior Front-End Developer",
//     Team: "Product Development",
//     Location: "San Francisco",
//     Sits: "Oasis, 4th floor",
//     Salary: "$145,000",
//     Birthday: "June 8, 1990",
//   },
// };

// export default function PublicUserProfile() {
//   // get the user id from params (path)
//   const { userId } = useParams();
//   // get the dispatch function
//   const dispatch = useDispatch();
//   useEffect(() => {
//     // dispatch action to get the user profile
//     dispatch(userPublicProfileAction(userId));
//   }, [userId, dispatch]);
//   return (
//     <>
//       <div className="flex h-full">
//         <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
//           <div className="relative z-0 flex flex-1 overflow-hidden">
//             <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none xl:order-last">
//               <article>
//                 {/* Profile header */}
//                 <div>
//                   <div className="relative">
//                     <img
//                       className="h-32 w-full object-cover lg:h-48"
//                       src={profile.coverImageUrl}
//                       alt=""
//                     />
//                     <button
//                       className="absolute top-0 right-0 m-4 p-2 rounded-full bg-white hover:bg-gray-200"
//                       aria-label="Upload cover image"
//                     >
//                       <FiUpload className="w-5 h-5 text-gray-800" />
//                     </button>
//                   </div>

//                   <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
//                     <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
//                       <div className="relative flex">
//                         <img
//                           className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
//                           src={profile.imageUrl}
//                           alt=""
//                         />
//                         <button
//                           className="absolute bottom-0 right-0 mb-4 mr-4 p-2 rounded-full bg-white hover:bg-gray-200"
//                           aria-label="Upload profile image"
//                         >
//                           <FiUpload className="w-5 h-5 text-gray-800" />
//                         </button>
//                       </div>

//                       <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
//                         <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
//                           <h1 className="truncate text-2xl font-bold text-gray-900">
//                             {profile.name}
//                           </h1>
//                         </div>
//                       </div>
//                       <div className="justify-stretch mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
//                         {/* Profile Views */}
//                         <button
//                           type="button"
//                           className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
//                         >
//                           <svg
//                             className="-ml-0.5 h-5 w-5 text-gray-400"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             strokeWidth="1.5"
//                             stroke="currentColor"
//                             // className="w-6 h-6"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
//                             />
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                             />
//                           </svg>
//                           20
//                         </button>
//                         {/* unblock */}
//                         <button
//                           type="button"
//                           className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
//                         >
//                           <svg
//                             className="-ml-0.5 h-5 w-5 text-gray-400"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke-width="1.5"
//                             stroke="currentColor"
//                             // class="w-6 h-6"
//                           >
//                             <path
//                               stroke-linecap="round"
//                               strokeLinejoin="round"
//                               d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
//                             />
//                           </svg>
//                           Unblock
//                         </button>
//                         {/* Block */}
//                         <button
//                           type="button"
//                           className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
//                         >
//                           <svg
//                             className="-ml-0.5 h-5 w-5 text-gray-400"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke-width="1.5"
//                             stroke="currentColor"
//                             // class="w-6 h-6"
//                           >
//                             <path
//                               stroke-linecap="round"
//                               strokeLinejoin="round"
//                               d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
//                             />
//                           </svg>
//                           Block
//                         </button>

//                         {/* follow */}
//                         <button
//                           type="button"
//                           className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
//                         >
//                           <svg
//                             className="-ml-0.5 h-5 w-5 text-gray-400"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke-width="1.5"
//                             stroke="currentColor"
//                             // class="w-6 h-6"
//                           >
//                             <path
//                               stroke-linecap="round"
//                               stroke-linejoin="round"
//                               d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
//                             />
//                           </svg>
//                           Follow
//                         </button>
//                         {/* unfollow */}
//                         <button
//                           type="button"
//                           className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
//                         >
//                           <svg
//                             className="-ml-0.5 h-5 w-5 text-gray-400"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke-width="1.5"
//                             stroke="currentColor"
//                             // class="w-6 h-6"
//                           >
//                             <path
//                               stroke-linecap="round"
//                               stroke-linejoin="round"
//                               d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
//                             />
//                           </svg>
//                           Follow
//                         </button>
//                       </div>
//                     </div>
//                     <div className="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
//                       <h1 className="truncate text-2xl font-bold text-gray-900">
//                         {profile.name}
//                       </h1>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
//                   <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
//                     {Object.entries(profile.fields).map(([field, value]) => (
//                       <div className="sm:col-span-1" key={field}>
//                         <dt className="text-sm font-medium text-gray-500">
//                           {field}
//                         </dt>
//                         <dd className="mt-1 text-sm text-gray-900">{value}</dd>
//                       </div>
//                     ))}
//                   </dl>
//                   <div className="mt-8">
//                     <div className="flex space-x-6">
//                       <h2 className="text-sm font-medium text-gray-500">
//                         About
//                       </h2>
//                     </div>
//                     <div className="mt-5 text-sm text-gray-700">
//                       {profile.about}
//                     </div>
//                   </div>
//                 </div>
//               </article>
//             </main>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
