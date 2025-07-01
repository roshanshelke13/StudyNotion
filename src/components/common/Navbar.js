import React, { useState,useEffect } from 'react'
import { Link, matchPath } from 'react-router-dom'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {ACCOUNT_TYPE} from '../../utils/constants'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import ProfileDropdown from '../core/Auth/ProfileDropdown'
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/apis'
import { BsChevronDown } from "react-icons/bs"
import { fetchCategories } from '../../services/operations/courseDetailsAPI'

const Navbar = () => {

    // const [currentLink,setCurrentLink] = useState('Home');
    const location = useLocation();
    const token = useSelector((state) => state.auth.token)
    const user = useSelector((state) => state.profile.user)
    const totalItems = useSelector((state) => state.cart.totalItems)
    const dispatch = useDispatch();

    const [subLinks, setSubLinks] = useState([])
    const [loading, setLoading] = useState(false)
    const [catalogName,setCatalogName] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        (async () => {
        setLoading(true)
        try {
            const result = await fetchCategories()
            // console.log("API URL:", categories.CATEGORIES_API);
            // console.log(result);  
            if (result.length > 0) {
                setSubLinks(result)
            }
            
        } catch (error) {
            console.log("Could not fetch Categories.", error)
        }
        setLoading(false)
        })()
    }, [])

    const matchRoute = (route) => {
        return matchPath({path:route},location.pathname);
    }

  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 bg-richblack-800 transition-all duration-200'>
       
        <div className='w-11/12 max-w-maxContent items-center justify-between flex'>

            <Link to={"/"}>
                <img src={logo} alt='logo' width={160} height={32} loading='lazy'/>
            </Link>

            <nav className="hidden md:block">
                <ul className='flex flex-row gap-x-6 text-richblack-25'>
                    {
                        NavbarLinks.map((element,index) => {
                            return(
                                <li key={index}>
                                    {
                                        element.title === "Catalog" ? 
                                        (<div className={`group relative flex cursor-pointer items-center gap-1 ${
                                            matchRoute(`/catalog/${catalogName}`)
                                              ? "text-yellow-25"
                                              : "text-richblack-25"
                                          }`}>
                                            <p>{element.title}</p>
                                            <BsChevronDown/>

                                            <div className='invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] 
                                            translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 
                                            opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] 
                                            group-hover:opacity-100 lg:w-[300px]'>

                                                <div className=' absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] 
                                                rotate-45 select-none rounded bg-richblack-5' ></div>

                                                {loading ? (
                                                    <p className="text-center">Loading...</p>
                                                    ) : subLinks.length ? (
                                                    <>
                                                        {subLinks.map((subLink, i) => (
                                                            <Link
                                                            to={`/catalog/${subLink.name
                                                                .split(" ")
                                                                .join("-")
                                                                .toLowerCase()}`}
                                                            className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                                            key={i}
                                                            onClick={() => setCatalogName(subLink.name.split(" ").join("-").toLowerCase())}
                                                            >
                                                            <p>{subLink.name}</p>
                                                            </Link>
                                                        ))}
                                                    </>
                                                    ) : (
                                                    <p className="text-center">No Courses Found</p>
                                                )}

                                            </div>
                                        </div>) : 
                                        (<Link to={element?.path} >
                                            <p className={`${matchRoute(element.path) ? "text-yellow-25":"text-richblack-25" }`}>
                                                {element.title}
                                            </p>
                                        </Link>)
                                    }
                                </li>
                            )
                        })
                    }
                </ul>
            </nav>

            {/* Login/Signup/Dashboard */}
            <div className='md:flex gap-x-4 items-center'>
                {
                    user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                        <Link to="/dashboard/cart" className='relative'>
                            <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                            {
                                totalItems > 0 && (
                                    <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                        {totalItems}
                                    </span>
                                )
                            }
                        </Link>
                    ) 
                }
                {
                    token === null && (
                        <Link to="/login">
                            <button className='rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100'>
                                Log in
                            </button>
                        </Link>
                    )
                }
                {
                    token === null && (
                        <Link to="/signup">
                            <button className='rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100'>
                                Sign up
                            </button>
                        </Link>
                    )
                }
                {
                    token !== null && <ProfileDropdown/>
                }
            </div>


        </div>
    </div>
  )
}

export default Navbar