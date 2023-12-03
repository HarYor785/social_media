import React, { useEffect, useRef, useState } from 'react'
import moment from "moment"
import InputEmoji from "react-input-emoji"

//UTTILS
import { addMessage, fetchUserInfo, 
    getMessages, handleFileUpload } from '../utils'

// ICONS
import { MdCall,MdPlayArrow } from "react-icons/md";
import { IoVideocam,IoSend } from "react-icons/io5";
import { TiInfoLarge } from "react-icons/ti";
import { GrAttachment } from "react-icons/gr";




const ChatsCard = ({chat,
    currentUser,
    setSendMessage,
    receiveMessage,
    handleGetChats,
    online}) => {
    const [userData, setUserData] = useState(null)
    const [newMessage, setNewMessage] = useState()
    const [isOnline, setIsOnline] = useState()
    const [messages, setMessages] = useState([])
    const [file, setFile] = useState()
    const scroll = useRef()


    //Handle text input field
    const handleChange = (newMessage)=>{
        setNewMessage(newMessage)
    }

    //Get user data
    const handleUserData = async()=>{
        const userId = chat?.participants?.find((id) => id !== currentUser?._id);
        const res = await fetchUserInfo(currentUser?.token, userId)
        setUserData(res.user)
    }

    //Fetch messages
    const fetchMessages = async ()=>{
        const res = await getMessages(currentUser?.token, chat?._id)
        setMessages(res)
    }

    // Get messages and check online users effect
    useEffect(()=>{
        const whosIsOnline = online(chat)
        setIsOnline(whosIsOnline)

        handleUserData()
        if(chat !== null) fetchMessages()
    },[chat, currentUser])

    // Send message
    const handleSend = async (e)=>{
        e.preventDefault()

        const uploadFile = file && (await handleFileUpload(file))

        const message =  {
            senderId: currentUser?._id,
            text: newMessage,
            attachment: uploadFile ? uploadFile : "",
            chatId: chat?._id
        }

        //send message to socket server
        const receiverId = chat?.participants.find((id)=> id !== currentUser?._id)
        setSendMessage({...message, receiverId})

        //SEND MESSAGE
        const res = await addMessage(currentUser?.token, message)
        setMessages([...messages, res])
        setNewMessage("")
        handleGetChats()

    }

    // Recieve message from socket.io
    useEffect(()=>{

        if(receiveMessage !== null && receiveMessage.chatId === chat?._id){
            setMessages([...messages, receiveMessage])
        }
    },[receiveMessage])
    
    //Always scroll to last message
    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior: "smooth"})
    },[messages])


  return (
    
        chat !== null ?(
            <div className={`md:flex-1 w-full min-h-screen flex flex-col `}>
                <div className='flex items-center justify-between py-2
                px-3 bg-primary'>
                    <div className='flex items-start gap-4'>
                        <div className='relative w-11 h-11 rounded-full p-0.5 
                        border border-ascent-2'>
                            <img 
                            src={userData?.profilePicUrl} 
                            className='w-full h-full rounded-full object-cover'
                            alt="" />
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-base text-ascent-2 font-bold'>
                                {userData?.firstName + " " + userData?.lastName}
                            </span>
                            <div className='flex gap-1 items-center'>
                                <span className='text-[12px] text-ascent-3 mt-[-4px]'>
                                    {isOnline ? "Online" : "Offline" }
                                </span>
                                <span className={`relative h-2 w-2 ${isOnline ? `bg-[#42e814]`
                                : `bg-[#666]`} rounded-full`}/>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-4'>
                        <button className='text-ascent-2'>
                            <MdCall size={18}/>
                        </button>
                        <button className='text-ascent-2'>
                            <IoVideocam size={18}/>
                        </button>
                        <button className='p-0.5 fle items-center justify-center
                        bg-blue rounded-full text-white'>
                            <TiInfoLarge size={18}/>
                        </button>
                    </div>
                </div>
                <hr className='border-[0.5px] border-[#66666666]'/>

                {/* CHAT MESSAGE */}
                <div className='w-full md:px-2 px-0 py-4 h-full 
                overflow-y-auto flex flex-col gap-3 items-center border border-primary'>
                    <div className='h-full flex flex-col items-start w-full gap-3 md:px-4 px-2'>
                        {/* MESSAGES */}
                        {messages?.map((message)=>(
                            <div 
                            ref={scroll}
                            className={`w-full flex flex-col gap-2 ${message?.senderId === 
                                currentUser?._id ? `justify-end items-end` 
                                : 'justify-start items-start'}`}
                            >
                                {message?.attachment && <img src={message?.attachment}
                                className='h-80 w-1/2 rounded-lg'/>}
                                <div 
                                className={`flex items-center
                                text-ascent-3 gap-2 ${message?.senderId === 
                                currentUser?._id ? `justify-end w-full` 
                                : 'justify-start flex-row-reverse'}`}>
                                    {/* MESSAGE DATE */}
                                    <span className='min-w-fit md:text-base text-xs'>
                                        {moment(message?.createdAt).format('h:mm A')}
                                    </span>
                                    {/* MESSAGE BODY */}
                                    <div className={`flex items-center gap-0 ${message?.senderId === 
                                    currentUser?._id ? `flex-row` : `flex-row-reverse`}`}>
                                        <div className={`w-fit flex items-center 
                                        justify-center p-2 text-white rounded-s-lg 
                                        rounded-e-lg ${message?.senderId === currentUser?._id
                                        ?`bg-blue`:`bg-[#2f2d30]`}`}>
                                            <span className='md:text-base text-sm'>{message.text}</span>
                                        </div>
                                        <MdPlayArrow className={`text-lg ${
                                        message?.senderId === currentUser?._id
                                        ?`text-blue ml-[-7px]`:`text-[#2f2d30] rotate-180 mr-[-7px]`
                                        }`}/>
                                    </div>
                                    {/* MESSAGE FROM USER IMG */}
                                    <img 
                                    className='w-8 h-8 rounded-full object-cover'
                                    src={message?.senderId === currentUser?._id 
                                        ? currentUser?.profilePicUrl 
                                        : userData?.profilePicUrl} 
                                    alt="" 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* START CHAT */}
                <div className='flex flex-col h-fit px-2 pt-1'>
                    <div className='flex items-center w-full mb-0'>
                        {/* ADD FILE */}
                        <label 
                        htmlFor='attachFile'
                        className='px-2.5 py-1 flex items-center 
                        justify-center text-ascent-2 cursor-pointer'>
                            <GrAttachment size={20}/>
                            <input type="file" 
                            onChange={(e)=>setFile(e.target.files[0])}
                            id='attachFile' 
                            accept='image/*'
                            className='hidden' />
                        </label>
                        {/* TEXT INPUT */}
                        <InputEmoji
                        value={newMessage}
                        onChange={handleChange}
                        />
                        {/* SUBMIT BUTTON */}
                        <button 
                        onClick={handleSend}
                        className='px-2 py-2 text-white bg-blue rounded-full'>
                            <IoSend size={20}/>
                        </button>
                    </div>
                </div>
            </div>
            ):(
                <div className='md:w-4/6 w-full flex justify-center py-4'>
                    <h1 className='text-base text-ascent-1'>
                        Tap on a chat to start a conversation...
                    </h1>
                </div>
            )
    
  )
}

export default ChatsCard