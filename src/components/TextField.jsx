import React from 'react'

const TextField = ({
    name,
    type,
    placeholder,
    label,
    error,
    styles,
    labelStyles,
    register,
    icon,
    iconStyle,
}) => {
  return (
    <div className='w-full flex flex-col mt-2'>
        {label && <p className={`text-sm text-ascent-2 mb-2 ${labelStyles}`}>{label}</p>}
        <div className='relative'>
            <input 
            id="text-field"
            type={type}
            name={name}
            placeholder={placeholder}
            className={`w-full px-3 py-2 text-ascent-1 text-sm 
            font-normal outline-none text-gray-700
            border border-[#969696] focus:border-blue
            ${styles} placeholder:text-[#666]`}
            {...register}
            aria-invalid={error ? "true" : "false"}
            />
            {icon && 
            <span className={`absolute right-0 ${iconStyle}`}>{icon}</span>}
        </div>
        {error && <span className='text-xs mt-2 text-[#f64949f3]'>{error}</span>}
    </div>
  )
}

export default TextField