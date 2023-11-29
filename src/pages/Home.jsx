import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//REDUX 
import { setPosts } from '../redux/postSlice'

// COMPONENTS
import RigthBar from '../components/RigthBar'
import PostForm from '../components/PostForm'
import LeftBar from '../components/LeftBar'
import TopBar from '../components/TopBar'
import Stories from '../components/Stories'
import PostCard from '../components/PostCard'

//UTILS
import { SavedPosts, 
  deletePost, 
  getPosts, 
  likePost } from '../utils'

const Home = () => {
// Retrieve data from Redux state
const { theme } = useSelector((state) => state.theme);
const { user } = useSelector((state) => state.user);
const { posts } = useSelector((state) => state.posts);
const dispatch = useDispatch();

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

// useEffect to get posts on component mount
useEffect(() => {
  handleGetPost();
}, []);




  return (
    
      <div data-theme={theme} className='relative flex flex-col w-full 
      bg-bgColor h-screen overflow-hidden pb-20'>
        <TopBar handleGetPost={handleGetPost}/>
        <div className='h-full w-full flex mt-[5rem] gap-2 pb-3'>

          {/* RIGTH */}
          <div className='hidden md:flex w-1/3 lg:w-1/4 px-4 py-4 h-full 
          overflow-y-auto border-r-[1px] border-r-[#66666666]'>
            <RigthBar profile={false} handleGetPost={handleGetPost}/>
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
            <LeftBar/>
          </div>
        </div>
      </div>
    
  )
}

export default Home