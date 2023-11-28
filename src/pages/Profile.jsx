import React, { useEffect, useState } from 'react'

//PACKAGES
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import moment from 'moment'


import { FaBirthdayCake } from "react-icons/fa";
import { CiSearch, CiLocationOn } from "react-icons/ci";
import { GrContactInfo } from "react-icons/gr";
import { MdOutlineDateRange } from "react-icons/md";
import { IoBriefcaseOutline } from "react-icons/io5";
import { SiTodoist } from "react-icons/si";
import { MdOutlineEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";

//COMPONENTS
import CustomButton from '../components/CustomButton'
import TopBar from '../components/TopBar'
import RigthBar from '../components/RigthBar'
import EditProfile from '../components/EditProfile'
import FriendsCard from '../components/FriendsCard'
import Photos from '../components/Photos'
import PostCard from '../components/PostCard'
import Loader from '../components/Loader'
import { noProfile } from '../assets'

//UTILS
import { SavedPosts, 
  deleteFriend, deletePost, 
  fetchUserInfo, getSavedPosts, 
  getUserPosts, likePost, 
  sendFriendRequest } from '../utils'
import { updateProfile, userLogin } from '../redux/userSlice'

const About = ({userData})=>{
  return (
    <div className='md:sticky md:top-0 md:mt-0 mt-4 w-full md:h-[600px] h-fit bg-secondary 
    rounded-lg '>
      <div className='flex flex-col gap-3 p-4'>
        <h1 className='text-blue text-lg font-bold'>About</h1>
        <hr className='border-[1px] border-[#66666666]'/>
        <div className='flex flex-col items-start gap-5 mt-4'>
          <span className='w-full flex items-center gap-4'>
            <span className='text-2xl bg-ascent-2 p-2
            flex items-center justify-center rounded-full'>
              <GrContactInfo className='text-[#e9e9e9]'/>
            </span>
            <span className='text-sm text-ascent-2 text-justify'>
              {userData?.bio}
            </span>
          </span>
          <span className='w-full flex items-center gap-4'>
            <span className='text-2xl bg-ascent-2 p-2 
            flex items-center justify-center rounded-full'>
              <FaBirthdayCake className='text-[#e9e9e9]'/>
            </span>
            <span className='text-sm text-ascent-2'>
              <b>DOB:</b> {moment(userData?.dateOfBirth).calendar()}
            </span>
          </span>
          <span className='w-full flex items-center gap-4'>
            <span className='text-2xl bg-ascent-2 p-2 
            flex items-center justify-center rounded-full'>
              <MdOutlineDateRange className='text-[#e9e9e9]'/>
            </span>
            <span className='text-sm text-ascent-2'>
              <b>Joined:</b> {moment(userData?.createdAt).fromNow()}
            </span>
          </span>
          <span className='w-full flex items-center gap-4'>
            <span className='text-2xl bg-ascent-2 p-2 
            flex items-center justify-center rounded-full'>
              <CiLocationOn className='text-[#e9e9e9]'/>
            </span>
            <span className='text-sm text-ascent-2'>
              {userData?.location}
            </span>
          </span>
          <span className='w-full flex items-center gap-4'>
            <span className='text-2xl bg-ascent-2 p-2 
            flex items-center justify-center rounded-full'>
              <IoBriefcaseOutline className='text-[#e9e9e9]'/>
            </span>
            <span className='text-sm text-ascent-2'>
              {userData?.profession}
            </span>
          </span>
          <span className='w-full flex items-center gap-4'>
            <span className='text-2xl bg-ascent-2 p-2 
            flex items-center justify-center rounded-full'>
              <FiPhone className='text-[#e9e9e9]'/>
            </span>
            <Link className='text-sm text-blue'>
              {userData?.mobile}
            </Link>
          </span>
          <span className='w-full flex items-center gap-4'>
            <span className='text-2xl bg-ascent-2 p-2 
            flex items-center justify-center rounded-full'>
              <MdOutlineEmail className='text-[#e9e9e9]'/>
            </span>
            <Link className='text-sm text-blue'>
              {userData?.email}
            </Link>
          </span>
          <span className='w-full flex items-center gap-4'>
            <span className='text-2xl bg-ascent-2 p-2 
            flex items-center justify-center rounded-full'>
              <SiTodoist className='text-[#e9e9e9]'/>
            </span>
            <span className='text-sm text-ascent-2'>
              <b>Hobbies:</b> {userData?.hobbies}
            </span>
          </span>
        </div>
        
      </div>
    </div>
  )
}

const Profile = () => {
  const {id} = useParams()
  const {theme} = useSelector((state)=>state.theme)
  const {user, edit} = useSelector((state)=>state.user)
  const dispatch = useDispatch()
  const [tab, setTab] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState(null)
  const [savedPosts, setSavedPosts] = useState([])
  const [userPosts, setUserPosts] = useState([])
  const [isFetching, setIsFetching] = useState(false)

  const getUser = async ()=>{
    setIsLoading(true)
    const res = await fetchUserInfo(user?.token, id)
    if(res.success){
      setUserData(res?.user)
      setIsLoading(false)
    }
  }

  // DELETE FRIEND 
  const handleDeleteFriend = async (id)=>{
    try {
      const res = await deleteFriend(user?.token, id)
      if(res.success){
        window.alert(res.message)
        getUser();
        const newData = {token: res?.token, ...res?.user}
        dispatch(userLogin(newData))
      }else{
        window.alert(res.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

   // SEND FRIEND REQUEST
   const sendRequest = async (id)=>{
    const res = await sendFriendRequest(user?.token, id)
      if(res?.success){
        getUser()
        window.alert(res?.message)
      }else{
        window.alert(res?.message)
      }
  }

  const mySavedPosts = async ()=>{
    setTab(4)
    setIsFetching(true)
    const res = await getSavedPosts(id ?? user?.token)
    if(res?.success){
      setSavedPosts(res?.data)
      setIsFetching(false)
    }
  }


  const handleUserPosts = async ()=>{
    const res = await getUserPosts(user?.token, id ?? user?._id)
    setUserPosts(res?.data)

  }

  const handleSavePost = async (id) =>{
    await SavedPosts(user?.token, id)
    await handleUserPosts()
  }

  const handlePostLike = async (url) =>{
    await likePost({url: url, token: user?.token})
    await handleUserPosts()
    const res = await getSavedPosts(user?.token)
    setSavedPosts(res?.data)
  }

  const handleDeletePost = async (id)=>{
    await deletePost(user?.token, id)
    await handleUserPosts()
  }

  const getPhotos = userPosts?.map((file)=>file.file)

  useEffect(()=>{
    getUser()
    handleUserPosts()
  },[id])

  return (
    <>
      <div data-theme={theme} className='relative flex flex-col w-full 
      bg-bgColor h-screen overflow-hidden pb-20'>
        <TopBar/>

        <div className='h-full w-full flex mt-[5rem] gap-2 pb-3'>
          {/* RIGTH */}
          <div className='hidden md:flex w-1/3 lg:w-1/4 px-12 py-4 h-full 
          overflow-y-auto border-r-[1px] border-r-ascent-3'>
          <RigthBar profile={true}/>
          </div>

          {/* CENTER */}
          <div className='flex-1 w-full px-6 py-4 h-full 
          overflow-y-auto flex flex-col gap-3 items-center'>
            {isLoading ? (<Loader/>):(
              <div className='w-full flex flex-col items-center relative'>
                {/* TOP */}
                <div className='w-full relative flex flex-col bg-secondary
                rounded-lg overflow-hidden'>
                  {/* COVER PHOTO */}
                  <img 
                  src={userData?.coverPicUrl ?? noProfile}
                  className='w-full h-[200px] object-cover'
                  alt="" />
                  
                  {/* PROFILE */}
                  <div className='flex items-center flex-col 
                  md:flex-row gap-4 mt-[-40px] px-4 py-2'>
                    {/* PROFILE IMAGE */}
                    <div className='w-[200px] h-[200px] md:h-[170px] 
                    rounded-full overflow-hidden border-2 border-ascent-2 p-1'>
                      <img 
                      src={userData?.profilePicUrl ?? noProfile} 
                      className='w-full h-full object-cover rounded-full'
                      alt="" 
                      />
                    </div>
                    {/* NAME AND BIO */}
                    <div className='w-full flex items-center justify-between'>
                        <div className='flex-1 pr-8 flex flex-col gap-1'>
                          <h1 className='text-ascent-1 text-lg font-bold'>
                            {userData?.firstName + " " + userData?.lastName}
                          </h1>
                          <span className='text-sm text-ascent-2 font-bold'>
                            @{userData?.userName} 
                          </span>
                          <span className='text-sm text-ascent-2'>
                            <b>Bio:</b> {userData?.bio} 
                          </span>
                        </div>

                        { userData?._id === user?._id ? (
                          <CustomButton
                          label="Edit Profile"
                          styles="md:py-2 md:px-6 px-3 py-2 text-xs md:text-base 
                          rounded-lg bg-blue text-white"
                          onClick={()=>dispatch(updateProfile(!edit))}
                          />
                        ) : user?.friends.some(friend => friend._id === id) ? (
                          <CustomButton
                          label="Unfriend"
                          styles="md:py-2 md:px-6 px-3 py-2 text-xs md:text-base 
                          rounded-lg bg-blue text-white"
                          onClick={()=>handleDeleteFriend(id)}
                          />
                        ) : (
                          <CustomButton
                          label="Add Friend"
                          styles="md:py-2 md:px-6 px-3 py-2 text-xs md:text-base 
                          rounded-lg bg-blue text-white"
                          onClick={()=>sendRequest(id)}
                          />
                        )}
                        
                    </div>
                  </div>
                  
                  {/* TABS BUTTONS */}
                  <div className='md:px-6'>
                    <div className='w-full flex md:justify-between items-center py-3 px-3
                    md:px-0 border-t-[1px] border-[#66666666] gap-4'>
                      <div className='md:w-full flex justify-between md:gap-0 gap-4'>
                        <CustomButton
                        label="Posts"
                        onClick={()=>{
                          handleUserPosts();
                          setTab(1)}}
                        styles={`text-ascent-2 relative ${tab === 1 
                        ? `text-blue before:content-[""] before:w-full before:h-1
                        before:bg-blue before:rounded-lg before:absolute before:bottom-[-17px]
                        ` : "text-base"}`}
                        />
                        <CustomButton
                        label="Friends"
                        onClick={()=>setTab(2)}
                        styles={`text-ascent-2 relative ${tab === 2 
                        ? `text-blue before:content-[""] before:w-full before:h-1
                        before:bg-blue before:rounded-lg before:absolute before:bottom-[-17px]
                        ` : "text-base"}`}
                        />
                        <CustomButton
                        label="Photos"
                        onClick={()=>setTab(3)}
                        styles={`text-ascent-2 relative ${tab === 3
                        ? `text-blue before:content-[""] before:w-full before:h-1
                        before:bg-blue before:rounded-lg before:absolute before:bottom-[-17px]
                        ` : "text-base"}`}
                        />
                        <CustomButton
                        label="Saved"
                        onClick={mySavedPosts}
                        styles={`text-ascent-2 relative ${tab === 4
                        ? `text-blue before:content-[""] before:w-full before:h-1
                        before:bg-blue before:rounded-lg before:absolute before:bottom-[-17px]
                        ` : "text-base"}`}
                        />
                        <CustomButton
                        label="About"
                        onClick={()=>setTab(5)}
                        styles={`text-ascent-2 relative ${tab === 5
                        ? `text-blue before:content-[""] before:w-full before:h-1
                        before:bg-blue before:rounded-lg before:absolute before:bottom-[-17px]
                        ` : "text-base"} md:hidden`}
                        />
                      </div>

                      {/* SEARCH */}
                      <div className='md:w-full hidden md:flex items-center justify-end gap-2'>
                        {/* SEARCH */}
                        <div className='hidden w-[200px] md:flex items-center border 
                        border-ascent-2 h-[35px] bg-secondary rounded-lg overflow-hidden'>
                            <button 
                            className='px-2 text-ascent-1 text-2xl'
                            >
                                <CiSearch/>
                            </button>
                            <input 
                            className='border-none bg-secondary outline-none h-full w-full
                            text-ascent-1'
                            type="text" 
                            placeholder='Search'
                            />
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
                {/* BOTTOM */}
                <div className='w-full flex items-start gap-2 relative'>
                  
                  {/* POSTS */}
                  <div className='md:w-2/3 w-full'>
                    {tab === 1 && ( 
                      userPosts?.length > 0 ?(
                      userPosts?.map((post, index)=>(
                        <PostCard 
                        key={index}
                        post={post} 
                        postLike={handlePostLike}
                        deletePosts={handleDeletePost}
                        savePost={handleSavePost}
                        />
                      ))
                      ):(
                        <div className='p-2 flex justify-center'>
                          <p className='text-base text-ascent-2'>
                            You have no posts
                          </p>
                        </div>
                      )
                    )}

                    {tab === 2 && (
                      userData?.friends?.length > 0 ?(
                        userData?.friends?.map((friend, index)=>(
                          <FriendsCard 
                          key={index}
                          friend={friend} 
                          getUser={getUser}
                          />
                        ))):(
                          <div className='p-2 flex justify-center'>
                            <p className='text-base text-ascent-2'>
                              You have no friends
                            </p>
                          </div>
                        )
                    )}

                    {tab === 3 && (<Photos photos={[...getPhotos, userData]}/>)}

                    {tab === 4 && ( 
                      isFetching ? <Loader/> : userData?._id === user?._id 
                      && savedPosts?.length > 0 ? 
                          savedPosts?.map((post, index)=>( <PostCard 
                            key={index}
                            post={post}
                            postLike={handlePostLike}
                            deletePosts={handleDeletePost}
                            savePost={handleSavePost}
                            />)
                      ):(
                          <div className='p-2 flex justify-center'>
                            <p className='text-base text-ascent-2'>
                              {id ? "Hidden" : "You have no saved posts"}
                            </p>
                          </div>
                        )
                      )
                    }
                    
                    {tab === 5 && (<About userData={userData}/>)}
                  </div>
                  {/* ABOUT */}
                  <div className='w-1/3 hidden md:flex h-full py-6 relative'>
                    <About userData={userData}/>
                  </div> 

                </div>

              </div>
            )}

          </div>
          
          {/* EDIT PROFILE FORM */}
          {edit && (<EditProfile 
          updated={getUser}/>)}
        </div>
      </div>

    </>
  )
}

export default Profile