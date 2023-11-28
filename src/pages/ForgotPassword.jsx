import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

//COMPONENTS
import CustomButton from '../components/CustomButton'
import TextField from '../components/TextField'
import Loader from '../components/Loader'

//UTILLS
import { apiRequest } from '../utils'

const ForgotPassword = () => {
  const {theme} = useSelector((state)=>state.theme)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(false)
  const [message, setMessage] = useState("")
  const {
    handleSubmit,
    register,
    formState:{errors},
    reset
} = useForm({
    mode: "onChange"
})

const onSubmt = async (data)=>{
  setIsLoading(true)
  setMessage("")
  try {
    const res = await apiRequest({
      url: "/user/forgot-password",
      data: data,
      method: "POST"
    })
    if(res?.success){
      reset()
      setErrorMsg(false)
      setMessage(res?.message)
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

  return (
    <div data-theme={theme} className='h-screen flex items-center 
    justify-center p-6 py-8 bg-bgColor'>
        <div className='h-fit w-[400px] flex items-center justify-center 
        shadow-lg rounded-lg bg-primary overflow-hidden'>
          <div  className='w-full p-6 flex flex-col 
          gap-4 items-center'>
            <h1 className='text-[1.5rem] font-bold leading-3
            text-ascent-1'>FORGOT PASSWORD</h1>

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
            className='w-full mt-8 flex flex-col gap-2'>
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

                <Link
                to="/auth/account"
                className='flex text-[#065ad8] mt-1 justify-end'
                >
                    Remember password? Login.
                </Link>
                {isLoading ? (<Loader/>):(
                  <CustomButton
                  label="Submit"
                  type="Submit"
                  styles={`bg-blue py-2 px-8 rounded-md text-white
                  outline-none text-md font-semibold flex 
                  items-center justify-center mt-6`}
                  />
                )}

            </form>
          </div>
        </div>
    </div>
  )
}

export default ForgotPassword