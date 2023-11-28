import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from "react-hook-form"

//REDUX 
import { setPosts } from '../redux/postSlice'

// COMPONENTS
import RigthBar from '../components/RigthBar'
import LeftBar from '../components/LeftBar'
import TopBar from '../components/TopBar'
import Stories from '../components/Stories'
import CustomButton from '../components/CustomButton'
import PostCard from '../components/PostCard'
import Loader from '../components/Loader'
import { noProfile } from '../assets'

//UTILS
import { SavedPosts, 
  apiRequest, 
  deletePost, 
  getPosts, 
  handleFileUpload, 
  likePost } from '../utils'

//ICONS
import { BsCameraVideo, 
  BsFileImage, 
  BsFiletypeGif } from 'react-icons/bs'

const Home = () => {
// Retrieve data from Redux state
const { theme } = useSelector((state) => state.theme);
const { user } = useSelector((state) => state.user);
const { posts } = useSelector((state) => state.posts);
const dispatch = useDispatch();

// Component state variables
const [errorMsg, setErrMsg] = useState(false);
const [message, setMessage] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [file, setFile] = useState(null);
const [fileIsVideo, setFileIsVideo] = useState(false);

// React Hook Form configuration
const {
  register,
  handleSubmit,
  formState: { errors },
  reset
} = useForm();

// Function to handle file upload
const handleUploadFile = (e) => {
  const selectedFile = e.target.files[0];

  if (selectedFile) {
    if (fileIsVideo) {
      // Check video file size
      const fileSizeInByte = selectedFile.size;
      const fileSizeInMb = fileSizeInByte / (1024 * 1024);
      const maxFileSize = 15;

      if (fileSizeInMb > maxFileSize) {
        alert('The video size is too large, Max 10mb');
        e.target.value = null;
      } else {
        setFile(selectedFile);
      }
    } else {
      setFile(selectedFile);
    }
  }
};

// Function to get posts
const handleGetPost = async () => {
  await getPosts(user?.token, dispatch);
};

// Function to create a new post
const createPost = async (data) => {
  setIsLoading(true);
  setMessage("");

  try {
    // Upload file if present
    const fileUrl = file && (await handleFileUpload(file, fileIsVideo));
    const newData = fileUrl ? { ...data, file: fileUrl } : data;

    // Make API request to create a post
    const res = await apiRequest({
      url: "/post/create-post",
      method: "POST",
      data: newData,
      token: user?.token
    });

    // Handle API response
    if (res?.success) {
      reset();
      setErrMsg(false);
      setMessage(res?.message);
      handleGetPost();
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } else {
      setErrMsg(true);
      setMessage(res?.message);
    }

    setIsLoading(false);
  } catch (error) {
    console.log(error);
  }
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

// useEffect to get posts on component mount
useEffect(() => {
  handleGetPost();
}, []);




  return (
    
      <div data-theme={theme} className='relative flex flex-col w-full 
      bg-bgColor h-screen overflow-hidden pb-20'>
        <TopBar/>
        <div className='h-full w-full flex mt-[5rem] gap-2 pb-3'>
          {/* RIGTH */}
          <div className='hidden md:flex w-1/3 lg:w-1/4 px-4 py-4 h-full 
          overflow-y-auto border-r-[1px] border-r-[#66666666]'>
          <RigthBar profile={false} handleGetPost={handleGetPost}/>
          </div>
          {/* CENTER */}
          <div 
          className='flex-1 w-full md:px-2 px-5 py-4 h-full 
          overflow-y-auto flex flex-col gap-3 items-center'>
            {/* STORIES CARD */}
            <Stories/>
            {/* CREATE POST FORM */}

              <div className='w-full mt-3'>
                  <form 
                  onSubmit={handleSubmit(createPost)}
                  className='w-full flex flex-col items-center bg-secondary 
                  rounded-lg gap-2 px-4 py-2'>
                    <div
                    className='w-full flex items-center gap-3 border-b 
                    border-ascent-3 py-4'>
                      <img 
                      src={user?.profilePicUrl ?? noProfile} 
                      className='h-8 w-8 rounded-lg'
                      alt="Avatar" />
                      <input 
                      name='description'
                      type="text"
                      className='flex-1 bg-none outline-none border-none w-full 
                      h-full text-ascent-2 focus:bg-none'
                      placeholder={`What's new, ${user?.firstName}`}
                      {...register("description",{
                        required: "Give your post a description"
                      })}
                      />
                    </div>
                      {errors?.description 
                      ? <span className='text-sm text-[#f64949fe]'>
                        {errors?.description?.message}
                        </span> 
                      : ""}
                      {message && (
                        <span 
                        role='alert'
                        className={`text-sm 
                        ${errorMsg
                        ? 'text-[#f64949fe]' 
                        : 'text-[#2ba150fe]'} 
                        mt-0.5`}>
                          {message}
                        </span>
                      )}
                    <div className='w-full flex items-center justify-between
                    '>
                      <label 
                      onClick={()=>setFileIsVideo(false)}
                      htmlFor="imageUpload"
                      className='flex gap-2 items-center cursor-pointer text-ascent-2
                      hover:text-ascent-1 text-base'>
                        <input 
                        type="file"
                        id='imageUpload'
                        className='hidden'
                        accept='image/*'
                        onChange={(e)=>{handleUploadFile(e)}}
                        />
                        <BsFileImage/>
                        <span>Image</span>
                      </label>
                      <label 
                      onClick={()=>setFileIsVideo(false)}
                      htmlFor="gifUpload"
                      className='flex gap-2 items-center cursor-pointer text-ascent-2
                      hover:text-ascent-1 text-base'>
                        <input 
                        type="file"
                        id='gifUpload'
                        className='hidden'
                        accept='image/gif'
                        onChange={(e)=>{handleUploadFile(e)}}
                        />
                        <BsFiletypeGif/>
                        <span>Gif</span>
                      </label>
                      <label 
                      onClick={()=>setFileIsVideo(true)}
                      htmlFor="videoUpload"
                      className='flex gap-2 items-center cursor-pointer text-ascent-2
                      hover:text-ascent-1 text-base'>
                        <input 
                        type="file"
                        id='videoUpload'
                        className='hidden'
                        accept='video/*'
                        onChange={(e)=>handleUploadFile(e)}
                        />
                        <BsCameraVideo/>
                        <span>Video</span>
                      </label>
                      {isLoading ? <Loader/> : <CustomButton
                      type="submit"
                      label="Post it!"
                      styles="bg-blue text-white py-1.5 px-4 rounded-lg"
                      />}
                    </div>
                  </form>
              </div>
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

            {posts?.length > 0 && (
              <div>
                <span className='text-ascent-1 text-2xl'>No Post</span>
              </div>
            )}

          </div>
          {/* LEFT */}
          <div className='hidden md:flex w-1/4 px-2 py-4 h-full 
          overflow-y-auto border-l-[1px] border-l-[#66666666]'>
          <LeftBar/>
          </div>
        </div>
      </div>
    
  )
}

export default Home