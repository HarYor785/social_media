import React from 'react'
import moment from 'moment'

// /UTILLS
import { markAsRead } from '../utils'

const Conversation = ({handleClick, userData, online, chat, user}) => {
    
    const markRead = async ()=>{
        await markAsRead(user?.token, chat?.latestMessage?._id)
        handleClick()
    }
  return (
    <div 
    onClick={markRead}
    className='w-full max-h-14 flex gap-2 items-start cursor-pointer
    hover:bg-bgColor py-2 border-b-[1px] border-[#66666666]'>
    
        <div className='relative w-14 h-11 rounded-full p-0.5 
        border border-ascent-2'>
            <img 
            src={userData?.profilePicUrl} 
            className='w-full h-full rounded-full object-cover'
            alt="" />
            <span className={`absolute right-0 top-8 h-3 w-3 
            ${online ? `bg-[#42e814]` : `bg-[#666]`} rounded-full 
            border border-ascent-2`}/>
        </div>
        <div className='w-full flex items-center justify-between'>
            <div className='flex-1 flex flex-col'>
                <span className='md:text-base text-sm text-ascent-2 font-bold'>
                    {userData?.firstName.length > 10 ?
                    userData?.firstName + " " + userData?.lastName.slice(0, 1)+"..."
                    : userData?.firstName + " " + userData?.lastName}
                </span>
                <span className='text-xs text-ascent-3'>
                    {chat?.latestMessage?.text && 
                    chat?.latestMessage?.text?.length > 20 ?
                    chat?.latestMessage?.text?.slice(0, 20)+"..." 
                    :chat?.latestMessage?.text}
                </span>
            </div>
            <div className='flex gap-1 items-center'>
                <span className='text-ascent-3 text-xs'>
                    {moment(chat?.latestMessage?.createdAt).format("h:mm A")}
                </span>
                {
                    chat?.latestMessage?.senderId !== user?._id && 
                    chat?.latestMessage?.status === 'unread' &&
                    <span className={`relative w-3 h-3 bg-blue rounded-full 
                    border border-ascent-2`}/>
                }

            </div>
        </div>
    </div>
  )
}

export default Conversation