import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

//ICON
import { FaPlus } from "react-icons/fa";

//UTILLS
import { apiRequest, handleFileUpload } from '../utils';

//COMPONENTS
import Loader from './Loader';
import { noProfile } from '../assets';


const Stories = () => {
    const {user} = useSelector((state)=>state.user)
    const dispatch = useDispatch()
    const [storyTab, setStoryTab] = useState(false)
    const [showStory, setShowStory] = useState(null)
    const [story, setStory] = useState(null)
    const [getStories, setGetStories] = useState(null)
    const [isLoading, setIsLoading] = useState(null)

    const handleShowStory = (val)=>{
        setShowStory(val)
        setStoryTab(!storyTab)
    }

    const handleGetStories = async ()=>{
        setIsLoading(true)
        try {
            const res = await apiRequest({
                url: "/post/get-story",
                token: user?.token
            })
    
            if(res?.success){
                setGetStories(res?.data)
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    const handleUploadStory = async (story)=>{
        setIsLoading(true)
        try {
            const storyUrl = await handleFileUpload(story)

            const res = await apiRequest({
                url: "/post/upload-story",
                data: {story: storyUrl},
                method: "POST",
                token: user?.token
            })

            if(res?.success){
                handleGetStories()
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    const handleStoryFile = (e)=>{
        const file = e.target.files[0]
        handleUploadStory(file)
    }

    useEffect(()=>{
        handleGetStories()
    },[])
  return (
    <div className='w-full flex items-center md:gap-2 gap-2 
    justify-start h-fit'>
        
        <div className='md:w-28 md:h-36 w-24 h-28 flex relative 
        rounded-lg overflow-hidden'>
            <img 
            src="https://images.pexels.com/photos/3783385/pexels-photo-3783385.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            className='w-full h-full'
            alt="" />
            <div className='w-full absolute transform bottom-2 flex 
            flex-col items-center justify-center gap-3'>
                <label 
                htmlFor='uploadStory'
                className='w-8 h-8 bg-transparent border-2 border-white 
                rounded-lg flex items-center justify-center p-1 cursor-pointer'>
                    <input 
                    type="file" 
                    className="hidden" 
                    id="uploadStory" 
                    onChange={(e)=>handleStoryFile(e)}
                    />
                    <FaPlus className='bg-white text-blue w-full h-full text-xs p-1 rounded-sm'/>
                </label>
                <span className="text-sm font-normal text-white">Add Story</span>
            </div>
        </div>

        {isLoading ? (<div className='h-36 flex items-center justify-center w-full'>
                <Loader/>
            </div>
        ) : getStories?.slice(0, 4).map((story, i)=>(
            <>
                <div 
                key={i}
                onClick={()=>handleShowStory(story?.story)}
                className='md:w-28 md:h-36 w-24 h-28 flex relative rounded-lg overflow-hidden'>
                    <img 
                    src={story?.story}
                    className='w-28 h-36 object-cover'
                    alt={story?.userId?.firstName} 
                    />
                    <div 
                    className='absolute transform flex 
                    flex-col items-start justify-between gap-3 h-full py-2 px-4'>
                        <Link
                        to={user?._id === story?.userId?._id ? "/profile" : `/profile/${story?.userId?._id}`}
                        className='w-9 h-9 p-0.5 rounded-lg border-2 border-white'
                        >
                            <img 
                            src={story?.userId?.profilePicUrl ?? noProfile}
                            className='w-ful h-full rounded-md object-cover'
                            alt="" 
                            />
                        </Link>
                        <Link 
                        to={user?._id === story?.userId?._id ? "/profile" : `/profile/${story?.userId?._id}`}
                        className="md:text-sm text-xs font-semibold text-white">
                            {story?.userId?.firstName + " " + story?.userId?.lastName}
                        </Link>
                    </div>
                </div>
                {storyTab && (
                <div 
                key={i}
                onClick={()=>setStoryTab(false)}
                className='fixed top-0 bottom-0 left-0 right-0 md:px-0 px-10 h-full 
                w-full z-[100] bg-[rgba(0,0,0,0.1)] mt-16 py-5'>
                    <div className='md:w-1/2 w-full flex justify-center m-auto 
                    items-center h-full pb-20'>
                        <div className='w-full flex flex-col rounded-lg bg-secondary 
                        p-6 gap-2 h-full'>
                            <img 
                            src={showStory} 
                            className='w-full h-full rounded-lg'
                            alt="" />
                        </div>
                    </div>
                </div>
                )}
            </>
        ))}
    </div>
  )
}

export default Stories