import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form'

//REDUX
import { updateProfile, 
    userLogin } from '../redux/userSlice';

//COMPONENTS
import TextField from './TextField'
import { noProfile } from '../assets'
import CustomButton from './CustomButton';
import Loader from './Loader';

//UTILS
import { apiRequest, handleFileUpload } from '../utils';

//ICONS
import { MdAddPhotoAlternate } from "react-icons/md";
import { FaTimes } from "react-icons/fa";

const EditProfile = ({updated}) => {
    const {user} = useSelector((state)=>state.user)
    const dispatch = useDispatch()
    const [uploadImage, setUploadImage] = useState(null)
    const [uploadCover, setUploadCover] = useState(null)
    // CREATE A FUNCTION TO DISPLAY SELECTED IMAGE, 
    //CLOUDINARY DOES NOT SUPPORT URL.createObjectURL()
    const [showProfilePic, setShowProfilePic] = useState(null)
    const [showCoverPic, setShowCoverPic] = useState(null)
    // LOADING AND ERROR MESSAGE
    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState(false)
    const [message, setMessage] = useState("")
    const {
        register,
        handleSubmit,
        formState:{errors},
        getValues
    } = useForm({
        mode:"onChange",
        defaultValues: {...user}
    })

    // UPLOAD IMAGE
    const handleUploadImage = (event)=>{
        const file = event.target.files[0]

        if(file){
            const imageUrl = URL.createObjectURL(file)
            setUploadImage(file)
            setShowProfilePic(imageUrl)
        }
    }

    // UPLOAD COVER PHOTO
    const handleCoverImage = (event)=>{
        const file = event.target.files[0]

        if(file){
            const imageUrl = URL.createObjectURL(file)
            setUploadCover(file)
            setShowCoverPic(imageUrl)
        }
    }

    // UPLOAD PROFILE
    const onSubmit = async (data)=>{
        setIsLoading(true)
        setMessage("")
        try {
            const profilePic = uploadImage && (await handleFileUpload(uploadImage))
            const coverPic = uploadCover && (await handleFileUpload(uploadCover))
            const {firstName,lastName,userName,dateOfBirth,
                    email, bio, profession, location, mobile,hobbies} = data
            
            const res = await apiRequest({
                url: "/user/update-profile",
                method: "PUT",
                data:{
                    firstName,
                    lastName,
                    userName,
                    dateOfBirth: dateOfBirth ? dateOfBirth : user?.dateOfBirth,
                    email,
                    bio,
                    mobile,
                    profession,
                    location,
                    hobbies,
                    profilePicUrl: profilePic ? profilePic : user?.profilePicUrl,
                    coverPicUrl: coverPic ? coverPic : user?.coverPicUrl
                },
                token: user?.token
            })
            if(res.success){
                updated()
                setMessage(res?.message)
                const newData = {token: res?.token, ...res?.user}
                dispatch(userLogin(newData))
                setTimeout(() => {
                    dispatch(updateProfile(false))
                }, 2000);
            }else{
                setErrorMsg(true)
                setMessage(res?.message)
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    const today = new Date().toISOString().split('T')[0]

  return (
    <div className='w-full h-full absolute top-0 left-0 
    z-[998] flex items-center justify-center '>
        <div className='relative flex flex-col py-4 w-full h-full pt-20'>

            <div className='w-full h-full absolute bg-[rgba(0,0,0,0.1)] 
            top-0 left-0 bottom-0 right-0'
            onClick={()=>dispatch(updateProfile(false))}/>

            <div className='flex md:w-1/2 bg-secondary p-4 rounded-lg
            m-auto items-center justify-center z-50 overflow-y-auto'>
                <div className='w-full h-full flex flex-col'>
                    <span className='flex justify-end'>
                        <button
                        className='p-1.5 text-white rounded-md bg-[#f64949f3]'
                        onClick={()=>dispatch(updateProfile(false))}
                        >
                            <FaTimes size={20}/>
                        </button>
                    </span>
                    
                    {message && (
                        <div className={`w-full py-1 px-4 rounded-lg flex items-center justify-center 
                        ${errorMsg ? 'bg-[#f64949fe]' : 'bg-[#2ba150fe]'}`}>
                            <p className='text-white'>
                                {message}
                            </p>
                        </div>
                    )}
                    <form 
                    onSubmit={handleSubmit(onSubmit)}
                    className='flex flex-col gap-2'>

                        {/* FIRSTNAME && LASTNAME */}
                        <div className='w-full flex items-center gap-2'>
                            <TextField
                            label="First Name"
                            placeholder="Enter First Name"
                            name="firstName"
                            type="text"
                            styles="rounded-lg w-full"
                            register={register("firstName",{
                                required: "This Field is required"
                            })}
                            error={errors?.firstName ? errors?.firstName.message : ""}
                            />
                            <TextField
                            label="Last Name"
                            placeholder="Enter Last Name"
                            name="lastName"
                            type="text"
                            styles="rounded-lg w-full"
                            register={register("lastName",{
                                required: "This Field is required"
                            })}
                            error={errors?.lastName ? errors?.lastName.message : ""}
                            />
                        </div>
                        {/* USERNAME && DATEOFBIRTH */}
                        <div className='w-full flex items-center gap-2'>
                            <TextField
                            label="Username"
                            placeholder="Enter Username"
                            name="userName"
                            type="text"
                            styles="rounded-lg w-full"
                            register={register("userName",{
                                required: "This Field is required"
                            })}
                            error={errors?.userName ? errors?.userName.message : ""}
                            />
                            <TextField
                            label="Date of Birth"
                            placeholder="Enter Last Name"
                            name="dateOfBirth"
                            type="date"
                            styles="rounded-lg w-full"
                            register={register("dateOfBirth",{
                                pattern:{
                                    value: `\\d{4}-\\d{2}-\\d{2}`,
                                    message: "Invalid format"
                                },
                                max: today
                            })}
                            error={errors?.dateOfBirth ? errors?.dateOfBirth.message : ""}
                            />
                        </div>
                        
                        {/* BIO */}
                        <div className='w-full flex flex-col gap-2 items-start'>
                            <label htmlFor="bio"
                            className='text-ascent-2 text-sm'>
                                Bio
                            </label>
                            <div className='w-full flex flex-col gap-0.5'>
                                <textarea 
                                name="bio" 
                                className='w-full bg-secondary outline-none border 
                                border-[#969696] rounded-lg p-2 placeholder:text-[#666]
                                text-ascent-1'
                                id="bio" 
                                placeholder='Enter Bio'
                                rows="3"
                                {...register("bio")}/>
                                {errors?.bio && (
                                    <span className='text-xs mt-2 text-[#f64949f3]'>
                                        {errors?.bio.message}
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {/* EMAIL && MOBILE */}
                        <div className='w-full flex items-center gap-2'>
                            <TextField
                            label="Email"
                            placeholder="Enter Email"
                            name="email"
                            type="email"
                            styles="rounded-lg w-full"
                            register={register("email",{
                                required: "This Field is required"
                            })}
                            error={errors?.email ? errors?.email.message : ""}
                            />
                            <TextField
                            label="Mobile"
                            placeholder="Enter Mobile"
                            name="mobile"
                            type="text"
                            styles="rounded-lg w-full"
                            register={register("mobile",{
                                required: "This Field is required"
                            })}
                            error={errors?.mobile ? errors?.mobile.message : ""}
                            />
                        </div>

                        {/* PROFESSION && LOCATION */}
                        <div className='w-full flex items-center gap-2'>
                            <TextField
                            label="Profession"
                            placeholder="Enter Profession"
                            name="profession"
                            type="text"
                            styles="rounded-lg w-full"
                            register={register("profession",{
                                required: "This Field is required"
                            })}
                            error={errors?.profession ? errors?.profession.message : ""}
                            />
                            <TextField
                            label="Location"
                            placeholder="Enter Location"
                            name="location"
                            type="text"
                            styles="rounded-lg w-full"
                            register={register("location",{
                                required: "This Field is required"
                            })}
                            error={errors?.location ? errors?.location.message : ""}
                            />
                        </div>

                        {/* HUBBIES */}
                        <div className='w-full flex flex-col gap-2 items-start'>
                            <label htmlFor="hobbies"
                            className='text-ascent-2 text-sm'>
                                Hobbies
                            </label>
                            <div className='w-full flex flex-col gap-0.5'>
                                <textarea 
                                name="hobbies" 
                                className='w-full bg-secondary outline-none border 
                                border-[#969696] rounded-lg p-2 placeholder:text-[#666]
                                text-ascent-1'
                                id="hobbies" 
                                placeholder='Enter Hobbies'
                                rows="2"
                                {...register("hobbies")}/>
                                {errors?.hobbies && (
                                    <span className='text-xs mt-2 text-[#f64949f3]'>
                                        {errors?.hobbies.message}
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {/* UPLOAD IMAGE && COVER */}
                        <div className='flex items-center gap-2 justify-between
                        border-b-[1px] border-ascent-3 pb-2'>
                            <div className='flex flex-col gap-2'>
                                <span className='text-ascent-2 text-sm'>
                                    Upload Profile Pic
                                </span>
                                <div className='relative w-28 h-28'>
                                    <img 
                                        src={showProfilePic ?? noProfile} 
                                        className='rounded-full w-28 h-28'
                                        alt="" 
                                    />
                                    <label htmlFor="uploadImage"
                                    className='absolute bottom-0 right-2 bg-ascent-2
                                    rounded-full p-1 text-white cursor-pointer'>
                                        <MdAddPhotoAlternate size={20}/>
                                        <input type="file"
                                        className='hidden'
                                        id='uploadImage'
                                        accept='image/*'
                                        onChange={handleUploadImage}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <span className='text-ascent-2 text-sm'>
                                    Upload Cover Pic
                                </span>
                                <div className='relative w-28 h-28'>
                                    <img 
                                        src={showCoverPic ?? noProfile} 
                                        className='rounded-full w-28 h-28'
                                        alt="" 
                                    />
                                    <label htmlFor="uploadCover"
                                    className='absolute bottom-0 right-2 bg-ascent-2
                                    rounded-full p-1 text-white cursor-pointer'>
                                        <MdAddPhotoAlternate size={20}/>
                                        <input type="file"
                                        className='hidden'
                                        id='uploadCover'
                                        onChange={handleCoverImage}
                                        accept='image/*'
                                        />
                                    </label>
                                </div>
                            </div>

                        </div>

                        <div className='mt-2 flex items-end justify-end mb-4'>
                            {isLoading ? (<Loader/>):(
                                <CustomButton
                                label="Submit"
                                type="submit"
                                styles="bg-blue py-2 px-4 text-white rounded-md"
                                />
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default EditProfile