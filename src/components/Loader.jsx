import React from 'react'

const Loader = () => {
  return (
    <div className="mt-4 flex items-center justify-center gap-2">
        <div className=" text-blue animate-spin 
        rounded-full h-8 w-8 border-t-2 border-blue-500 
        border-opacity-50"></div>
        <div className=" text-blue animate-spin 
        rounded-full h-8 w-8 border-t-2 border-blue-500 
        border-opacity-50"></div>
        <div className=" text-blue animate-spin 
        rounded-full h-8 w-8 border-t-2 border-blue-500 
        border-opacity-50"></div>
    </div>
  )
}

export default Loader