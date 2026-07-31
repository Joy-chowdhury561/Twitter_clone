 const suggestedUsers=async()=>{
    try {
        const res =await fetch("/api/user/suggested");
        if(!res.ok){
             throw new Error("there was a problem in getting the suggested users")
        }
        const data=await res.json();
        return data
    } catch (error) {
        console.log("the error in fetching suggested users was",error);
        throw error
    }
}
export default suggestedUsers