import React from 'react'

const CustomButton = ({label,type,styles,onClick}) => {
  return (
    <button
    type={type || "button"}
    onClick={onClick}
    className={`text-base ${styles}`}
    >
        {label}
    </button>
  )
}

export default CustomButton