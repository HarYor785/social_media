import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

//COMPONENTS
import TextField from './TextField'
import CustomButton from './CustomButton'
import Loader from './Loader'

//UTILLS
import { apiRequest } from '../utils'

const Signup = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState(false)
    const [message, setMessage] = useState("")
    const {
        handleSubmit,
        register,
        formState:{errors},
        getValues,
        reset
    } = useForm({
        mode: "onChange"
    })
    const onSubmt = async (data)=>{
        setIsLoading(true)
        setMessage("")
        try {
            const res = await apiRequest({
                url: "/auth/register",
                data: data,
                method: "POST"
            })
            if(res?.success){
                setErrorMsg(false)
                setMessage(res.message)
                reset()
            }else{
                setErrorMsg(true)
                setMessage(res.message)
            }
            console.log(res)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
            setMessage(error.message)
            setErrorMsg(true)
        }
    }
  return (
    <div className='w-full p-6 flex flex-col 
    gap-4 items-center'>
        <h1 className='text-[2rem] font-bold leading-3
        text-ascent-1'>SIGNUP</h1>

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
        className='w-full flex flex-col gap-2 mt-2'>
            <div className='flex w-full flex-col md:flex-row gap-1'>
                <TextField
                type="text"
                label="First Name"
                name="firstName"
                placeholder="First Name"
                styles="h-[50px] rounded-md bg-secondary"
                register={register("firstName",{
                    required:"This field is required.",
                })}
                error={errors?.firstName ? errors?.firstName.message : ""}
                />
                <TextField
                type="text"
                label="Last Name"
                name="lastName"
                placeholder="Last Name"
                styles="h-[50px] rounded-md bg-secondary"
                register={register("lastName",{
                    required:"This field is required.",
                })}
                error={errors?.lastName ? errors?.lastName.message : ""}
                />
            </div>
            <TextField
            type="text"
            label="Email"
            name="email"
            placeholder="Email Address"
            styles="h-[50px] rounded-md bg-secondary"
            register={register("email",{
                required:"This field is required.",
            })}
            error={errors?.email ? errors?.email.message : ""}
            />

            <div className='flex w-full flex-col md:flex-row gap-1'>
            <TextField
            type="password"
            label="Password"
            name="password"
            placeholder="Password"
            styles="h-[50px] rounded-md bg-secondary"
            register={register("password",{
                required:"This field is required.",
                minLength:{
                    value: 8,
                    message: "Password must be at least 8 characters long."
                }
            
            })}
            error={errors?.password ? errors?.password.message : ""}
            />

            <TextField
            type="password"
            label="Confirm Password"
            name="cpassword"
            placeholder="Confirm Password"
            styles="h-[50px] rounded-md bg-secondary"
            register={register("cpassword",{
                validate:(value)=>{
                    const {password} = getValues()
                    if(password != value){
                        return "Passwords do not match.";
                    }
                }
            })}
            error={errors?.cpassword ? errors?.cpassword.message : ""}
            />
            </div>
            {isLoading ? (
                <Loader/>
            ):(
                <CustomButton
                label="Submit"
                type="Submit"
                styles="bg-blue py-2 px-8 rounded-md text-white
                outline-none text-md font-semibold flex 
                items-center justify-center mt-3"
                />
            )}

        </form>
    </div>
  )
}

export default Signup