import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

//COMPONENTS
import TextField from './TextField'
import CustomButton from './CustomButton'
import Loader from './Loader'

//UTILS
import { apiRequest } from '../utils'
import { userLogin } from '../redux/userSlice'

const Login = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState(false)
    const [message, setMessage] = useState("")
    const dispatch = useDispatch()
    const {
        handleSubmit,
        register,
        formState:{errors},
    } = useForm({
        mode: "onChange"
    })
    
    const onSubmt = async (data)=>{
        setIsLoading(true)
        setMessage("")
        try {
            const res = await apiRequest({
                url: "/auth/login",
                data: data,
                method: "POST"
            })
            if(res?.success){
                const newData = {token: res?.token, ...res?.user}
                dispatch(userLogin(newData))
                window.location.replace('/')
            }else{
                setErrorMsg(true)
                setMessage(res.message)
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
            setErrorMsg(true)
            setMessage("Network Error, Try again")
        }
    }
  return (
    <div  className='w-full p-6 flex flex-col 
    gap-4 items-center'>
        <h1 className='text-[2rem] font-bold leading-3
        text-ascent-1'>LOGIN</h1>

        {message && (
            <div className={`w-full py-1 px-4 rounded-lg flex items-center justify-center 
            ${errorMsg ? 'bg-[#f64949fe]' : 'bg-[#2ba150fe]'}`}>
                <p className='text-white'>
                    {message}
                </p>
            </div>
        )}

        <form 
        onSubmit={handleSubmit(onSubmt)}
        className='w-full mt-7 flex flex-col gap-2'>
            <TextField
            type="text"
            name="email"
            label="Email"
            placeholder="Email Address"
            styles="h-[50px] rounded-md bg-secondary"
            register={register("email",{
                required:"This field is required.",
            })}
            error={errors?.email ? errors?.email.message : ""}
            />
            <TextField
            type="password"
            label="Password"
            name="password"
            placeholder="Password"
            styles="h-[50px] rounded-md bg-secondary"
            register={register("password",{
                required:"This field is required.",
            })}
            error={errors?.password ? errors?.password.message : ""}
            />

            <Link
            to="/auth/forgot-password"
            className='flex text-[#065ad8] mt-1 justify-end'
            >
                Forgot Password?
            </Link>

            {isLoading ? (
                <Loader/>
            ):(
                <CustomButton
                label="Login"
                type="Submit"
                styles={`bg-blue py-2 px-8 rounded-md text-white
                outline-none text-md font-semibold flex 
                items-center justify-center mt-6`}
                />
            )}

        </form>
    </div>
  )
}

export default Login