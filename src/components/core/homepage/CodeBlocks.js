import React from 'react'
import Button from './Button';
import { FaArrowRight } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';

const CodeBlocks = ({
    position,heading,subheading,btn1,btn2,codeblock,backgroundGradient,codeColor
}) => {
  return (
    <div className={`flex  flex-col ${position} my-20 justify-between gap-10 lg:gap-10`}>

        <div className='flex flex-col w-[100%] lg:w-[50%] gap-8'>
            {heading}
            <div className='text-richblack-300 font-bold -mt-3 text-base w-[85%]'>
                {subheading}
            </div>

            <div className='flex gap-7 mt-7'>
                 <Button active={true} linkto={"/signup"} >
                    <div className='flex gap-2 items-center'>
                        {btn1}
                        <FaArrowRight/>
                    </div>
                 </Button>
                <Button active={false} linkto={"/signup"}>{btn2}</Button>
            </div>
        </div>

        <div className={`h-fit flex code-border flex-row py-3 text-[10px] sm:text-sm leading-[18px] sm:leading-6 relative w-[100%] lg:w-[470px] `}>
            {backgroundGradient}
            <div className='text-center flex flex-col select-none w-[10%] text-richblack-400 font-inter font-bold'>
                <p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p><p>7</p><p>8</p><p>9</p><p>10</p><p>11</p>
            </div>


            <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-1`}>
                <TypeAnimation
                sequence={[codeblock,5000,""]}
                repeat={Infinity}
                cursor={true}
                style={
                    {
                        whiteSpace:"pre-line",
                        display:"block",
                    }
                }
                omitDeletionAnimation={true}
                >

                </TypeAnimation>
            </div>

        </div>

    </div>
  )
}

export default CodeBlocks; 