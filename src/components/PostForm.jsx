import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion';
import {io} from "socket.io-client"

//ICONS
import { BsCameraVideo, 
    BsFileImage, 
    BsFiletypeGif } from 'react-icons/bs'
  import { FaTimes } from "react-icons/fa";
import { noProfile } from '../assets';
import { useSelector } from 'react-redux';
import { apiRequest, handleFileUpload } from '../utils';
import { useForm } from 'react-hook-form';
import Loader from './Loader';
import CustomButton from './CustomButton';

const PostForm = ({handleGetPost}) => {
    const { user } = useSelector((state) => state.user);

    // Component state variables
    const [errorMsg, setErrMsg] = useState(false);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [displayFile, setDisplayFIle] = useState(null);
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
            const maxFileSize = 10;
    
            if (fileSizeInMb > maxFileSize) {
            alert('The video size is too large, Max 10mb');
            e.target.value = null;
            } else {
            setFile(selectedFile);
            }
        } else {
            setFile(selectedFile);
            const imageUrl = URL.createObjectURL(selectedFile)
            setDisplayFIle(imageUrl)
        }
        }
    };

    //Handle cancel file
    const handleCancelFile = ()=>{
        setFile(null);
        setDisplayFIle(null);
    }

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
            //Set both the file and displayFile to null after success
            setFile(null)
            setDisplayFIle(null)
            //Get posts
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
            setIsLoading(false)
        }
    };
    
  return (
    <motion.div 
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    exit={{opacity: 0}}
    transition={{duration: 0.5}}
    className='w-full mt-3'>
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
            className='flex gap-2 items-center cursor-pointer
            hover:text-ascent-1 text-base text-[#7ca683]'>
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
            className='flex gap-2 items-center cursor-pointer
            hover:text-ascent-1 text-base text-[#cf8d8b]'>
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
            className='flex gap-2 items-center cursor-pointer
            hover:text-ascent-1 text-base text-[#6a668e]'>
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
        {/* Display selected file */}
        {displayFile && (
        <div className='relative mt-2 w-full'>
            <img src={displayFile} 
            className='w-full h-[300px] object-cover rounded-md'
            alt="Post img" 
            />
            <span 
            onClick={handleCancelFile}
            className='absolute top-2 right-2 cursor-pointer'>
            <FaTimes size={20}/>
            </span>
        </div>
        )}
    </motion.div>
  )
}

export default PostForm