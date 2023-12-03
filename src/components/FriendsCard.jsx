import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

//COMPONETS
import CustomButton from './CustomButton'
import { noProfile } from '../assets'

//UTILS
import { deleteFriend } from '../utils'
import { updateProfile, userLogin } from '../redux/userSlice'



const FriendsCard = ({friends, getUser}) => {
    const {user} = useSelector((state)=> state.user)
    const dispatch = useDispatch()
    const handleDeleteFriend = async (id)=>{
        try {
            const res = await deleteFriend(user?.token, id)
            if(res.success){
                window.alert(res.message)
                getUser();
                const newData = {token: res?.token, ...res?.user}
                dispatch(userLogin(newData))
                setTimeout(() => {
                dispatch(updateProfile(false))
                }, 2000);
                }else{
                window.alert(res.message)
            }
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className='w-full mt-6 flex flex-col gap-8'>
        <div className='w-full bg-secondary flex flex-col 
        gap-5 p-4 rounded-lg'>
            {friends?.map((friend, i)=>(
                <div 
                key={i}
                className='flex items-center justify-between py-2
                border-b-[1px] border-ascent-3'>
                    <Link 
                    to={`${user?._id === friend._id ? "/profile" : `/profile/${friend?._id}`} `}
                    className='flex gap-3'>
                        <img src={friend?.profilePicUrl ?? noProfile}
                        className='w-12 h-12 rounded-lg'
                        alt="" />
                        <div>
                            <h1 className='text-ascent-1 font-bold'>
                                {friend?.firstName + " " + friend?.lastName}
                            </h1>
                            <p className='text-ascent-2 text-sm'>@{friend?.userName}</p>
                        </div>
                    </Link>

                    {friend?._id !== user?._id && (
                        <div className='flex items-center gap-2'>
                            <Link 
                            to="/chat"
                            className='border border-blue py-1.5 px-2 text-ascent-1 rounded-full 
                            text-sm hover:bg-blue transition-colors ease-in-out'>
                                Message
                            </Link>
                            <CustomButton
                            label="Unfriend"
                            onClick={()=>handleDeleteFriend(friend?._id)}
                            styles="bg-blue py-1.5 px-2 text-white rounded-full text-sm"
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>

  )
}

export default FriendsCard