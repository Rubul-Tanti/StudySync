import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsFillPostcardFill } from "react-icons/bs";

import api from "../../utils/axios";
import { useSelector } from "react-redux";
import Loader from "../loader";
import EditPost from "./editPost";
import { toast } from "react-toastify";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading,setLoading]=useState(true);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user?._id) return;
    setLoading(true)

    const fetchPosts = async () => {
      try {
        // ✅ use POST if backend expects body
        const res = await api.post("/v1/fetchmyposts", {
          id: user._id,
        });
        setPosts(res.data.data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }finally{setLoading(false)}
    };

    fetchPosts();
  }, [user]); // ✅ add dependency


  if(loading)return<Loader/>

  return (
    <>
    <div className="min-h-screen bg-white text-zinc-700 px-6 py-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex md:flex-row flex-col justify-between items-start  md:items-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight"><BsFillPostcardFill size={25} className="text-blue-400 inline"/> My Job Posts</h1>
        <button
          onClick={() => navigate("/create-job")}
          className="md:px-5 px-2 py-2 md:mt-0 mt-2 md:text-base text-sm bg-[#005188] text-white font-semibold rounded-lg shadow hover:bg-[#005188] transition"
        >
          + Create Post
        </button>
      </div>

      {/* Posts */}
      <div className="max-w-6xl mx-auto">
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-gray-100 rounded-xl border border-gray-200">
            <p className="text-blue-400 text-lg font-medium">
              No posts created yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white border border-gray-200 text-zinc-700 rounded-xl shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                 <Link to={`${post._id}`}> <h2 className="text-xl font-bold mb-2 hover:underline cursor-pointer">{post.title}</h2></Link>
                  <p className="text-gray-700 mb-3 line-clamp-3">
                    {post.description}
                  </p>
                  <p className="text-sm text-[#005188] ">
                    Budget: <span className="font-medium text-gray-500">${post.budget}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );}

