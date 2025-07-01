import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCourseDetail } from '../../../../services/operations/courseDetailsAPI';
import {setCourse, setEditCourse} from "../../../../slices/courseSlice"
import { useParams } from 'react-router-dom';
import { RenderSteps } from '../AddCourse/RenderSteps';

const EditCourse = () => {
    const {course,editCourse} = useSelector((state) => state.course);
    const token = useSelector((state) => state.auth.token)
    const dispatch = useDispatch();
    const { courseId } = useParams();
    const [loading, setLoading] = useState(false)


    useEffect( () => {
        ;(async () => {
            setLoading(true)
            const result = await getCourseDetail({courseId:courseId})
            if (result) {
              dispatch(setEditCourse(true))
              dispatch(setCourse(result))
            }
            setLoading(false)
          })()
    },[])

    

    if (loading) {
        return (
          <div className="grid flex-1 place-items-center">
            <div className="spinner"></div>
          </div>
        )
    }

  return (
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Edit Course
      </h1>
      <div className="mx-auto max-w-[600px]">
        {course ? (
          <RenderSteps />
        ) : (
          <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
            Course not found
          </p>
        )}
      </div>
    </div>
  )
}

export default EditCourse