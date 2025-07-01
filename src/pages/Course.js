import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCourseDetail } from '../services/operations/courseDetailsAPI';
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { formatDate } from '../services/formatDate';
import RatingStars from '../components/common/RatingStars';
import GetAvgRating from '../utils/avgRating';
import CourseCard from '../components/core/Course/CourseCard';
import ConfirmationModal from "../components/common/ConfirmationModal"
import { useDispatch, useSelector } from 'react-redux';
import Footer from "../components/common/Footer"
import { BuyCourse } from '../services/operations/paymentsAPI';
import ReactMarkdown from 'react-markdown';
import Section from '../components/core/Course/Section';
import { addToCart } from '../slices/cartSlice';


const Course = () => {
    const {courseId} = useParams();
    const [courseDetail,setCourseDetail] = useState("");
    
    const [avgReviewCount, setAvgReviewCount] = useState(0)

    const [confirmationModal, setConfirmationModal] = useState(null)
    const token = useSelector((state) => state.auth.token);
    const user  = useSelector((state) => state.profile.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [lectures,setLectures] = useState(0);
    const [timeDuration,setTimeDuration] = useState(0);
    
    
    useEffect(() => {
            if(courseDetail){
                const count = GetAvgRating(courseDetail.ratingAndReviews)
                setAvgReviewCount(count)
            }
    }, [courseDetail])

    useEffect(() => {
        const fetchCourse = async() => {
            if(courseId){
                const response = await getCourseDetail({courseId:courseId})
                
                setCourseDetail(response)
            }
        }

        fetchCourse();
    },[courseId])

    useEffect(() => {
        let count = 0;
        courseDetail?.courseContent?.forEach((sec) => {
            count = count + sec.subSection?.length || 0
        })
        setLectures(count);
    },[courseDetail])

    useEffect(() => {
        let time = 0;
        courseDetail?.courseContent?.forEach((sec) => {
            
            sec?.subSection?.forEach((subSec) => {
                time += parseInt(subSec.timeDuration, 10);
            })
        })

        setTimeDuration(time);
    },[courseDetail])


    const handleBuyCourse = () => {
        if(token){
            BuyCourse(token,[courseId],user,navigate,dispatch);
            return
        }
        setConfirmationModal({
            text1: "You are not logged in!",
            text2: "Please login to Purchase Course.",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null)
        })
    }
    // console.log(courseDetail)
    // console.log("KEY2:-",process.env.REACT_APP_BASE_URL)

    const addToCartItem = () => {
        if(token){
            dispatch(addToCart(courseDetail));
            return
        }
        setConfirmationModal({
            text1: "You are not logged in!",
            text2: "Please login to Purchase Course.",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null)
        })
    }

    const isEnrolled = (courseDetail?.studentsEnrolled ?? []).some(
        (element) => element === user?._id
    )

    const checkCourse = () => {
        if(isEnrolled){
            return navigate(`/dashboard/enrolled-courses`);
        }
        handleBuyCourse();
    }

    const [isActive, setIsActive] = useState(Array(0))
    const handleActive = (id) => {
        // console.log("called", id)
        setIsActive(
        !isActive.includes(id)
            ? isActive.concat([id])
            : isActive.filter((e) => e !== id)
        )
    }

  return (
    <>
        <div className={`relative w-full bg-richblack-800`}>
            <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative ">

                <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
                    
                    <div className="relative block max-h-[30rem] lg:hidden">
                        <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
                        <img
                            src={courseDetail?.thumbnail}
                            alt="course thumbnail"
                            className="aspect-auto w-full"
                        />
                    </div>
                    
                    <div className={`z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}>
                        <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">{courseDetail?.courseName}</p>
                        <p className={`text-richblack-200`}>{courseDetail?.courseDescription}</p>
                        
                        <div className="text-md flex flex-wrap items-center gap-2">
                            <span className="text-yellow-25">{avgReviewCount}</span>
                            <RatingStars Review_Count={avgReviewCount} Star_Size={24}/> 
                            <span>{courseDetail?.ratingAndReviews?.length} reviews</span> 
                            <span>{courseDetail?.studentsEnrolled?.length} students enrolled</span>
                        </div>

                        <p>Created By {courseDetail?.courseDetail?.instructor?.firstName} {courseDetail?.courseDetail?.instructor?.lastName}</p>
                        <div className="flex flex-wrap gap-5 text-lg">
                            <p className="flex items-center gap-2"><BiInfoCircle/>Created at {formatDate(courseDetail?.createdAt)}</p>
                            <p className="flex items-center gap-2"><HiOutlineGlobeAlt/> English</p>
                        </div>
                    </div>

                    <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
                        <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
                            Rs. {courseDetail?.price}
                        </p>
                        <button className="yellowButton"
                         onClick={checkCourse}
                         >
                            {user && isEnrolled
                                ? "Go To Course"
                                : "Buy Now "}


                        </button>
                        <button className="blackButton" onClick={addToCartItem}>
                            {user && isEnrolled
                                ? "Already Enrolled"
                                : "Add to Cart"}</button>
                    </div>

                </div>

                <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block">
                    <CourseCard 
                      course = {courseDetail}
                      setConfirmationModal={setConfirmationModal}
                      handleBuyCourse={handleBuyCourse}
                      addToCartItem = {addToCartItem}/>
                </div>

            </div>
        </div>

        <div className='mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]'>
            <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">

                <div className="my-8 border border-richblack-600 p-8">
                    <p className="text-3xl font-semibold">What you'll learn</p>
                    <div div className="mt-5">
                        <ReactMarkdown>
                            {courseDetail?.whatYouWillLearn}
                        </ReactMarkdown>
                    </div>
                </div>

                <div className="max-w-[830px] ">

                    <div className="flex flex-col gap-3">
                        <p className="text-[28px] font-semibold">
                            Course Content
                        </p>

                        <div className="flex flex-wrap justify-between gap-2">

                            <div className="flex gap-2">
                                <span>{courseDetail?.courseContent?.length}{` section(s)`}</span>
                                <span>{lectures}{` lecture(s)`}</span>
                                <span>{timeDuration}{`s total length`}</span>
                            </div>

                            <div>
                                <button className='text-yellow-25'
                                        onClick={() => setIsActive([])}
                                >
                                    Collapse all sections
                                </button>
                            </div>
                        </div>

                        <div>
                            {
                                courseDetail?.courseContent?.map((ele,index) => {
                                    return(
                                        <Section
                                            course={ele}
                                            key={index}
                                            isActive={isActive}
                                            handleActive={handleActive}
                                        />
                                    )
                                })
                            }
                        </div>

                        <div className="mb-12 py-4">
                            <p className="text-[28px] font-semibold">Author</p>
                            <div className="flex items-center gap-4 py-4">
                                <img
                                src={
                                    courseDetail?.instructor?.image
                                    ? courseDetail?.instructor?.image
                                    : `https://api.dicebear.com/5.x/initials/svg?seed=${courseDetail?.instructor?.firstName} ${courseDetail?.instructor?.lastName}`
                                }
                                alt="Author"
                                className="h-14 w-14 rounded-full object-cover"
                                />
                                <p className="text-lg">{`${courseDetail?.instructor?.firstName} ${courseDetail?.instructor?.lastName}`}</p>
                            </div>
                            <p className="text-richblack-50">
                                {courseDetail?.instructor?.additionalDetails?.about}
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </div>

        <Footer/>
        {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default Course