import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

//COMPONENTS
import CustomButton from './CustomButton'
import { noProfile } from '../assets'
import Loader from './Loader'

//UTILS
import { acceptFriendRequest, 
  deleteFriendRequest, 
  getFriendRequests, 
  getSuggestedFriends, 
  sendFriendRequest } from '../utils'
import { userLogin } from '../redux/userSlice'

const LeftBar = () => {
  const {user} = useSelector((state)=> state.user)
  const dispatch = useDispatch()
  const [suggested, setSuggested] = useState()
  const [request, setRequest] = useState()
  const [isLoading, setIsLoading] = useState(false)


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
      setIsLoading(false)
      console.log(error)
    }
  }

  // GET FRIEND REQUEST
  const getRequest = async ()=>{
    try {
      const res = await getFriendRequests(user?.token)
      if(res?.success){
        setIsLoading(false)
        setRequest(res?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // SEND FRIEND REQUEST
  const sendRequest = async (id)=>{
    const res = await sendFriendRequest(user?.token, id)
    console.log(res)
    if(res?.success){
      getSuggested()
      setRequest()
      window.alert(res?.message)
    }else{
      window.alert(res?.message)
    }
  }

  // ACCEPT REQUEST
  const acceptRequest = async (id)=>{
    const res = await acceptFriendRequest(user?.token, id)
    if(res?.success){
      window.alert(res?.message)
      const newData = {token: res?.token, ...res?.user}
      dispatch(userLogin(newData))
      getSuggested()
      setRequest()
    }else{
      window.alert(res?.message)
    }
  }

  // DECLINE FRIEND REQUEST
  const deleteRequest = async (id)=>{
    const res = await deleteFriendRequest(user?.token, id)
    console.log(res)
    if(res?.success){
      getSuggested()
      setRequest()
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


  useEffect(()=>{
    getRequest()
    getSuggested()
  },[])

  return (
    <div className='w-full'>
        <div className='flex flex-col gap-6 items-center justify-center 
        w-full'>
          {/* FRIENDS REQUESTS */}
          <div className='w-full flex flex-col gap-2 px-5'>
            <span className='w-full flex justify-between'>
              <h4 className='font-bold text-ascent-3 text-sm'>REQUESTS</h4>
              <span className='bg-blue text-white rounded-full text-xs 
              h-[18px] w-[18px] flex items-center justify-center'>
                {request?.length}
              </span>
            </span>

            {/* REQUEST LIST CARD */}
            <div className='w-full flex flex-col gap-3 items-center'>
              {isLoading ? <Loader/> : (
                request?.map((req)=>(
                  <div className='w-full bg-secondary px-5 py-5 rounded-lg
                  flex flex-col gap-3'>
                    {/* FRIENDS IMG & NAME */}
                    <Link 
                    to={`/profile/${req?.fromUser?._id}`}
                    className='w-full flex gap-2'>
                      <img src={req?.fromUser?.profilePicUrl ?? noProfile}
                      className='w-12 h-12 rounded-lg'
                      alt="AVATAR" />
                      <span className='text-ascent-2 text-sm block'>
                        <b className='mr-1'>{req?.fromUser?.firstName + " " + req?.fromUser?.lastName}</b>
                          wants to add you to friends
                      </span>
                    </Link>
                    {/* ACCEPT OR DECLINE BUTTON */}
                    <div className='w-full flex gap-4 items-center justify-between'>
                      <CustomButton
                      onClick={()=>acceptRequest(req?._id)}
                      label="Accept"
                      styles="w-full bg-blue text-white font-bold py-1 rounded-lg
                      border-2 border-blue"
                      />
                      <CustomButton
                      onClick={()=>deleteRequest(req?.fromUser?._id)}
                      label="Decline"
                      styles="w-full bg-none text-ascent-2 border-2 border-ascent-3 
                      font-bold py-1 rounded-lg"
                      />
                    </div>
                  </div>
                ))
              )}

            </div>
          </div>

          {/* PEOPLE YOU MAY KNOW */}
          <div className='w-full flex flex-col gap-2 px-5'>
            <span className='w-full flex justify-between'>
              <h4 className='font-bold text-ascent-3 text-sm'>PEOPLE YOU MAY KNOW</h4>
              <span className='bg-blue text-white rounded-full text-xs 
              h-[18px] w-[18px] flex items-center justify-center'>
                {suggested?.length}
              </span>
            </span>

            {/* PEOPLE LIST CARD */}
            <div className='w-full flex flex-col gap-3 items-center'>
              {/* CARD */}
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
  )
}

export default LeftBar