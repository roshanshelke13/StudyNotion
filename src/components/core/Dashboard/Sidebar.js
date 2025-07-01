import React, { useState,useEffect, useRef } from 'react'
import { sidebarLinks } from '../../../data/dashboard-links'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import SidebarLink from './SidebarLink'
import { VscSignOut, VscSettingsGear, VscThreeBars } from 'react-icons/vsc'
import { logout } from '../../../services/operations/authAPI'
import ConfirmationModal from '../../common/ConfirmationModal'

const Sidebar = () => {
  const { user, loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const [modal, setModal] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const sidebarRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev)
  }

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  

  return (
    <>
      {/* Hamburger Icon */}
      <div className="md:hidden p-4">
        <VscThreeBars className="text-2xl text-richblack-300" onClick={toggleSidebar} />
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed md:relative top-0 left-0 h-full md:min-h-screen bg-richblack-800 border-r border-richblack-700
         py-10 transition-transform duration-300 md:min-w-[220px] flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0`}
      >
        <div className="flex flex-col">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null
            return <SidebarLink key={link.id} link={link} iconName={link.icon} />
          })}
        </div>

        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />

        <div className="flex flex-col">
          <SidebarLink
            link={{ name: 'Settings', path: '/dashboard/settings' }}
            iconName="VscSettingsGear"
          />
          <button
            onClick={() =>
              setModal({
                text1: 'Are you sure?',
                text2: 'You will be logged out of your account.',
                btn1Text: 'Logout',
                btn2Text: 'Cancel',
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setModal(null),
              })
            }
            className="px-8 py-2 text-sm font-medium text-richblack-300"
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>

      {modal && <ConfirmationModal modalData={modal} />}
    </>
  )
}

export default Sidebar