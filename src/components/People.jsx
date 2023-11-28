import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion';

//ICON
import { FaTimes } from "react-icons/fa";

//COMPONENTS
import Loader from './Loader';
import { noProfile } from '../assets';

const People = ({setShowSuggested,
    suggested,
    filterSuggested,
    sendRequest,
    isLoading,
    user}) => {
  return (
    <motion.div 
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    exit={{opacity: 0}}
    transition={{duration: 0.5}}
    className='w-full h-full absolute md:top-0 left-0 
    z-[1005] flex items-center justify-center '>
        <div className='relative flex flex-col py-4 w-full h-full pt-20 
        md:px-0 px-8'>

            <div className='w-full h-full absolute bg-[rgba(0,0,0,0.1)] 
            top-0 left-0 bottom-0 right-0 z-[1001]'
            onClick={()=>setShowSuggested(false)}
            />

            <div className='flex md:w-1/2 w-full bg-secondary p-4 rounded-lg
            m-auto items-center justify-center z-50 overflow-y-auto'>
                <div className='w-full h-full flex flex-col'>
                    <span className='flex justify-end'>
                        <button
                        className='p-1.5 text-white rounded-md bg-[#f64949f3]'
                        onClick={()=>setShowSuggested(false)}
                        >
                            <FaTimes size={15}/>
                        </button>
                    </span>
                    <div className='w-full flex flex-col gap-2 px-5 mt-4'>

                        <span className='w-full flex justify-between'>
                            <h4 className='font-bold text-ascent-3 text-sm'>PEOPLE YOU MAY KNOW</h4>
                            <span className='bg-blue text-white rounded-full text-xs 
                            h-[18px] w-[18px] flex items-center justify-center'>
                                {suggested?.length}
                            </span>
                        </span>

                        {isLoading ? <Loader/> : (
                            suggested?.map((suggest)=>(
                                <div className='w-full bg-secondary px-5 py-5 rounded-lg
                                flex flex-col gap-3'>
                                    <Link
                                    to={`/profile/${suggest?._id}`}
                                    className='w-full flex gap-2'>
                                        <img src={suggest?.profilePicUrl ?? noProfile}
                                        className='w-12 h-12 rounded-lg'
                                        alt="AVATAR" />
                                        <span className='text-ascent-2 text-sm flex flex-col'>
                                            <b className='mr-1'>{suggest?.firstName + " " + suggest?.lastName}</b>
                                            <span>@{suggest?.userName}</span>
                                        </span>
                                    </Link>
                                    <div className='w-full flex gap-4 items-center justify-between'>
                                        {/* SEND FRIEND REQUEST BUTTON AND DISABLE AFTER REQUEST SENT*/}
                                        <button
                                        onClick={()=>sendRequest(suggest?._id)}
                                        className={`w-full text-white font-bold py-1 rounded-lg
                                        ${suggest?.friendRequests?.some((friend)=>friend._id === user?.userId) 
                                        ? "bg-[#00008b] border-2 border-[#00008b] " :  "bg-blue border-2 border-blue "} `}
                                        disabled={suggest?.friendRequests?.some((friend)=>friend._id === user?.userId) ? true : false}
                                        >
                                            {suggest?.friendRequests?.some((friend)=>friend._id === user?.userId) ? "Sent" : "Add"}
                                        </button>
                                        {/* REMOVE FROM PEOPLE YOU MAY KNOW */}
                                        <button
                                        className="w-full bg-none text-ascent-2 border-2 border-ascent-3 
                                        font-bold py-1 rounded-lg"
                                        onClick={()=>filterSuggested(suggest?._id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}

                    </div>

                </div>
            </div>
        </div>
    </motion.div>
  )
}

export default People