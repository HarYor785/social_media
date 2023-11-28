import axios from "axios"
import { setPosts } from "../redux/postSlice"


const API_URL = "https://mernstack-socialmedia-qxk4.onrender.com"

//"http://localhost:8000/api-v1"

export const API = axios.create({
    baseURL: API_URL,
    responseType: "json"
})

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