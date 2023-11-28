import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

//ICONS
import { GoHome } from "react-icons/go";
import { LuUserSquare2 } from "react-icons/lu";
import { FaRegNewspaper,FaRegUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { LiaTimesSolid } from "react-icons/lia";
import { SiQuantconnect } from "react-icons/si";
import { CiSearch } from "react-icons/ci";

//COMPONENTS
import CustomButton from './CustomButton';
import { noProfile } from '../assets'
import People from './People';

//UTILS
import { SetTheme } from '../redux/theme';
import { userLogout } from '../redux/userSlice';
import { deleteAccount, 
  getPosts, 
  getSuggestedFriends, 
  sendFriendRequest } from '../utils';

const RigthBar = ({profile, setMobile,handleGetPost}) => {
  
  const [menuTab, setMenuTab] = useState(false)
  const [showSuggested, setShowSuggested] = useState(false)
  const {theme} = useSelector((state)=>state.theme)
  const {user} = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [suggested, setSuggested] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
  } = useForm()

  const handleTheme = ()=>{
    const themeValue = theme === "ligth" ? "dark" : "ligth"

    dispatch(SetTheme(themeValue))
  }

   // GET SUGESTED FRIEND REQUEST
  const getSuggested = async ()=>{
    setIsLoading(true)
    try {
        const res = await getSuggestedFriends(user?.token)
        if(res?.success){
          setIsLoading(false)
          setSuggested(res?.data)
        }
    } catch (error) {
      console.log(error)
    }
  }

   // SEND FRIEND REQUEST
  const sendRequest = async (id)=>{
    const res = await sendFriendRequest(user?.token, id)
    if(res?.success){
      getSuggested()
      window.alert(res?.message)
    }else{
      window.alert(res?.message)
    }
  }

    // FILTER SUGGESTED FRIENDS
    const filterSuggested = (id)=>{
      const filterData = suggested?.filter((item)=> item._id !== id)
      setSuggested(filterData)
    }

    const handleSearch = async (data)=>{
      await getPosts(user?.token, dispatch, data, "")
  }

  const handleDeleteAccount = async()=>{
    const res = await deleteAccount(user?.token)
    if(res.success){
      dispatch(userLogout())
    }else{
      alert(res?.message)
    }
  }

  useEffect(()=>{
    getSuggested()
  },[])

  return (
    <>
      <div className='w-full md:relative absolute top-0 md:h-auto h-screen 
      z-[999] md:py-0 md:block flex '>
        <div className='md:hidden w-full h-full absolute bg-[rgba(0,0,0,0.1)]
              top-0 right-0 z-[998]'
              onClick={()=>setMobile(false)}
              />
        <div className='flex flex-col gap-6 md:items-center items-start 
        md:justify-center px-5 md:py-0 py-4 md:w-full  md:z-auto z-[999] md:h-auto h-full 
        md:bg-[transparent] bg-primary'>

          <Link 
          to="/"
          className='md:hidden flex gap-4 items-center'>
              <span className='bg-[#eff4fc] flex-items-center justify-center
              p-2 rounded-lg'>
                  <SiQuantconnect className='text-[#1877f2] text-2xl'/>
              </span>
              <h1 className='text-2xl font-bold text-ascent-1'>ConnectMe</h1>
          </Link>

          {/* SEARCH */}
          <form 
          onSubmit={handleSubmit(handleSearch)}
          className='md:hidden w-full flex items-center flex-row-reverse border 
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

          {/* USER CARD */}
          {!profile && (
              <Link
              to={`/profile`}
              className='w-full flex items-center gap-3 px-5 py-5
              bg-secondary rounded-lg shadow-sm'>
                  <img src={user.profilePicUrl ?? noProfile}
                  className='w-12 h-12 rounded-lg'
                  alt="" />
                  <div>
                      <h1 className='text-ascent-1 font-bold'>{user?.firstName + " " + user.lastName}</h1>
                      <p className='text-ascent-2 text-sm'>@{user?.userName}</p>
                  </div>
              </Link>
          )}

          {/* LINKS */}
            <div className='w-full flex flex-col items-center gap-2 px-5 py-5
            bg-secondary rounded-lg shadow-sm'>
              {/* HOME */}
              <Link
              onClick={handleGetPost}
              to="/"
              className='w-full flex gap-4 px-1 py-2 items-center
              border-b-[1px] border-bgColor'
              >
                <GoHome className='text-2xl font-bold text-ascent-3'/>
                <span className='text-[16px] text-ascent-2 font-bold'>Home</span>
              </Link>
              {/* PEOPLE */}
              <Link
              onClick={()=>{
                setShowSuggested(!showSuggested)
              }} 
              className='w-full flex justify-between px-1 py-2 items-center
              border-b-[1px] border-bgColor relative'
              >
                <span className='flex items-center gap-4'>
                  <LuUserSquare2 className='text-2xl font-bold text-ascent-3'/>
                  <span className='text-[16px] text-ascent-2 font-bold p-1'>People</span>
                </span>

                <span className='absolute right-0 bg-blue
                text-white rounded-full text-xs h-[18px] w-[18px] flex
                items-center justify-center'>{suggested?.length}</span>
              </Link>
              {/* NEWS FEED */}
              <Link
              to="/"
              className='w-full flex gap-4 px-1 py-2 items-center
              border-b-[1px] border-bgColor relative before:content-[""] before:h-full
              before:w-1 before:bg-blue before:absolute before:left-[-20px] before:rounded-lg'
              >
                <FaRegNewspaper className='text-2xl font-bold text-blue'/>
                <span className='text-[16px] text-blue font-bold'>News Feed</span>
              </Link>
              {/* PROFILE */}
              <Link
              to="/profile"
              className='w-full flex gap-4 px-1 py-2 items-center
              border-b-[1px] border-bgColor '
              >
                <FaRegUser className='text-2xl font-bold text-ascent-3'/>
                <span className='text-[16px] text-ascent-2 font-bold'>Profile</span>
              </Link>
              {/* SETTINGS */}
              <div className='w-full relative'>
                <Link
                onClick={()=>setMenuTab(!menuTab)}
                className='w-full flex gap-4 px-1 py-2 items-center relative'
                >
                  <IoSettingsOutline className='text-2xl font-bold text-ascent-3'/>
                  <span className='text-[16px] text-ascent-2 font-bold'>Settings</span>
                </Link>
                {/* MENU TAB */}
                {menuTab && (
                    <div className='absolute w-full h-fit py-2 gap-2 px-4 bg-primary 
                    right-0 top-12 flex items-start flex-col shadow-lg rounded-lg z-50'>
                        <button 
                        onClick={()=>{
                          handleTheme()
                          setMenuTab(false)
                        }}
                        className='text-base text-ascent-3 hover:text-ascent-1 
                        transition-all duration-300 ease-in-out'
                        >
                            Change Theme
                        </button>
                        <button 
                        onClick={()=>handleDeleteAccount()}
                        className='text-base text-ascent-3 hover:text-ascent-1 
                        transition-all duration-300 ease-in-out'
                        >
                            Delete Account
                        </button>
                        <button 
                        onClick={()=>dispatch(userLogout())}
                        className='text-base text-ascent-3 hover:text-ascent-1 
                        transition-all duration-300 ease-in-out'
                        >
                            Logout
                        </button>
                    </div>
                )}
              </div>
            </div>
            
            {/* ADVERTISE CARD */}
            <div className='hidden w-full md:flex flex-col gap-0.5'>
              <span className='flex justify-between items-center px-4'>
                <h4 className='font-bold text-ascent-3 text-sm'>ADVERTISEMENT</h4>
                <CustomButton
                label={<LiaTimesSolid/>}
                styles="text-ascent-3 font-bold rounded-lg"
                />
              </span>

              <div className='w-full flex flex-col items-center justify-center 
              px-5 py-5 bg-secondary rounded-lg shadow-sm relative'>
                <img 
                src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                className='w-full h-[150px] rounded-lg'
                alt="" />
              
                <div className='w-full flex flex-col mt-4'>
                  <h1 className='text-sm text-ascent-1 font-bold'>
                    Special Offer: 20% off today
                  </h1>
                  <Link 
                  to="/"
                  className='text-blue text-sm'>
                    https://nike.com
                  </Link>
                  <span className='w-full text-xs text-ascent-2'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Laudantium deserunt minima, dolorum expedita quaerat 
                  </span>
                </div>
              </div>
            </div>

            
        </div>

      </div>
        {/* PEOPLE */}
        {showSuggested && (
          <People
          suggested={suggested}
          setShowSuggested={setShowSuggested}
          filterSuggested={filterSuggested}
          sendRequest={sendRequest}
          isLoading={isLoading}
          user={user}
          />
        )}
    </>
  )
}

export default RigthBar