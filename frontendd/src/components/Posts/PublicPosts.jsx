import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicPostsAction } from "../../redux/slices/posts/postSlices";
import { Link } from "react-router-dom";
// import LoadingComponent from "../Alert/LoadingComponent";

const PublicPosts = () => {
  // ! redux communication
  const dispatch = useDispatch();
  const { posts, error, loading } = useSelector((state) => state?.posts);
  {
    console.log(posts);
  }

  const { userInfo } = useSelector((state) => state?.users?.userAuth || {});
  useEffect(() => {
    dispatch(fetchPublicPostsAction());
  }, [dispatch]);
  return (
    <>
      <div>
        <section className="relative py-24 bg-white">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage:
                'url("flex-ui-assets/elements/pattern-white.svg")',
              backgroundRepeat: "no-repeat",
              backgroundPosition: "left top",
            }}
          />
          <div className="container relative z-10 px-4 mx-auto">
            <div className="md:max-w-5xl mx-auto mb-8 md:mb-16 text-center">
              <span className="inline-block py-px px-2 mb-4 text-xs leading-5 text-green-500 bg-green-100 font-medium uppercase rounded-full shadow-sm">
                Blog
              </span>
              <h3 className="mb-4 text-3xl md:text-5xl leading-tight text-darkCoolGray-900 font-bold tracking-tighter">
                Read our Trending Articles
              </h3>
            </div>

            <div className="flex flex-wrap -mx-4 mb-12 md:mb-20">
              {/* loop */}
              {loading ? (
                <h3 className="text-center">Loading...</h3>
              ) : error ? (
                <h3 className="text-red-500 text-center">
                  {error?.message || JSON.stringify(error)}
                </h3>
              ) : !posts || posts.length === 0 ? (
                <h3 className="text-center">No posts found</h3>
              ) : (
                posts.map((post) => (
                  <div key={post._id} className="w-full md:w-1/2 px-4 mb-8">
                    <Link
                      className="block mb-6 overflow-hidden rounded-md"
                      to={userInfo ? `/posts/${post._id}` : "/login"}
                    >
                      <img
                        className="w-full"
                        src={
                          post?.image ||
                          "https://cdn.pixabay.com/photo/2017/11/27/21/31/computer-2982270_960_720.jpg"
                        }
                        alt={post.title || "post image"}
                      />
                    </Link>

                    <div className="mb-4">
                      <span className="inline-block py-1 px-3 text-xs leading-5 text-green-500 font-medium uppercase bg-green-100 rounded-full shadow-sm">
                        {post?.category?.name || "Uncategorized"}
                      </span>
                    </div>

                    <p className="mb-2 text-coolGray-500 font-medium">
                      {post?.createdAt
                        ? new Date(post.createdAt).toLocaleDateString()
                        : ""}
                    </p>

                    <Link
                      className="inline-block mb-4 text-2xl md:text-3xl leading-tight text-coolGray-800 hover:text-coolGray-900 font-bold hover:underline"
                      to={`/posts/${post?._id}`}
                    >
                      {post?.title}
                    </Link>

                    <p className="mb-4 text-coolGray-500">
                      {post?.content?.slice(0, 150) +
                        (post?.content?.length > 150 ? "..." : "")}
                    </p>

                    <Link
                      className="inline-flex items-center text-base md:text-lg text-green-500 hover:text-green-600 font-semibold"
                      to={userInfo ? `/posts/${post?._id}` : "/login"}
                    >
                      <span className="mr-3">Read Post</span>
                      {/* svg */}
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PublicPosts;
