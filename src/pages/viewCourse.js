import React, { useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { getFullCourseDetail } from '../services/operations/courseDetailsAPI';
import { useDispatch, useSelector } from 'react-redux';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import ViewCourseSidebar from '../components/core/ViewCourse/ViewCourseSidebar';
import ReviewModal from '../components/core/ViewCourse/ReviewModal';

const ViewCourse = () => {
    const courseId = useParams();
    const token = useSelector((state) => state.auth.token)
    const dispatch = useDispatch();

    const[reviewModal,setReviewModal] = useState(false);

    useEffect(() => {
        const FullCourseDetail = async () => {
            const response = await getFullCourseDetail(courseId,token)
            dispatch(setCourseSectionData(response.courseDetails.courseContent));
            dispatch(setCompletedLectures(response.completedVideos));
            dispatch(setEntireCourseData(response.courseDetails));
            let lecture = 0;
            response?.courseDetails?.courseContent.forEach((sec) => {
                lecture = lecture + sec.subSection.length
            })

            dispatch(setTotalNoOfLectures(lecture));
        }

        FullCourseDetail();
    },[])

  return (
    <>
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
        {/* Sidebar on the left */}
        <ViewCourseSidebar setReviewModal={setReviewModal} />

        {/* Main content area on the right */}
        <div className="h-full flex-1 overflow-auto">
            <div className="mx-6">
            <Outlet />
            </div>
        </div>
        </div>

        {reviewModal && <ReviewModal setReviewModal={setReviewModal} />}

    </>
  )
}

export default ViewCourse