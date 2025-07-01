import copy from 'copy-to-clipboard'
import React from 'react'
import toast from 'react-hot-toast'
import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


const CourseCard = ({course,setConfirmationModal,handleBuyCourse,addToCartItem}) => {

    const token = useSelector((state) => state.auth.token);
    const user  = useSelector((state) => state.profile.user);
    const navigate = useNavigate();

     
    const handleShare = () => {
        copy(window.location.href)
        toast.success("Link copied to clipboard")
    }

    const isEnrolled = (course?.studentsEnrolled ?? []).some(
        (element) => element === user?._id
    )

    const checkCourse = () => {
        if(isEnrolled){
            return navigate(`/dashboard/enrolled-courses`);
        }
        handleBuyCourse();
    }


    
  return (
    <div className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}>
        <img 
          src={course?.thumbnail}
          alt={course?.courseName}
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        
        />
        <div className="px-4">
            <p className="space-x-3 pb-4 text-3xl font-semibold">
                Rs. {course?.price}
            </p>

            <div className="flex flex-col gap-4">
                <button className="yellowButton" onClick={checkCourse}>
                    {user && isEnrolled
                                ? "Go To Course"
                                : "Buy Now "}
                </button>

                <button className="blackButton" onClick={addToCartItem}>
                    {user && isEnrolled
                                ? "Already Enrolled"
                                : "Add to Cart"}
                </button>
            </div>

            <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
              30-Day Money-Back Guarantee
            </p>

            <div className={``}>
                <p className={`my-2 text-xl font-semibold `}>
                This Course Includes :
                </p>
                <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
                {course?.instructions?.map((item, i) => {
                    return (
                    <p className={`flex gap-2`} key={i}>
                        <BsFillCaretRightFill />
                        <span>{item}</span>
                    </p>
                    )
                })}
                </div>

                <div className="text-center">
                    <button
                    className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
                    onClick={handleShare}
                    >
                    <FaShareSquare size={15} /> Share
                    </button>
                </div>
            </div>
        </div>

    </div>
  )
}

export default CourseCard