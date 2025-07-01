import React, { useEffect, useState } from 'react'
import IconBtn from '../../../../common/IconBtn';
import { useDispatch, useSelector } from 'react-redux';
import { resetCourseState, setStep } from '../../../../../slices/courseSlice';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI';
import { COURSE_STATUS } from '../../../../../utils/constants';

const PublishCourse = () => {

    const [checked,setChecked] = useState(false);
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);
    const course = useSelector((state) => state.course.course)

    useEffect(() => {
        if (course?.status === COURSE_STATUS.PUBLISHED) {
          setChecked(true);
        }
      }, [])

    const onSubmit = async () => {
        if(checked && course?.status !== COURSE_STATUS.PUBLISHED){
            const data = {
                courseId: course._id,
                status : "Published"
            }
            setLoading(true);
            const result = await editCourseDetails(data,token)
            if (result) {
                dispatch(resetCourseState())
                navigate("/dashboard/my-courses")
            }
            setLoading(false)
        }
        else{
            dispatch(resetCourseState())
            navigate("/dashboard/my-courses")
        }
    }

  return (
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
        <h1 className="text-2xl font-semibold text-richblack-5">Publish Settings</h1>

        <form>
            <div className="my-6 mb-8">
                <label className="inline-flex items-center text-lg">
                    <input type='checkbox' 
                        onChange={() => setChecked(!checked)}
                        className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"/>
                    <span className="ml-2 text-richblack-400">
                        Make this course as public
                    </span>
                </label>
            </div>
        </form>

        <div className="ml-auto flex max-w-max items-center gap-x-4">
            <button
            disabled={loading}
            onClick={() => dispatch(setStep(2))}
            type="button"
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
            >
                Back
            </button>

            <IconBtn 
              text={"Save Changes"}
              onclick={onSubmit}
              />
        </div>
    </div>
  )
}

export default PublishCourse