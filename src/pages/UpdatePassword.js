import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { BiArrowBack } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/operations/authAPI';

const UpdatePassword = () => {
    
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");

    const [showPassword,setShowPassword] = useState(false)
    const [shownConfirmPassword,setShowConfirmPassword] = useState(false);

    const {loading} = useSelector((state) => state.auth.loading)

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate()

    function handleSumbit (e){
        e.preventDefault();
        
        if(password !== confirmPassword){
            toast.error("Both Password not matches")
        }
        const token = location.pathname.split('/').at(-1)
        console.log(password,confirmPassword,token);

        dispatch(resetPassword(token,password,confirmPassword,navigate))
    }

  return (   
       <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
        {
            loading ? (
                <div>
                    <div className='spinner'/>
                </div>
            ) : (

                <div className='flex flex-col max-w-[500px] p-4 lg:p-8'>

                    <h1 className='text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]'>
                        Choose new password
                    </h1>

                    <p className='text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100'>
                        Almost done. Enter your new password and you're all set
                    </p>

                    <form onSubmit={handleSumbit} className='w-full'>
                        <label className='relative'>
                            <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5'>
                                New password
                                <sup className='text-pink-200'>*</sup>
                            </p>
                            <input placeholder='Enter New Password' type = {`${showPassword ? "text" : "password"}`} 
                            className='w-full form-style' onChange={(e) => setPassword(e.target.value)}/>
                            <span className='absolute right-3 top-[38px] z-[10] cursor-pointer'
                            onClick={() => setShowPassword(!showPassword)}>
                                {
                                    !showPassword 
                                    ? <AiOutlineEye fontSize={24} fill="#AFB2BF"/>
                                    : <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>
                                }
                            </span>
                            
                        </label>

                        <label className="relative mt-3 block">
                            <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5'>
                                Confirm new password
                                <sup className='text-pink-200'>*</sup>
                            </p>
                            <input placeholder='Enter Confirm Password' type = {`${shownConfirmPassword ? "text" : "password"}`} 
                            className='w-full form-style' onChange={(e) => setConfirmPassword(e.target.value)}/>
                            <span className='absolute right-3 top-[38px] z-[10] cursor-pointer' 
                            onClick={() => setShowConfirmPassword(!shownConfirmPassword)}>
                                {
                                    !shownConfirmPassword 
                                    ? <AiOutlineEye fontSize={24} fill="#AFB2BF"/>
                                    : <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>
                                }
                            </span>

                        </label>

                        <button type='sumbit'
                        className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] 
                        font-semibold text-richblack-900">
                            Reset Password
                        </button>
                    </form>

                    <Link to="/login">
                        <div className='text-richblack-5 flex mt-6 items-center gap-2'>
                            <BiArrowBack/>
                            Back to login
                        </div>
                    </Link>

                </div>

            )
        }
       </div> 
  )
}

export default UpdatePassword