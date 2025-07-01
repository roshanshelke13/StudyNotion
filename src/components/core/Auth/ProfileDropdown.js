import React, { useRef, useState } from 'react'
import { VscDashboard, VscSignOut } from 'react-icons/vsc'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import useOnClickOutside from '../../../hooks/useOnClickOutside'
import { logout } from '../../../services/operations/authAPI'

const ProfileDropdown = () => {
  const { user} = useSelector((state) => state.profile)
  const [open,setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useOnClickOutside(ref,() => setOpen(false))
  if (!user) return null

  return (
    
    <button className="relative" onClick={() => setOpen(true)}>
        <div className='className="flex items-center gap-x-1"'>
            <img src={user?.image} alt={`profile-${user?.firstName}`} 
            className="aspect-square w-[30px] rounded-full object-cover"></img>
            {
              open && (
                <div className="absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700
                 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-5"
                 onClick={(e) => e.stopPropagation()}
                 ref={ref}>
                    <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
                      <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm
                       text-richblack-700 hover:bg-richblack-400 hover:text-richblack-25">
                        <VscDashboard className="text-lg"  />
                        Dashboard
                      </div>
                    </Link>

                    <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm
                       text-richblack-700 hover:bg-richblack-400 hover:text-richblack-25"
                       onClick={() => {
                        dispatch(logout(navigate))
                        setOpen(false)
                        }}>
                      <VscSignOut className="text-lg"/>
                      Logout
                    </div>
                </div>
              )
            }
        </div>
    </button>
  )
}

export default ProfileDropdown