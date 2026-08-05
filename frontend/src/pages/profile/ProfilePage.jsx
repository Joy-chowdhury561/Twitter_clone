import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Posts from "../../components/common/Posts.jsx";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton.jsx";
import EditProfileModal from "./EditProfileModal.jsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import defaultCoverImg from "../../public/cover.png";
import avatarPlaceholder from "../../public/avatar-placeholder.png";
import { getUserPosts, userLikedPost } from "../../api/postApi.js";
import { getUserProfile } from "../../api/usersApi.js";
import { formatTimeAgo } from "../../components/common/DaysAgo.js";
import useFollow from "../../components/Hooks/useFollow.jsx";
import { editUser } from "../../api/usersApi.js";
const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");
  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);
  const { username } = useParams();
  const queryClient = useQueryClient();
  const { follow } = useFollow();
  const { data: user, isLoading: useInfoLoading } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => getUserProfile(username),
    retry: false,
  });
  const me = queryClient.getQueryData(["me"]);
  const { data: Myposts, isLoading: mypostsLoding } = useQuery({
    queryKey: ["userpost", username],
    queryFn: () => getUserPosts(username),
    retry: false,
  });
  const { data: LikedPosts, isLoading: likedPostsLoading } = useQuery({
    queryKey: ["userLikedPosts", username],
    queryFn: () => userLikedPost(user._id),
    enabled: !!user,
    retry: false,
  });
  const { mutate: edit,isPending:isEditing } = useMutation({
    mutationFn: editUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["profile", username] });
      setCoverImg(null)
      setProfileImg(null)
    },
  });

  const handleImgUpdate = () => {
    edit({ profileImg, coverImg });
  };

  const isMyProfile = user?._id === me?._id;

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="flex-[4_4_0]  border-r border-gray-700 min-h-screen ">
        {useInfoLoading && <ProfileHeaderSkeleton />}
        {!useInfoLoading && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}
        <div className="flex flex-col">
          {!useInfoLoading && user && (
            <>
              <div className="flex gap-10 px-4 py-2 items-center">
                <Link to="/">
                  <FaArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{user?.fullName}</p>
                  <span className="text-sm  text-slate-500">
                    {Myposts?.length} posts
                  </span>
                </div>
              </div>

              <div className="relative group/cover">
                <img
                  src={coverImg || user?.coverImg.url || defaultCoverImg}
                  className="h-52 w-full object-cover"
                  alt="cover image"
                />
                {isMyProfile && (
                  <div
                    className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-100  transition duration-200"
                    onClick={() => coverImgRef.current.click()}
                  >
                    <MdEdit className="w-5 h-5 text-white" />
                  </div>
                )}

                <input
                  type="file"
                  hidden
                  ref={coverImgRef}
                  onChange={(e) => handleImgChange(e, "coverImg")}
                />
                <input
                  type="file"
                  hidden
                  ref={profileImgRef}
                  onChange={(e) => handleImgChange(e, "profileImg")}
                />

                <div className="avatar absolute -bottom-16 left-4">
                  <div className="w-32 rounded-full relative group/avatar">
                    <img
                      src={profileImg || user?.profileImg.url || avatarPlaceholder}
                    />
                    {isMyProfile && (
                      <div className="absolute top-5 right-3 p-1 bg-primary rounded-full  opacity-100 cursor-pointer">
                        <MdEdit
                          className="w-4 h-4 text-white"
                          onClick={() => profileImgRef.current.click()}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end px-4 mt-5">
                {isMyProfile && <EditProfileModal />}
                {!isMyProfile && (
                  <button
                    className="btn btn-outline rounded-full btn-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      follow(user._id);
                    }}
                  >
                    {me.following.includes(user._id) ? "following" : "follow"}
                  </button>
                )}
                {(coverImg || profileImg) && (
                  <button
                  disabled={isEditing}
                    className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                    onClick={() => {handleImgUpdate()}}
                  >
                   {isEditing?"Updating...":"update"}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-14 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{user?.fullName}</span>
                  <span className="text-sm text-slate-500">
                    @{user?.username}
                  </span>
                  <span className="text-sm my-1">{user?.bio}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {user?.link && (
                    <div className="flex gap-1 items-center ">
                      <>
                        <FaLink className="w-3 h-3 text-slate-500" />
                        <a
                          href={user?.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          {user?.link}
                        </a>
                      </>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">
                      Joined {formatTimeAgo(user.createdAt)} ago
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ">
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.following.length}
                    </span>
                    <span className="text-slate-500 text-xs">Following</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.followers.length}
                    </span>
                    <span className="text-slate-500 text-xs">Followers</span>
                  </div>
                </div>
              </div>
              <div className="flex sticky top-0 bg-black/10 backdrop-blur-sm z-10 w-full border-b border-gray-700 mt-4">
                <div
                  className={`flex justify-center ${feedType === "posts" ? "text-white" : "text-slate-500	"} flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer`}
                  onClick={() => setFeedType("posts")}
                >
                  Posts
                  {feedType === "posts" && (
                    <div className="absolute bottom-0 w-10 h-1 rounded-full bg-blue-500" />
                  )}
                </div>
                <div
                  className={`flex justify-center flex-1 p-3 text-slate-500 ${feedType === "likes" ? "text-white" : "text-slate-500"} hover:bg-secondary transition duration-300 relative cursor-pointer`}
                  onClick={() => setFeedType("likes")}
                >
                  Likes
                  {feedType === "likes" && (
                    <div className="absolute bottom-0 w-10  h-1 rounded-full bg-blue-500" />
                  )}
                </div>
              </div>
            </>
          )}
          <Posts
            posts={feedType === "posts" ? Myposts : LikedPosts}
            isLoading={feedType === "posts" ? mypostsLoding : likedPostsLoading}
          />
        </div>
      </div>
    </>
  );
};
export default ProfilePage;
