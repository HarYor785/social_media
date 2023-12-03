import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"

// IMPORT MODULES
import {io} from "socket.io-client"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {motion, AnimatePresence} from "framer-motion"

//REDUX
import { userLogout } from "../redux/userSlice";
import { SetTheme } from "../redux/theme";

//UTILLS
import { createChats, fetchUserInfo, 
    findConversation, getChats } from "../utils"

//ICONS
import { BiSolidMessageRoundedDots } from "react-icons/bi"
import { AiFillSetting } from "react-icons/ai";
import { SiQuantconnect } from "react-icons/si";
import { CiSearch } from "react-icons/ci";
import { PiNotePencilFill } from "react-icons/pi";
import { IoMoonSharp } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { FiSun } from "react-icons/fi";
import { Link } from "react-router-dom";
import { IoMdHome } from "react-icons/io";

//COMPONENTS
import Conversation from "../components/Conversation"
import ChatsCard from "../components/ChatsCard"




const Chat = ()=>{
    const {theme} = useSelector((state)=>state.theme)
    const {user} = useSelector((state)=>state.user)
    const [chats, setChats] = useState([])
    const [tab, setTab] = useState(1)
    const [userData, setUserData] = useState(null)
    const [currentChat, setCurrentChat] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [sendMessage, setSendMessage] = useState(null)
    const [receiveMessage, setReceiveMessage] = useState(null)
    const [value, setValue] = useState(null)
    const [openFriendsTab, setOpenFriendTab] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchFriends, setSearchFriends] = useState("")
    const dispatch = useDispatch()
    const socket = useRef()

    // Toggle theme
    const handleToggleTheme = () => {
        const themeValue = theme === "light" ? "dark" : "light"

        dispatch(SetTheme(themeValue))
    }
    
    //Get conversations
    const handleGetChats = async()=>{
        const res = await getChats(user?.token, user?._id)
        setChats(res)
    }

    // Fetch conversations user data
    useEffect(()=>{

        const fetchUserDataForChats = async ()=>{
            const userDataPromise = chats?.map(async(chat)=>{
                const userId = chat?.participants?.find((id)=>id !== user?._id)
                const res = await fetchUserInfo(user?.token, userId)
                return res?.user
            })

            const fetchedUserData = await Promise.all(userDataPromise)
            setUserData(fetchedUserData)
        }

        fetchUserDataForChats()
    },[user, chats])

    //Connect to socket.io
    useEffect(()=>{
        socket.current = io('ws://localhost:8800')
        socket.current.emit("new-user-add", user?._id)
        socket.current.on("get-users", (users)=>{
            setOnlineUsers(users)
           // console.log(onlineUsers)
        })
    },[chats, user])

    //Send message to the socket server
    useEffect(()=>{

        if(sendMessage !== null){
            socket.current.emit('send-message', sendMessage)
        }
    },[sendMessage])

    useEffect(()=>{
        socket.current.on("receive-message", (data)=>{
            setReceiveMessage(data)
            console.log("")

            toast.success(`You have new message`, {
                autoClose: 5000
            })
        })
    },[])

    //receive message
    useEffect(()=>{
        handleGetChats()

        //Auto hide sidebar
        const handleResize = () => {
            // Check if the viewport width is equal to or larger than the `md` breakpoint (768px)
            setIsSidebarOpen(window.innerWidth >= 768);

        };
      
          // Initial check on component mount
          handleResize();
      
          // Event listener for window resize
          window.addEventListener('resize', handleResize);
      
          // Cleanup the event listener on component unmount
          return () => {
            window.removeEventListener('resize', handleResize);
          };
    },[])

    //Start conversation
    const handleCreateChat = async (receiverId)=>{
        const res = await createChats(user?.token, user?._id, receiverId)
        handleGetChats()
        setOpenFriendTab(false)
    }

    //Check online status
    const checkOnlineStatus = (chat)=>{
        const chatMembers = chat?.participants.find((member)=>member !== user?._id)
        const userOnline = onlineUsers.find((user)=>user.userId === chatMembers)
        return userOnline ? true : false
    }

    //Search conversation
    useEffect(()=>{
        const handleSearchConversation = async () => {
            if(value !== ""){
                const filteredFriends = user?.friends?.filter((friend) =>
                    friend?.firstName?.toLowerCase().includes(value?.toLowerCase()) ||
                    friend?.lastName?.toLowerCase().includes(value?.toLowerCase())
                );
            
                const fetchUser = filteredFriends?.map(async (friend) => {
                    const getConversation = await findConversation(user?.token, user?._id, friend?._id);
                    return getConversation;
                });
            
                const result = await Promise.all(fetchUser);
                setChats(result);
            }
        }

        handleSearchConversation()
    },[value])

    //Get messages on Conversation click
    const handleChatClick = (chat)=>{
        setCurrentChat(chat);
        handleGetChats();
        setIsSidebarOpen(false)
    }

    //Toggle sidebar
    const toggleSidebar = () => {
        // Toggle sidebar only on screens equal to or larger than the `md` breakpoint (768px)
        setIsSidebarOpen(!isSidebarOpen);
    };


    return (
        <div data-theme={theme} className='relative flex flex-col w-full 
        bg-bgColor h-screen overflow-hidden pb-20'>
            <div className='h-full w-full flex pb-3'>

                {/* SIDEBAR */}
                <div className={`flex w-fit h-screen overflow-hidden 
                border-r-[1px] border-r-[#66666666] px-0`}>

                    {/* PROFILE IMG AND TAB BUTTONS */}
                    <div className={`w-fit flex 
                    flex-col items-center gap-4 py-4 px-0 border-r-[1px] border-r-secondary 
                    bg-ascent-4`}>
                        {/* PROFILE IMG */}
                        <img 
                        src={user?.profilePicUrl}
                        className="w-8 h-8 rounded-full object-cover" 
                        alt="" 
                        />  
                        {/* TAB BUTTONS */}
                        <button 
                        onClick={()=>{setTab(1)
                        tab === 2 || tab === 3 ? 
                        setIsSidebarOpen(true) : toggleSidebar()}}
                        className={`w-full px-4 py-3 relative ${tab === 1 
                        ? `bg-secondary text-blue before:content-[""] before:h-full
                        before:w-1 before:bg-blue before:absolute before:left-0 
                        before:bottom-0 before:rounded-lg` :'bg-ascent-4 text-ascent-2'
                        }`}>
                            <BiSolidMessageRoundedDots size={20}/>
                        </button>
                        <button 
                        onClick={()=>{setTab(2)
                        tab === 1 || tab === 3 
                        ? setIsSidebarOpen(true) : toggleSidebar()}}
                        className={`w-full px-4 py-3 relative ${tab === 2 
                        ? `bg-secondary text-blue before:content-[""] before:h-full
                        before:w-1 before:bg-blue before:absolute before:left-0 
                        before:bottom-0 before:rounded-lg` :'bg-ascent-4 text-ascent-2'
                        }`}>
                            <AiFillSetting size={20}/>
                        </button>
                        <Link
                        to="/" 
                        className={`w-full px-4 py-3 relative ${tab === 3 
                        ? `bg-secondary text-blue before:content-[""] before:h-full
                        before:w-1 before:bg-blue before:absolute before:left-0 
                        before:bottom-0 before:rounded-lg` :'bg-ascent-4 text-ascent-2'
                        }`}>
                            <IoMdHome size={20}/>
                        </Link>
                    </div>

                    {/* Sidebar  */}
                    {isSidebarOpen && (
                        <div className='md:hidden flex w-full h-full absolute bg-[rgba(0,0,0,0.1)] 
                        top-0 bottom-0 right-0 z-[10] left-[50px]'
                        onClick={()=>setIsSidebarOpen(false)}
                        />
                    )}

                    <div 
                    className={`${isSidebarOpen ? '' : 'hidden'} md:flex h-full flex-col py-0 
                    md:w-full min-w-[250px] max-w-[250px] overflow-hidden bg-secondary md:relative 
                    absolute z-50 left-[48px] md:left-0 drop-shadow-lg`}>

                        {/* CONVERSATIONS */}
                        {tab === 1 && (
                            <>
                                {/* SEARCH CONVERSATIONS */}
                                <div className="w-full py-2 px-3 border-b-[1px] border-[#66666666] 
                                z-50">
                                    <div className="w-full flex gap-2 items-center justify-center">
                                        <span className='bg-[#eff4fc] flex items-center justify-center
                                        p-2 rounded-lg'>
                                            <SiQuantconnect className='text-[#1877f2] md:text-2xl text-base'/>
                                        </span>
                                        {/* SEARCH */}
                                        <div 
                                        className='w-full flex items-center border
                                        border-primary h-[35px] bg-none rounded-full overflow-hidden'>
                                            <input 
                                            value={value}
                                            onChange={(e)=>setValue(e.target.value)}
                                            name='search'
                                            className='border-none bg-primary outline-none h-full w-full
                                            text-ascent-1 placeholder:text-ascent-2 placeholder:text-sm px-2'
                                            type="text" 
                                            placeholder='Search conversation'
                                            />
                                            <button 
                                            type='button'
                                            className='px-2 text-ascent-2 h-full rounded-full'
                                            >
                                                <CiSearch size={20}/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* CONVERSATIONS */}
                                <div className="w-full h-full overflow-y-auto">
                                    <div className="h-full flex flex-col">
                                        <div className="flex flex-col items-start gap-4 px-4 py-2">
                                            <div 
                                            className="w-full flex flex-col gap-4">
                                                <div className="w-full flex items-center justify-between">
                                                    <h1 className="text-ascent-1 text-2xl font-bold">Chats</h1>
                                                    <button 
                                                    onClick={()=>setOpenFriendTab(!openFriendsTab)}
                                                    className="p-1 text-blue font-bold">
                                                        <PiNotePencilFill size={25}/>
                                                    </button>
                                                </div>
                                                {/* START CONVERSATION */}
                                                <AnimatePresence>
                                                    {openFriendsTab && (
                                                        <motion.div 
                                                        key="conversation"
                                                        initial={{ opacity: 0, y: -20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                        transition={{ duration: 0.5 }}
                                                        className="relative flex items-start flex-col gap-3 border-b-4 
                                                        border-[#666]">
                                                            {/* SEARCH USER FRIENDS */}
                                                            <div className="w-full px-2 h-fit border border-primary rounded-lg 
                                                            py-1 flex gap-2">
                                                                <span className="text-base text-ascent-2">To:</span>
                                                                <input 
                                                                value={searchFriends}
                                                                onChange={(e)=>setSearchFriends(e.target.value)}
                                                                type="text"
                                                                className="w-full outline-none border-none bg-none text-ascent-2"
                                                                />
                                                            </div>
                                                            
                                                            {/* USER FRIENDS */}
                                                            <div className="w-full h-[250px] overflow-y-auto flex flex-col gap-2 px-2">
                                                                {user?.friends?.filter((item)=>{
                                                                    return searchFriends.toLowerCase() === "" ? item 
                                                                    : item?.firstName.toLowerCase().includes(searchFriends.toLowerCase()) || 
                                                                    item?.lastName.toLowerCase().includes(searchFriends.toLowerCase())
                                                                }).map((item)=>(
                                                                    <motion.button 
                                                                    key={item._id}
                                                                    initial={{ opacity: 0, y: -20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ duration: 0.5 }}
                                                                    onClick={()=>handleCreateChat(item?._id)}
                                                                    className="w-full flex items-start gap-3 py-2
                                                                    border-b-[1px] border-[#66666666]">
                                                                        <img 
                                                                        className="w-10 h-10 rounded-full object-cover"
                                                                        src={item?.profilePicUrl}
                                                                        alt="" />
                                                                        <span className="text-base text-ascent-2">
                                                                            {item?.firstName + " " + item?.lastName}
                                                                        </span>
                                                                    </motion.button>
                                                                ))}
                                                            </div>

                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                            </div>
                                            {/* CONVERSATION CARD */}
                                            <div className="w-full flex flex-col items-start gap-4 py-2">
                                                {Array.isArray(chats) && chats?.map((chat, index)=>(
                                                    <Conversation 
                                                    user={user}
                                                    handleClick={()=>handleChatClick(chat)}
                                                    userData={userData && userData[index]}
                                                    online={checkOnlineStatus(chat)}
                                                    chat={chat}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {/* SETINGS */}
                        {tab === 2 && (<>
                            <div className="w-full">
                                <div className="w-full flex flex-col">
                                    <img 
                                    src={user?.coverPicUrl} 
                                    className="w-full h-40"
                                    alt="" />
                                    <div className="w-full flex items-center justify-center 
                                    px-4 mt-[-30px]">
                                        <img 
                                        className="w-28 h-28 rounded-full object-cover"
                                        src={user?.profilePicUrl} alt="" />
                                    </div>
                                    <div className="w-full flex flex-col items-center justify-center">
                                        <h1 className="text-base text-ascent-1 font-bold">
                                            {user?.firstName + " " + user?.lastName}
                                        </h1>
                                        <span className="text-sm text-ascent-2">{user?.bio}</span>
                                        <Link 
                                        to="/profile"
                                        className="text-sm text-blue">Go to Profile</Link>
                                    </div>
                                    <div className="w-full px-4 mt-4 flex flex-col gap-4">
                                        <h1 className="text-base text-ascent-1 font-bold">Settings</h1>
                                        <div className="w-full flex flex-col items-start gap-3">
                                            <button 
                                            onClick={handleToggleTheme}
                                            className="w-full py-1 px-2 rounded-lg bg-bgColor
                                            flex items-center gap-2 text-base text-start text-ascent-1">
                                                {theme === "light" ? (
                                                    <><IoMoonSharp/> Darkmode</>
                                                ):(
                                                    <><FiSun/> Lightmode</>
                                                )}
                                            </button>
                                            <button 
                                            onClick={()=>dispatch(userLogout())}
                                            className="w-full py-1 px-2 rounded-lg bg-bgColor
                                            flex items-center gap-2 text-base text-start text-ascent-1">
                                                <MdLogout/>Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </>
                        )}
                    </div>

                </div>

                {/* CENTER - MESSAGEs CARD */}
                
                <ChatsCard 
                chat={currentChat} 
                online={checkOnlineStatus}
                currentUser={user}
                setSendMessage={setSendMessage}
                receiveMessage={receiveMessage}
                handleGetChats={handleGetChats}/>

            </div>

            {/* ToastContainer for notifications */}
            <ToastContainer position="bottom-right"/>
        </div>
    )
}

export default Chat