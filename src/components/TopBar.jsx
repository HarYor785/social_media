import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

//ICONS
import { SiQuantconnect } from "react-icons/si";
import { FaRegPlusSquare,FaRegMoon } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { FiSun } from "react-icons/fi";
import { IoMdNotifications } from "react-icons/io";
import { BiSolidMessageDetail } from "react-icons/bi";
import { RiMenu3Fill } from "react-icons/ri";

//UTILLS
import {SetTheme} from "../redux/theme"
import {toggleRequestTab, userLogout } from '../redux/userSlice';
import { getPosts } from '../utils';

//COMPONENTS
import RigthBar from './RigthBar';
import { noProfile } from '../assets';
import PostForm from './PostForm';

const TopBar = ({handleGetPost,request}) => {
    const {theme} = useSelector((state) => state.theme)
    const {user} = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [menuTab, setMenuTab] = useState(false) 
    const [postTab, setPostTab] = useState(false) 
    const [mobile, setMobile] = useState(false) 
    const {
        register,
        handleSubmit,
    } = useForm()

    const handleToggleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light"

    dispatch(SetTheme(themeValue))
    }

    const handleSearch = async (data)=>{
        await getPosts(user?.token, dispatch, data, "")
    }

  return (
    <>
    <div
    className='w-full fixed md:px-8 px-3 py-4 bg-secondary drop-shadow-sm z-[999]'>
        <div className='flex items-center justify-between'>
            <Link 
            to="/"
            className='flex gap-4 items-center'>
                <span className='bg-[#eff4fc] flex items-center justify-center
                p-2 rounded-lg'>
                    <SiQuantconnect className='text-[#1877f2] md:text-2xl'/>
                </span>
                <h1 className='md:text-2xl text-base font-bold text-ascent-1'>ConnectMe</h1>
            </Link>
            {/* SEARCH */}
            <form 
            onSubmit={handleSubmit(handleSearch)}
            className='hidden w-[300px] md:flex items-center flex-row-reverse border 
            border-ascent-2 h-[40px] bg-secondary rounded-lg overflow-hidden'>
                <input 
                name='search'
                className='border-none bg-secondary outline-none h-full w-full
                text-ascent-1'
                type="text" 
                placeholder='Search'
                {...register('search')}
                />
                <button 
                type='submit'
                className='px-2 text-ascent-1 text-2xl'
                >
                    <CiSearch/>
                </button>
            </form>
            {/* ICONS */}
            <div className='flex items-center gap-4'>
                {/* NOTIFICATION BUTTON */}
                <button
                onClick={()=>dispatch(toggleRequestTab(true))}
                className='text-2xl text-ascent-2 relative'
                >
                    <IoMdNotifications/>
                    {request?.length > 0 && (
                        <span className='absolute bottom-3 right-0 bg-[#f64949fe]
                        text-white rounded-full text-xs h-[15px] w-[15px] flex
                        items-center justify-center'>{request?.length}</span>
                    )}
                </button>
                {/* TOGGLE THEME BUTTON */}
                <button
                onClick={()=>handleToggleTheme()}
                className='text-[18px] text-ascent-2'
                >
                    {theme === "light" ? <FaRegMoon/> : <FiSun className='text-yellow-500'/>}
                </button>
                {/* MESSAGE BUTTON */}
                <Link
                to='/chat'
                className='text-2xl text-ascent-2 relative'
                >
                    <BiSolidMessageDetail/>
                    {/*{notifications?.text?.length > 0 && 
                        <span className='absolute bottom-3 right-0 bg-[#f64949fe]
                        text-white rounded-full text-xs h-[15px] w-[15px] flex
                        items-center justify-center'>{notifications?.text?.length}</span>
                    }*/}
                </Link>
                {/* CREATE POST BUTTON */}
                <button 
                onClick={()=>setPostTab(!postTab)}
                className='bg-[#1877f2] hidden md:flex items-center justify-center
                p-2 px-2 rounded-lg gap-1 text-white font-semibold'>
                    <FaRegPlusSquare/>
                    <span className='text-sm'>Create</span>
                </button>
                {/* USER BUTTON */}
                <div className='relative flex items-center flex-col'>
                    <button
                    onClick={()=>setMenuTab(!menuTab)}
                    >
                        <img 
                        src={user?.profilePicUrl ?? noProfile}
                        className='w-8 h-8 rounded-lg'
                        alt="Avatar" />
                    </button>
                    {menuTab && (
                        <>
                            <div className='absolute w-screen h-screen' onClick={()=>setMenuTab(false)}/>
                            <div className='absolute w-[120px] h-fit py-2 gap-2 px-4 bg-primary 
                            right-0 top-10 flex items-start flex-col shadow-lg rounded-lg z-50'>
                                <Link
                                to={`/profile`} 
                                onClick={()=>setMenuTab(false)}
                                className='text-base text-ascent-3 hover:text-ascent-1 
                                transition-all duration-300 ease-in-out'
                                >
                                    Profile
                                </Link>
                                <Link 
                                onClick={()=>dispatch(userLogout())}
                                className='text-base text-ascent-3 hover:text-ascent-1 
                                transition-all duration-300 ease-in-out'
                                >
                                    Logout
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                {/* MOBILE MENU BUTTON BUTTON */}
                <button
                onClick={()=>setMobile(!mobile)}
                className='md:hidden text-2xl text-ascent-1 relative'
                >
                    <RiMenu3Fill/>
                </button>

            </div>
        </div>
    </div>
    
    {/* MOBILE SIDEBAR MENU */}
    {mobile && (
        <div 
        className='md:hidden z-[1000]'
        initial={{x: "-100%"}}
        animate={{x: 0}}
        exit={{x: "-100%"}}
        transition={{duration: 0.5, ease: "easeInOut"}}
        >
            <RigthBar setMobile={setMobile}/>
        </div>
    )}

    {/* CREATE POST FORM */}
    {postTab && (
        <div className='w-full h-full absolute top-0 left-0 
        z-[1005] flex items-center justify-center'>
            <div className='w-full h-full absolute bg-[rgba(0,0,0,0.1)] 
            top-0 left-0 bottom-0 right-0 z-[1001]'
            onClick={()=>setPostTab(false)}
            />
            
            <div className='relative flex flex-col py-4 w-full h-full md:px-0 px-10'>

                <div className='flex md:w-1/2 w-full bg-secondary p-4 rounded-lg
                m-auto items-center justify-center z-[1003]'>
                    <PostForm handleGetPost={handleGetPost}/>
                </div>

            </div>
        </div>
    )}
    </>
  )
}

export default TopBar