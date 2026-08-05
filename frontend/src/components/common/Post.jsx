import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import {  useState } from "react";
import { Link } from "react-router-dom";
import placeholderImg from "../../public/avatar-placeholder.png";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { likePost, deletePost,commentOnPost } from "../../api/postApi.js";
import { getMe } from "../../api/auth.js";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner.jsx";
import {formatTimeAgo} from "./DaysAgo.js"
const Post = ({ post }) => {
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });
  const [comment, setComment] = useState("");
  const postOwner = post.user;
  const queryClient = useQueryClient();
  const me = user._id;
  const isMyPost = me === postOwner._id;
  const isLiked = post.likes?.includes(me) ? true : false;
  const keys = ["foryouposts", "followingPosts"];


  const {mutate:commentFn,isPending:isCommenting}=useMutation({
    mutationFn:()=>commentOnPost(post._id,comment),
    onSuccess:(newComment)=>{
        keys.forEach((key)=>{
          queryClient.setQueryData([key],(oldData)=>{
            if(!oldData) return
            return oldData.map((cachedPost)=>{
              if(cachedPost._id===post._id){
                return {...cachedPost,comments:[...cachedPost.comments,newComment]}
              }
              return cachedPost;
            })
          })
        })
        queryClient.setQueriesData({queryKey:[""]})
        setComment("")
    }
  })
  const handlePostComment = (e) => {
    e.preventDefault();
    commentFn()
  };
  const { mutate: like } = useMutation({
    mutationFn: () => likePost(post._id),
    onError: (error) => {
      toast.error(error.message || "Failed to like post");
    },
  });
  const { mutate: del, isPending } = useMutation({
    mutationFn: async () => {
      await deletePost(post._id);
    },
    onSuccess: () => {
      const currentPostId = post._id;
      keys.forEach((key) => {
        queryClient.setQueryData([key], (oldData) => {
          if (!oldData) return;
          return oldData.filter(
            (cachedPost) => cachedPost._id !== currentPostId,
          );
        });
      });
    },
  });
  const handleDeletePost = () => {
    del();
  };
  const handleLikePost = () => {
    like();
    const currentPostId = post._id;
    keys.forEach((key) => {
      queryClient.setQueryData([key], (oldData) => {
        if (!oldData) return;
        return oldData.map((cachedPost) => {
          if (cachedPost._id === currentPostId) {
            return {
              ...cachedPost,
              likes: isLiked
                ? cachedPost.likes.filter((id) => id !== user._id)
                : [...cachedPost.likes, user._id],
            };
          }
          return cachedPost;
        });
      });
    });

    queryClient.setQueriesData({ queryKey: ["userpost"] }, (oldData) => {
      if (!oldData) return oldData;

      return oldData.map((cachedPost) => {
        if (cachedPost._id !== currentPostId) return cachedPost;

        return {
          ...cachedPost,
          likes: isLiked
            ? cachedPost.likes.filter((id) => id !== user._id)
            : [...cachedPost.likes, user._id],
        };
      });
    });

    queryClient.setQueriesData({ queryKey: ["userLikedPosts"] }, (oldData) => {
      if (!oldData) return oldData;

      return oldData.map((cachedPost) => {
        if (cachedPost._id !== currentPostId) return cachedPost;

        return {
          ...cachedPost,
          likes: isLiked
            ? cachedPost.likes.filter((id) => id !== user._id)
            : [...cachedPost.likes, user._id],
        };
      });
    });
  };

  return (
    <>
      <div className="flex gap-2 items-start p-4 border-b border-gray-700">
        <div className="avatar">
          <Link
            to={`/profile/${postOwner.username}`}
            className="w-8 rounded-full overflow-hidden"
          >
            <img src={postOwner.profileImg.url || placeholderImg} />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-0 flex-wrap sm:gap-2  items-center">
            <Link to={`/profile/${postOwner.username}`}  className="font-bold text-[clamp(1rem,1vw,2rem)]">
              {postOwner.fullName}
            </Link>
            <span className="text-gray-700 flex gap-1 text-sm">
              <span>·</span>
              <span>{formatTimeAgo(post.createdAt)} ago</span>
            </span>
            {isMyPost && (
              <span className="flex justify-end flex-1">
                {isPending ? (
                  <LoadingSpinner />
                ) : (
                  <FaTrash
                    className="cursor-pointer hover:text-red-500"
                    onClick={handleDeletePost}
                  />
                )}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 mt-2 overflow-hidden">
            <span>{post.text}</span>
            {post.img && (
              <img
                src={post.img}
                className="h-80 object-contain rounded-lg border border-gray-700"
                alt=""
              />
            )}
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex gap-4 items-center w-2/3 justify-between">
              <div
                className="flex gap-1 items-center cursor-pointer group"
                onClick={() =>
                  document
                    .getElementById("comments_modal" + post._id)
                    .showModal()
                }
              >
                <FaRegComment className="w-4 h-4  text-slate-500 group-hover:text-sky-400" />
                <span className="text-sm text-slate-500 group-hover:text-sky-400">
                  {post.comments.length}
                </span>
              </div>
              {/* We're using Modal Component from DaisyUI */}
              <dialog
                id={`comments_modal${post._id}`}
                className="modal border-none outline-none"
              >
                <div className="modal-box rounded border border-gray-600">
                  <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                  <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                    {post.comments.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No comments yet! Be the first one 😉
                      </p>
                    )}
                    {[...post.comments].reverse().map((comment) => (
                      <div key={comment._id} className="flex gap-2 items-start">
                        <Link to={`/profile/${comment.user.username}`}>
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img
                              src={
                                comment.user.profileImg.url ||placeholderImg
                                
                              }
                            />
                          </div>
                        </div>
                        </Link>
                        <div className="flex mr-4 flex-col flex-1 min-w-0">
                          <div className="flex flex-wrap  items-center gap-1">
                            <Link to={`/profile/${comment.user.username}`}>
                            <span className="font-bold">
                              {comment.user.fullName}
                            </span>
                            </Link>
                            <span className="text-gray-500 text-2xl">·</span>
                            <p className="text-gray-500 text-[0.9rem]">{formatTimeAgo(comment.createdAt)} ago</p>
                          </div>
                          <div className="text-sm wrap-break-word">{comment.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                    onSubmit={handlePostComment}
                  >
                    <textarea
                      className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                      {isCommenting ? (
                        <span className="loading loading-spinner loading-md"></span>
                      ) : (
                        "Post"
                      )}
                    </button>
                  </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button className="outline-none">close</button>
                </form>
              </dialog>
              <div className="flex gap-1 items-center group cursor-pointer">
                <BiRepost className="w-6 h-6  text-slate-500 group-hover:text-green-500" />
                <span className="text-sm text-slate-500 group-hover:text-green-500">
                  0
                </span>
              </div>
              <div
                className="flex gap-1 items-center group cursor-pointer"
                onClick={handleLikePost}
              >
                {isLiked ? (
                  <FaHeart className="fill-pink-500" />
                ) : (
                  <FaRegHeart className="hover:text-pink-500 text-gray-500 " />
                )}

                <span
                  className={`text-sm select-none text-slate-500 group-hover:text-pink-500 ${
                    isLiked ? "text-pink-500" : ""
                  }`}
                >
                  {post.likes.length}
                </span>
              </div>
            </div>
            <div className="flex w-1/3 justify-end gap-2 items-center">
              <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Post;
