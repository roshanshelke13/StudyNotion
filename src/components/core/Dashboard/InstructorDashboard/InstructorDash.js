import React, { useEffect, useState } from 'react'
import { getInstructorStat } from '../../../../services/operations/profileAPI'
import { useSelector } from 'react-redux'
import { getInstructorCourses } from '../../../../services/operations/courseDetailsAPI'
import { Link } from 'react-router-dom'
import InstructorChart from './InstructorChart'

const InstructorDash = () => {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)

  const [loading, setLoading] = useState(false)
  const [courseData, setCourseData] = useState([])
  const [instructorData, setInstructorData] = useState([])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const courses = await getInstructorCourses(token)
        const stats = await getInstructorStat(token)

        if (courses) setCourseData(courses)
        else setCourseData([])

        if (stats) setInstructorData(stats)

      } catch (err) {
        console.error("Failed to load instructor dashboard data", err)
        setCourseData([])
        setInstructorData([])
      }
      setLoading(false)
    })()
  }, [token])


  const totalAmount = Array.isArray(instructorData)
    ? instructorData.reduce((acc, curr) => acc + curr.totalAmount, 0)
    : 0

  const totalStudents = instructorData.reduce((acc, curr) => acc + curr.totalStudents, 0)

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5">
          Hi {user?.firstName} 👋
        </h1>
        <p className="font-medium text-richblack-200">
          Let's start something new
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <div className="loader">Loading...</div>
        </div>
      ) : Array.isArray(courseData) && courseData.length > 0 ? (
        <div>
          <div className="my-4 flex flex-col lg:flex-row h-auto lg:h-[450px] space-y-4 lg:space-y-0 lg:space-x-4 ">
            {/* Chart */}
            {totalAmount > 0 || totalStudents > 0 ? (
              <InstructorChart courses={instructorData} />
            ) : (
              <div className="flex-1 rounded-md bg-richblack-800 p-6">
                <p className="text-lg font-bold text-richblack-5">Visualize</p>
                <p className="mt-4 text-xl font-medium text-richblack-50">
                  Not Enough Data To Visualize
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="flex min-w-[250px] flex-col rounded-md bg-richblack-800 p-6">
              <p className="text-lg font-bold text-richblack-5">Statistics</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-lg text-richblack-200">Total Courses</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {courseData.length}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Students</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {totalStudents}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Income</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    Rs. {totalAmount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Course Preview */}
          <div className="rounded-md bg-richblack-800 p-6 mt-20">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-richblack-5">Your Courses</p>
              <Link to="/dashboard/my-courses">
                <p className="text-xs font-semibold text-yellow-50">View All</p>
              </Link>
            </div>

            <div className="my-4 flex flex-wrap gap-4">
              {Array.isArray(courseData) && courseData.slice(0, 3).map((course) => (
                <div key={course._id} className="w-full md:w-[30%]">
                  <img
                    src={course.thumbnail || "/default-thumbnail.jpg"}
                    alt={course.courseName}
                    className="h-[201px] w-full rounded-md object-cover"
                  />
                  <div className="mt-3 w-full">
                    <p className="text-sm font-medium text-richblack-50">
                      {course.courseName}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <p className="text-xs font-medium text-richblack-300">
                        {course.studentsEnrolled?.length || 0} students
                      </p>
                      <p className="text-xs font-medium text-richblack-300">|</p>
                      <p className="text-xs font-medium text-richblack-300">
                        Rs. {course.price?.toLocaleString("en-IN") || 0}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
          <p className="text-center text-2xl font-bold text-richblack-5">
            You have not created any courses yet
          </p>
          <Link to="/dashboard/add-course">
            <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
              Create a course
            </p>
          </Link>
        </div>
      )}
    </div>
  )
}

export default InstructorDash
