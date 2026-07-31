import Post from "./Post.jsx";
import PostSkeleton from "../skeletons/PostSkeleton.jsx";

const Posts = ({ posts,isLoading,feedType }) => {
	

	return (
		<>
			{isLoading && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && posts?.length === 0 && (
				<p className='text-center my-4'>{feedType==="following"?"you haven't followed anyone!😒":"there are no posts in this tab"}</p>
			)}
			{!isLoading && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;