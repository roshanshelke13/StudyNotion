import React from 'react'
import InstructorImage from "../../../assets/Images/Instructor.png"
import HighlightText from './HighlightText'
import Button from './Button'
import { FaArrowRight } from 'react-icons/fa';

const InstructorSection = () => {
  return (
        <div className='flex flex-col lg:flex-row gap-20 items-center w-11/12'>

            <div className='lg:w-[50%]'>
                <img src={InstructorImage} alt='InstructorImage' typeof='/png' className='shadow-[-20px_-20px_0_0_rgba(255,255,255)]' />
            </div>

            <div className='lg:w-[50%] flex gap-10 flex-col'>
                <h1 className='lg:w-[50%] text-4xl font-semibold '>
                    Become an
                    <span><HighlightText text={"Instructor"}/></span>
                </h1>

                <p className='font-medium text-[16px] text-justify w-[90%] text-richblack-300'>
                    Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
                </p>

                <div className='w-fit'>
                        <Button active={true} linkto={"/signup"}>
                            <div className='flex items-center gap-3 font-bold'>
                                Start Teaching Today
                                <FaArrowRight/>
                            </div>
                        </Button>
                </div>
            </div>


        </div>

  )
}

export default InstructorSection