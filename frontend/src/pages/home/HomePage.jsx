import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPosts, getFollowingPosts } from "../../api/postApi.js";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");
	const {
		isLoading: isLoadingForYou,
		data: forYouPosts,
	} = useQuery({
		queryKey: ["foryouposts"],
		queryFn: getPosts,
		retry: false,
	});
	const {
		isLoading: isLoadingFollowing,
		data: followingPosts,
	} = useQuery({
		queryKey: ["followingPosts"],
		queryFn: getFollowingPosts,
		retry: false,
	});
	
	
	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>

				<div className='flex z-3  w-full border-b bg-black/2 backdrop-blur-sm sticky top-0 border-gray-700'>
					<div
						className={
							"flex justify-center items-center select-none  h-18 font-bold  flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
						}
						onClick={() => setFeedType("forYou")}
					>
						For you
						{feedType === "forYou" && (
							<div className='absolute bg-blue-500 bottom-0 w-10  h-1 rounded-full '></div>
						)}
					</div>
					<div
						className='flex justify-center items-center  h-18 font-bold o  select-none flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
						onClick={() => setFeedType("following")}
					>
						Following
						{feedType === "following" && (
							<div className='absolute bg-blue-500 bottom-0 w-10  h-1 rounded-full '></div>
						)}
					</div>
				</div>

				<CreatePost />

				<Posts feedType={feedType} isLoading={feedType==="forYou"?isLoadingForYou:isLoadingFollowing} posts={feedType==="forYou"?forYouPosts:followingPosts}/>
			</div>
		</>
	);
};
export default HomePage;