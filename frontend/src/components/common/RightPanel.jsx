import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton.jsx";
import { useEffect, useState } from "react";
import { suggestedUsers } from "../../api/usersApi.js";
import placeHolderImg from "../../public/avatar-placeholder.png";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/auth.js";
import useFollow from "../Hooks/useFollow.jsx";
const RightPanel = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await suggestedUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const { follow } = useFollow();

  const followUser = (userId) => {
    follow(userId);
    setUsers((prev) =>
      prev.map((user) =>
        user._id === userId
          ? {
              ...user,
              isFollowing: !user.isFollowing,
            }
          : user,
      ),
    );
  };

  return (
    <div className="hidden w-[30vw] lg:block my-4 mx-2">
      <div className="bg-[#16181C] w-fit p-4 rounded-md sticky top-2">
        <p className="font-bold mb-2">Suggested users</p>

        <div className="flex flex-col gap-4">
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}

          {!isLoading &&
            users?.map((user) => {
              const isFollowing = me?.following?.includes(user._id);

              return (
                <Link
                  key={user._id}
                  to={`/profile/${user.username}`}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex gap-2 items-center">
                    <div className="avatar">
                      <div className="w-8 rounded-full">
                        <img
                          src={user.profileImg.url || placeHolderImg}
                          alt={user.fullName}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-semibold tracking-tight truncate w-28">
                        {user.fullName}
                      </span>

                      <span className="text-sm truncate w-28 text-slate-500">
                        @{user.username}
                      </span>
                    </div>
                  </div>

                  <button
                    className={`btn cursor-pointer rounded-full btn-sm ${
                      isFollowing
                        ? "bg-gray-500 text-white cursor-default"
                        : "bg-white text-black hover:bg-white hover:opacity-90"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      followUser(user._id);
                    }}
                  >
                    {isFollowing ? "Followed" : "Follow"}
                  </button>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
