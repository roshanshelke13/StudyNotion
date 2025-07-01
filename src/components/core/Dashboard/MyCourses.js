import React, { useEffect, useState } from 'react'
import IconBtn from '../../common/IconBtn'
import { VscAdd } from 'react-icons/vsc'
import { useSelector } from 'react-redux'
import { getInstructorCourses } from '../../../services/operations/courseDetailsAPI'
import { useNavigate } from 'react-router-dom'
import CourseDisplay from './InstructorCourses/CourseDisplay'

const MyCourses = () => {

    const token = useSelector((state) => state.auth.token);
    const [course,setCourse] = useState([]);
    const navigate = useNavigate();


    useEffect(()=>{
        const getCourses = async () => {
            const result = await getInstructorCourses(token);
            if(result){
                setCourse(result);
            }
        }
        getCourses();
    },[]);



  return (
    <div >
        <div className="mb-14 flex items-center justify-between">
            <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
            <IconBtn text={"Add Course"} onclick={() => navigate("/dashboard/add-course")}>
                <VscAdd/>
            </IconBtn>
        </div>
        {
            course && 
                <CourseDisplay courses = {course} setCourses = {setCourse}/>
            
        }    
    </div>
  )
}

export default MyCourses