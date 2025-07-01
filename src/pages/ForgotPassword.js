import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import {resetPasswordToken} from '../services/operations/authAPI'

const ForgotPassword = () => {
    const {loading} = useSelector((state) => state.auth.loading)

    const [emailSent , setEmailSent] = useState(false);  
    const [email,setEmail] = useState("")
    const dispatch = useDispatch();

    function handleSumbit (e) {
        console.log(email)
        e.preventDefault()
        dispatch(resetPasswordToken(email,setEmailSent))
    }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
        {
            loading ? (
                <div>
                    <div className='spinner'/>
                </div>
            ) :
            (
                <div className='flex flex-col max-w-[500px] p-4 lg:p-8'>
                    <h1 className='text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]'>
                        {
                            !emailSent ? "Reset your password" : "Check Email"
                        }
                    </h1>

                    <p className='text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100'>
                        {
                           ! emailSent 
                           ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
                             : `we have sent the reset email to ${email}`
                        }
                    </p>

                    {
                        emailSent === false && (
                            <form className='w-full' onSubmit={handleSumbit}>
                                <label>
                                    <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5'>
                                        Email Address
                                        <sup className="text-pink-200">*</sup>
                                        </p>
                                    <input placeholder='Enter your email address' type='email' name='email'
                                     className='w-full form-style' value={email}
                                    onChange={(e) => setEmail(e.target.value) }/>
                                </label>
                                <button className='mt-6 w-full rounded-[8px] bg-yellow-50 
                                py-[12px] px-[12px] font-semibold text-richblack-900' type="submit">
                                    Sumbit
                                </button>
                            </form>
                        )
                    }

                    {
                        emailSent === true && (
                            <form className='w-full' onSubmit={handleSumbit}>
                                <button className='mt-6 w-full rounded-[8px] bg-yellow-50 
                                py-[12px] px-[12px] font-semibold text-richblack-900' type="submit">
                                    Resend email
                                </button>
                            </form>
                        )
                    }

                    
                    <Link to="/login">
                    <div className='text-richblack-5 flex mt-6 items-center gap-2'>
                        <BiArrowBack/>
                        Back To Login 
                    </div>    
                    </Link>
                    
                </div>
            )
        }
    </div>
  )
}

export default ForgotPassword