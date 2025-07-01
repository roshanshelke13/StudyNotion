import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { RiEditBoxLine } from "react-icons/ri"
import { Link, useNavigate } from "react-router-dom";
import {formattedDate} from "../../../utils/dateFormatter"
import { useEffect, useState } from "react"
import {getUserDetails} from "../../../services/operations/profileAPI"


const MyProfile = () => {
  const user = useSelector((state) => state.profile.user)
  // console.log(user);
  const token = useSelector((state) => state.auth.token)
  const dispatch = useDispatch()
  const navigate = useNavigate();

  
  const details = useSelector((state) => state.profile.details)

  

  return (
    <div className=' text-richblack-5'>
        <h1 className="mb-14 text-3xl font-medium text-richblack-5">My Profile</h1>

        <div className="flex items-center justify-between rounded-md border-[1px] flex-col gap-2
         border-richblack-700 bg-richblack-800 p-8 px-12 md:flex-row">
            <div className='flex items-center gap-x-4 '>
              <div>
                <img src={user.image} className="aspect-square w-[78px] rounded-full object-cover md:w-[50px]"/>
              </div>

              <div className="space-y-1">
                <h1 className='text-lg font-semibold text-richblack-5'>{user.firstName + " " + user.lastName}</h1>
                <p className="text-sm text-richblack-300">{user.email}</p>
              </div>
            </div>

            <button className="cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold
             text-richblack-900 bg-yellow-50" onClick={() => navigate("/dashboard/settings")} >
              <Link 
              className='flex items-center gap-3'>
                <RiEditBoxLine/>
                Edit
              </Link>
            </button>

            
        </div>

        <div className="border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 rounded-md my-10 gap-2">

          <div className='flex gap-2 justify-between flex-col items-center md:flex-row'>
              <p className='text-xl font-semibold'>
                About Yourself
              </p>

              <button className="cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold
              text-richblack-900 bg-yellow-50" onClick={() => navigate("/dashboard/settings")} >
                <Link 
                className='flex items-center gap-3'>
                  <RiEditBoxLine/>
                  Edit
                </Link>
              </button>
          </div>

          <div className='text-richblack-300 mt-5'>
            {
              details?.about ?? "Write about Yourself" 
            }
          </div>

        </div>

        <div className="border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 rounded-md my-10 gap-2">

          <div className="flex items-center justify-between flex-col gap-2
          md:flex-row">
            <p className='text-xl font-semibold'>Personal Deatils</p>
            <button className="cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold 
            text-richblack-900 bg-yellow-50" onClick={() => navigate("/dashboard/settings")}>
              <Link to={"/dashboard/settings"}
              className='flex items-center gap-3'>
                <RiEditBoxLine/>
                Edit
              </Link>
            </button>
          </div>

          <div className="flex max-w-[500px] justify-between mt-2 gap-5 flex-col md:flex-row ">
            <div className="flex flex-col gap-y-5">
              <div>
                <p className="mb-2 text-sm text-richblack-600">First Name</p>
                <p className="text-sm font-medium text-richblack-5">
                  {user?.firstName}
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm text-richblack-600">Email</p>
                <p className="text-sm font-medium text-richblack-5">
                  {user?.email}
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm text-richblack-600">Gender</p>
                <p className="text-sm font-medium text-richblack-5">
                  {details?.gender ?? "Add Gender"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-y-5 ">
              <div className='flex flex-col '>
                <p className="mb-2 text-sm text-richblack-600 ">Last Name</p>
                <p className="text-sm font-medium text-richblack-5">
                  {user?.lastName}
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm text-richblack-600">Phone Number</p>
                <p className="text-sm font-medium text-richblack-5">
                  {details?.contactNumber ?? "Add Contact Number"}
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm text-richblack-600">Date Of Birth</p>
                <p className="text-sm font-medium text-richblack-5">
                  {formattedDate(details?.dateOfBirth) ??
                    "Add Date Of Birth"}
                </p>
              </div>
            </div>
          </div>

        </div>

    </div>
  )
}

export default MyProfile