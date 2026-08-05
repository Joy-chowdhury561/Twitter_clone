const suggestedUsers = async () => {
  try {
    const res = await fetch("/api/user/suggested");
    if (!res.ok) {
      throw new Error("there was a problem in getting the suggested users");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("the error in fetching suggested users was", error);
    throw error;
  }
};
const followUnfollowUser = async (userId) => {
  try {
    const res = await fetch(`/api/user/follow/${userId}`, {
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
    console.log(error.message || error);
    throw error;
  }
};
const getUserProfile =async (username) => {
  try {
    const res=await fetch(`/api/user/profile/${username}`);
    const data=await res.json();
    if(!res.ok){
      throw new Error(data.message)
    }
    return data;

  } catch (error) {
    console.log(
      "the error in getting the user profile was",
      error.message || error,
    );

    throw error
  }
};

const editUser=async(formData)=>{
  try {
    const res=await fetch("/api/user/update",{
      method:"PATCH",
      credentials: "include",
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify(formData)
    })
    const data=await res.json();
    if(!res.ok){
      throw new Error(data.message)
    }
    return data.message;
  } catch (error) {
    console.log("the error in editing user info was",error);
    throw error
  }
}
export { suggestedUsers, followUnfollowUser,getUserProfile,editUser };
