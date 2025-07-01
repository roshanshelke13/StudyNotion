import React from 'react'

const Stats = [
    { count: "5K", label: "Active Students" },
    { count: "10+", label: "Mentors" },
    { count: "200+", label: "Courses" },
    { count: "50+", label: "Awards" },
];

const StatsComponenet = () => {
  return (
    <div className='bg-richblack-700 w-full text-white'>
        <div className='flex flex-col gap-10 justify-between w-11/12 max-w-maxContent text-white mx-auto '>
            <div className='grid grid-cols-2 md:grid-cols-4 text-center'>
                {
                    Stats.map((element,index) => {
                        return(
                            <div className='flex flex-col py-10'>
                                <p className='text-[30px] font-bold text-richblack-5'>{element.count}</p>
                                <p className='font-semibold text-[16px] text-richblack-500'>{element.label}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>

    </div>
  )
}

export default StatsComponenet