import React, { useEffect,useRef,useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import {io} from "socket.io-client"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

//REDUX 
import { setPosts } from '../redux/postSlice'
import { toggleRequestTab, userLogin } from '../redux/userSlice'

// COMPONENTS
import RigthBar from '../components/RigthBar'
import PostForm from '../components/PostForm'
import LeftBar from '../components/LeftBar'
import TopBar from '../components/TopBar'
import Stories from '../components/Stories'
import PostCard from '../components/PostCard'
import FriendRequestCard from '../components/FriendRequestCard'

//ICONS
import { FaTimes } from "react-icons/fa";

//UTILS
import { SavedPosts, 
  acceptFriendRequest, 
  deleteFriendRequest, 
  deletePost, 
  getFriendRequests, 
  getPosts, 
  likePost, 
  } from '../utils'

const Home = () => {
  // Retrieve data from Redux state
  const { theme } = useSelector((state) => state.theme);
  const { user, tab } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const [request, setRequest] = useState([])
  const [requestSent, setRequestSent] = useState([])
  const [notifications, setNotifications] = useState([])
  const dispatch = useDispatch();
  const socket = useRef()

  // Connection to socket.io to get online users
  useEffect(()=>{
    socket.current = io("https://cmsocket.onrender.com")
    socket.current.emit("new-user-add", user?._id)
    socket.current.on("get-users",(users)=>{
      console.log("")
    })

    // Receive message on homepage
    socket.current.on("receive-message", (data)=>{
        setNotifications([data])
        toast.success(`You have new message`, {
            autoClose: 5000
        })
    })

  },[])

  // Send friend request with socket.io
  useEffect(()=>{
    socket.current.emit("friend-request", requestSent)
  },[requestSent])

  // Recieve friend request with socket.io
  useEffect(()=>{
    socket.current.on("new-request", (data)=>{
      getRequest()
    })
  },[])

  // Function to get posts
  const handleGetPost = async () => {
    await getPosts(user?.token, dispatch);
  };

  //Function to handle liking a post
  const handleLikePost = async (url) => {
    await likePost({ url: url, token: user?.token });
    await handleGetPost();
  };

  // Function to handle deleting a post
  const handleDeletePost = async (id) => {
    await deletePost(user?.token, id);
    await handleGetPost();
  };

  // Function to handle saving a post
  const handleSavePost = async (id) => {
    const res = await SavedPosts(user?.token, id);
    await handleGetPost();
    window.alert(res?.message);
  };

  // Function to hide a post
  const hidePost = (id) => {
    const hide = posts?.filter((item) => item._id !== id);
    dispatch(setPosts(hide));
  };

  // GET FRIEND REQUEST
  const getRequest = async ()=>{
    try {
      const res = await getFriendRequests(user?.token)
      if(res?.success){
        setRequest(res?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // DECLINE FRIEND REQUEST
  const deleteRequest = async (id)=>{
    const res = await deleteFriendRequest(user?.token, id)
    console.log(res)
    if(res?.success){
      getRequest()
      dispatch(toggleRequestTab(false))
      window.alert(res?.message)
    }else{
      window.alert(res?.message)
    }
  }

  // ACCEPT REQUEST
  const acceptRequest = async (id)=>{
    const res = await acceptFriendRequest(user?.token, id)
    if(res?.success){
      window.alert(res?.message)
      const newData = {token: res?.token, ...res?.user}
      dispatch(userLogin(newData))
      dispatch(toggleRequestTab(false))
      getRequest()
    }else{
      window.alert(res?.message)
    }
  }

  // useEffect to get posts on component mount
  useEffect(() => {
    getRequest()
    handleGetPost();
  }, []);




  return (

        <div data-theme={theme} className='relative flex flex-col w-full 
        bg-bgColor h-screen overflow-hidden pb-20'>
          <TopBar handleGetPost={handleGetPost} 
          request={request}/>
          <div className='h-full w-full flex mt-[5rem] gap-2 pb-3'>

            {/* RIGTH */}
            <div className='hidden md:flex w-1/3 lg:w-1/4 px-4 py-4 h-full 
            overflow-y-auto border-r-[1px] border-r-[#66666666]'>
              <RigthBar profile={false} handleGetPost={handleGetPost} 
              setRequestSent={setRequestSent} getRequest={getRequest}/>
            </div>

            {/* CENTER */}
            <div className='flex-1 w-full md:px-2 px-5 py-4 h-full 
            overflow-y-auto flex flex-col gap-3 items-center'>
              
              {/* STORIES CARD */}
              <Stories/>

              {/* CREATE POST FORM */}
              <PostForm handleGetPost={handleGetPost}/>

              {/* POSTS */}
              {
                posts?.map((post, index)=>(
                  <PostCard 
                  key={index}
                  post={post}
                  postLike={handleLikePost}
                  deletePosts={handleDeletePost}
                  hidePost={hidePost}
                  savePost={handleSavePost}
                  />
                ))
              }

              {/* IF NO POSTS  */}
              {posts?.length < 0 && (
                <div>
                  <span className='text-ascent-1 text-2xl'>No Post</span>
                </div>
              )}

            </div>

            {/* LEFT */}
            <div className='hidden md:flex w-1/4 px-2 py-4 h-full 
            overflow-y-auto border-l-[1px] border-l-[#66666666]'>
              <LeftBar 
              setRequestSent={setRequestSent}
              request={request} 
              getRequest={getRequest}
              deleteRequest={deleteRequest}
              acceptRequest={acceptRequest}
              />
            </div>
          </div>


          {/* FRIEND REQUESTS MOBILE */}
            {tab && (
                <motion.div 
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.5}}
                className='w-full h-full absolute top-0 left-0 
                  z-[1005] flex items-center justify-center'>

                      <div className='w-full h-full absolute bg-[rgba(0,0,0,0.1)] 
                      top-0 left-0 bottom-0 right-0 z-[1001]'
                      onClick={()=>dispatch(toggleRequestTab(false))}
                      />

                      <div className='relative flex md:w-1/2 w-full md:px-0 px-10 
                      py-4 items-center justify-center z-[1003]'>

                          <div className='w-full flex flex-col gap-2 px-5 p-4 bg-secondary
                          rounded-lg m-auto'>
                              {/* HEADING */}
                              <div className='flex items-center justify-between'>
                                  <span className='w-full flex justify-start gap-4'>
                                    <h4 className='font-bold text-ascent-3 text-sm'>
                                      FRIEND REQUESTS
                                    </h4>
                                    <span className='bg-blue text-white rounded-full text-xs 
                                    h-[18px] w-[18px] flex items-center justify-center'>
                                      {request?.length}
                                    </span>
                                  </span>
                                  {/* CLOSE BUTTON */}
                                  <span className='flex justify-end'>
                                    <button
                                    className='p-1.5 text-white rounded-md bg-[#f64949f3]'
                                    onClick={()=>dispatch(toggleRequestTab(false))}
                                    >
                                        <FaTimes size={20}/>
                                    </button>
                                  </span>
                              </div>

                              {/* REQUEST LIST CARD */}
                              <div className='w-full flex flex-col gap-3 items-center'>
                                {request?.length > 0 ? 
                                  request?.map((req, i)=>(
                                    <FriendRequestCard
                                    key={i}
                                    req={req} 
                                    acceptRequest={acceptRequest} 
                                    deleteRequest={deleteRequest}/>
                                )):(
                                  <div>
                                    <h4 className='text-base text-ascent-2'>
                                      You have no friend requests
                                    </h4>
                                  </div>
                                )}
                              </div>
                          </div>
                      </div>

                </motion.div>
            )}

            {/* ToastContainer for notifications */}
            <ToastContainer position="bottom-right"/>
        </div>
  )
}

export default Home