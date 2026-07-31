const getPosts = async () => {
  try {
    const res = await fetch("/api/post/getPosts");
    if (!res.ok) {
      throw new Error("failed to fetch posts");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const MyLikedPosts = async () => {
  try {
    const res = await fetch("/api/post/myLikedPosts");
    if (!res.ok) {
      throw new Error("failed fetching liked posts");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error.message || error);
    throw error;
  }
};
const getMyPosts = async () => {
  try {
    const res = await fetch("/api/post/getMyPosts");
    if (!res.ok) {
      throw new Error("failed to fetch your post");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error.message || error);
    throw error;
  }
};

const likePost = async (PostId) => {
  try {
    const res = await fetch(`/api/post/like/${PostId}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }
    return data.message;
  } catch (error) {
    console.log("the error in liking this post was", error);
    throw error;
  }
};
const deletePost = async (PostId) => {
  try {
    const res = await fetch(`/api/post/delete/${PostId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      return console.log("couldn't delete this post");
    }
    return;
  } catch (error) {
    console.log("the error in deleting post is ", error);
    throw error;
  }
};
const getFollowingPosts = async () => {
  try {
    const res = await fetch("/api/post/getFollowingPosts");
    const data = res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    console.log("the error in getting the following post is", error);
    throw error;
  }
};
export {
  getMyPosts,
  MyLikedPosts,
  getPosts,
  likePost,
  deletePost,
  getFollowingPosts,
};
