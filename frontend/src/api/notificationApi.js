const getNotifications=async()=>{
    try {
        const res=await fetch("/api/notifications/getNotifications");
        const data=await res.json();
        if(!res.ok){
            throw new Error(data.message)
        }
        return data;
    } catch (error) {
        console.log("the error in fetching notifications was",error);
        throw error
    }
}
const deleteNotifications=async()=>{
    try {
        const res=await fetch("/api/notifications/deleteNotifications",{
            method:"DELETE"
        });
        const data=await res.json();
        if(!res.ok){
            throw new Error(data.message)
        }
        return data.message
    } catch (error) {
        console.log("the error in deleting notifications was",error);
        throw error
    }
}
export {getNotifications,deleteNotifications};