import React from 'react'
import HighlightText from './HighlightText'
import img1 from "../../../assets/Images/Know_your_progress.png"
import img2 from "../../../assets/Images/Compare_with_others.png"
import img3 from "../../../assets/Images/Plan_your_lessons.png"
import Button from './Button'

const LearningLanguageSection = () => {
  return (
    <div className='flex flex-col items-center'>
        <div className='flex flex-col text-4xl font-semibold text-center  my-10 items-center'>

            <div className='text-4xl font-semibold text-center '>
                Your swiss knife for <HighlightText text={"learning any language"}/> 
            </div>

            <div className='text-center text-richblack-700 font-medium lg:w-[75%] mx-auto leading-6 text-base mt-3'>
            Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
            </div>

            <div className='flex flex-col lg:flex-row items-center justify-center mt-8 lg:mt-0'>
                <img src={img1} alt='knowYourProgress' className='object-contain  lg:-mr-32 '/>
                <img src={img2} alt='Compare_with_others' className='object-contain lg:-mb-10 lg:-mt-0 -mt-12'/>
                <img src={img3} alt='Plan_your_lessons' className='object-contain  lg:-ml-36 lg:-mt-5 -mt-16'/>
            </div>

        </div>

        <div className='w-w-fit mx-auto lg:mb-20 mb-8 -mt-5  '>
                <Button active={true} linkto={"/signup"} >
                    <div>
                    Learn More
                    </div>
                </Button>
        </div>
    </div>
  )
}

export default LearningLanguageSection