import React, { useState } from 'react'
import { useSelector } from 'react-redux';

//COMPONENTS
import Login from '../components/Login'
import Signup from '../components/Signup'

// import Swiper core and required modules
import { Pagination, Autoplay, A11y } from 'swiper/modules';
import { SiQuantconnect } from "react-icons/si";

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


const Acccount = () => {
  const {theme} = useSelector((state)=>state.theme)
  const [tab, setTab] = useState("login")
  return (
    <div data-theme={theme} className='h-screen flex items-center 
    justify-center p-6 py-8 bg-bgColor'>
        <div className='h-full w-[800px] flex items-center justify-center 
        shadow-lg rounded-lg bg-primary overflow-hidden'>

            {/* RIGTH */}
            <div className='w-full md:w-1/2 h-full flex flex-col
            justify-center'>
              <div className='flex gap-4 items-center justify-start px-6 py-2 mb-6'>
              <span className='bg-[#eff4fc] flex-items-center justify-center
                p-2 rounded-lg'>
                    <SiQuantconnect className='text-[#1877f2] text-2xl'/>
                </span>
                <h1 className='font-bold leading-5 
                text-2xl text-[#065ad8]'>ConnectMe</h1>
              </div>

              <div className='w-full flex
              flex-col'>
                {tab === "login" && <Login/>}
                {tab === "signup" && <Signup/>}
              </div>

              <div className='px-4 mb-2'>
                {tab === "login" ? (
                  <p className='flex gap-2 items-center text-ascent-2'>
                    Don't have an account?
                    <button
                    type='button'
                    onClick={()=>setTab("signup")}
                    className='border-none bg-none text-[#065ad8]'
                    >Create Account</button>
                  </p>
                ):(
                  <p className='flex gap-2 items-center text-ascent-2'>
                    Already have an account?
                    <button
                    type='button'
                    onClick={()=>setTab("login")}
                    className='border-none bg-none text-blue'
                    >Login</button>
                  </p>
                )}
              </div>
            </div>

            {/* LEFT */}
            <div className='hidden md:flex w-1/2 h-full'>
              <Swiper
              // install Swiper modules
              modules={[Pagination, A11y, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ disableOnInteraction: true, delay: 3000}}
              className='w-full h-full'
              >
                <SwiperSlide className='relative'>
                  <img className='w-full h-full object-cover' 
                  src="https://images.pexels.com/photos/3314294/pexels-photo-3314294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="" />
                  <div className="w-full absolute bottom-10 left-1/2 transform 
                  -translate-x-1/2 -translate-y-1/2 text-white text-center
                  text-sm px-2 font-semibold">
                    Explore the world and make lasting connections with friends. 
                    Share unforgettable moments and create a digital legacy 
                    filled with joy and laughter.
                  </div>
                </SwiperSlide>
                <SwiperSlide className='relative'>
                  <img className='w-full h-full object-cover' 
                  src="https://images.pexels.com/photos/4555321/pexels-photo-4555321.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="" />
                  <div className="w-full absolute bottom-10 left-1/2 transform 
                  -translate-x-1/2 -translate-y-1/2 text-white text-center
                  text-sm px-2 font-semibold">
                  Your journey begins here. Capture the essence of every moment, 
                  express yourself freely, and let your unique stories unfold 
                  in the world of shared memories.
                  </div>
                </SwiperSlide>
                <SwiperSlide className='relative'>
                  <img className='w-full h-full object-cover'
                  src="https://images.pexels.com/photos/3367850/pexels-photo-3367850.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="" />
                  <div className="w-full absolute top-10 left-1/2 transform 
                  -translate-x-1/2 -translate-y-1/2 text-white text-center
                  text-sm px-2 font-semibold">
                  Immerse yourself in the beauty of shared experiences. 
                  Connect with friends and family, relive special moments, 
                  and discover the magic of storytelling through pictures.
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
        </div>
    </div>
  )
}

export default Acccount