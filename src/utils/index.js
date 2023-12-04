import axios from "axios"
import { setPosts } from "../redux/postSlice"


const API_URL = "http://localhost:8000/api-v1"
//https://mernstack-socialmedia-qxk4.onrender.com/api-v1
//

export const API = axios.create({
    baseURL: API_URL,
    responseType: "json"
})

//API REQUEST
export const apiRequest = async ({url, method, data, token})=>{
    try {
        const request = await API(url,{
            method: method || "GET",
            data: data || {},
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : ""
            }
        })

        if(request?.data?.message === "Authorization failed"){
            localStorage.removeItem("user")
            window.alert("User session expired, Try login")
            window.location.replace("/auth/account")
        }

        return request?.data
    } catch (error) {
        console.log(error)
        const err = error.response?.data
        return {status: err?.success, message: err?.message}
    }
}

//FETCH USERINFO
export const fetchUserInfo = async (token, id)=>{
    try {
        const newUrl = id === undefined ? "/user/get-profile" : `/user/get-profile/${id}`
        const res = await apiRequest({
            url: newUrl,
            token: token,
            method: "POST"
        })

        if(res?.message === "Authorization failed"){
            localStorage.removeItem("user")
            window.alert("User session expired, Try login")
            window.location.replace("/auth/account")
        }

        return res
    } catch (error) {
        console.log(error)
    }
}

//HANDLE FILE UPLOAD TO CLOUDINARY
export const handleFileUpload = async (file, fileIsVideo = false)=>{
    try {
        const formData = new FormData()
        formData.append("file", file)

        if(fileIsVideo){
            formData.append("recource_type", "video")
        }

        formData.append("upload_preset", "socialmedia")

        const res = await axios.post(
            `https://api.cloudinary.com/v1_1/dgnb2e0te/${fileIsVideo ? `video` : `image`}/upload/`,formData
        )

        if(res.data && res.data.secure_url){
            return res.data.secure_url
        }else{
            console.log("Invalid response structure", res.data)
        }

    } catch (error) {
        console.log("error uploading file to cloudinary", error)
    }
}

//GET SUGGESTED FRIENDS
export const getSuggestedFriends = async (token)=>{
    try {
        const res = await apiRequest({
            url: "/user/suggested-friends",
            token: token,
        })

        return res
    } catch (error) {
        console.log(error)
    }
}

//GET FRIEND REQUESTS
export const getFriendRequests = async (token)=>{
    try {
        const res = await apiRequest({
            url: "/user/get-request",
            token: token,
        })

        return res
    } catch (error) {
        console.log(error)
    }
}

//SEND FRIEND REQUESTS
export const sendFriendRequest = async (token, requestTo)=>{
    try {
        const res = await apiRequest({
            url: "/user/friend-request",
            data: {requestTo: requestTo},
            method: "POST",
            token: token
        })

        return res
    } catch (error) {
        console.log(error)
    }
}

//DECLINE FRIEND REQUEST
export const deleteFriendRequest = async (token, requestId)=>{
    try {
        const res = await apiRequest({
            url: `/user/delete-request/${requestId}`,
            method: "DELETE",
            token: token,
        })

        return res
    } catch (error) {
        console.log(error)
    }
}

//ACCEPT FRIEND REQUESTS
export const acceptFriendRequest = async (token, requestId)=>{
    try {
        const res = await apiRequest({
            url: `/user/accept-request`,
            method: "POST",
            data: {id: requestId},
            token: token,
        })

        return res
    } catch (error) {
        console.log(error)
    }
}

//DELETE FRIEND
export const deleteFriend = async (token, id)=>{
    try {
        const res = await apiRequest({
            url: `/user/delete-friend/${id}`,
            method: "DELETE",
            token: token
        })

        return res
    } catch (error) {
        console.log(error)
    }
}

//GET POSTS
export const getPosts = async (token, dispatch, data, url)=>{
    try {
        const res = await apiRequest({
            url: url || "/post",
            data: data || {},
            token: token,
            method: "POST"
        })

        dispatch(setPosts(res?.data))
        return res
    } catch (error) {
        console.log(error)
    }
}

//GET COMMENTS
export const getComments = async (token, postId)=>{
    try {
        const res = apiRequest({
            url: `/post/get-comments/${postId}`,
            method: "GET",
            token: token
        })

        return res
    } catch (error) {
        console.log(error)
    }
}

//LIKE POSTS
export const likePost = async ({token, url})=>{
    try {
        const res = await apiRequest({
            url: url,
            token: token,
            method: "POST"
        })

        return res
    } catch (error) {
        console.log(error)
    }
}

//DELETE POSTS
export const deletePost = async (token, id)=>{
    try {
        if(window.confirm('Are you sure? This action cannot be undone.')){
        const res = apiRequest({
            url: `/post/delete-post/${id}`,
            token: token,
            method: "DELETE"
        })

        return res
    }
    } catch (error) {
        console.log(error)
    }
}

//SAVE A POST
export const SavedPosts = async (token, id)=>{
    try {
        const res = await apiRequest({
            url: `/post/save-post/${id}`,
            token: token,
            method: "POST"
        })

        return res
    } catch (error) {
        console.log(error)
    }
}

//FETCH SAVED POSTS
export const getSavedPosts = async (token)=>{
    try {
        const res = await apiRequest({
            url: `/post/getsave-post`,
            token: token,
            method: "GET"
        })

        return res
    } catch (error) {
        console.log(error)
    }
}

//GET PROFILE POSTS
export const getUserPosts = async (token, userId)=>{
    try {
        const res = await apiRequest({
            url: `/post/${userId}`,
            token: token,
            method: "POST"
        })

        return res
    } catch (error) {
        console.log(error)
    }
}

//DELETE ACCOUNTS
export const deleteAccount = async (token)=>{
    try {
        if(window.confirm(`Are you sure to delete your account?`)){
            const res = await apiRequest({
                url: '/user/delete-account',
                token: token,
                method: "DELETE"
            })

            return res
        }
    } catch (error) {
        console.log(error)
    }
}

//GET CHATS
export const getChats = async (token, userId)=>{
    try {
        const res = await apiRequest({
            url: `/chat/${userId}`,
            token: token,
            method: "GET"
        })
        return res
    }catch(error){
        console.log(error)
    }
}

//CREATE MESSAGE

export const createChats = async (token, senderId, receiverId)=>{
    try {
        const res = await apiRequest({
            url: `/chat`,
            token: token,
            method: "POST",
            data:{
                senderId,
                receiverId
            }
        })
        return res
    }catch(error){
        console.log(error)
    }
}

//SEARCH CONVERSATION
export const findConversation = async (token, firstId, secondId)=>{
    try {
        const res = await apiRequest({
            url: `/chat/find/${firstId}/${secondId}`,
            token: token,
            method: "GET"
        })
        return res
    }catch(error){
        console.log(error)
    }
}

//GET MESSAGES
export const getMessages = async (token, chatId)=>{
    try {
        const res = await apiRequest({
            url: `/message/${chatId}`,
            token: token,
            method: "GET"
        })
        return res
    } catch (error) {
        console.log(error)
    }
}

//ADD MESSAGE
export const addMessage = async (token, message)=>{
    try {
        const res = await apiRequest({
            url: "/message",
            data: message,
            method: "POST",
            token: token
        })

        return res
    } catch (error) {
        console.log(error)
    }
}

//MARK MESSAGE AS READ
export const markAsRead = async (token, messageId,)=>{
    try {
        const res = await apiRequest({
            url: "/message/read",
            data:{
                messageId: messageId,
                status: "read"
            },
            method: "POST",
            token: token
        })

        return res
    } catch (error) {
        console.log(error)
    }
}

//FETCH UNREAD MESSAGES
export const unreadMessages = async (token)=>{
    try {
        const res = await apiRequest({
            url: "/message/unread",
            method: "GET",
            token: token
        })

        return res
    } catch (error) {
        console.log(error)
    }
}