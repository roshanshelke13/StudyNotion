import React from 'react'

const Blocks = ({heading,description,active}) => {
  return (
    <div className={`false  ${active ? "bg-richblack-700" : "bg-richblack-800"} h-[294px] w-[294px] false p-8 flex flex-col gap-8 `}>
        <h1 className='text-richblack-5 text-lg'>{heading}</h1>
        <p className='text-richblack-300 text-[1.1rem]'>
            {description}
        </p>
    </div>
  )
}

export default Blocks