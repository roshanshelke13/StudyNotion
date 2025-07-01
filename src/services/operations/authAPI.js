import { endpoints, profileEndpoints } from "../apis"
import { apiConnector } from "../apiconnector"
import toast from "react-hot-toast"
import {setToken,setLoading} from "../../slices/authSlice"
import { setUser } from "../../slices/profileSlice"
import { useSelector } from "react-redux"
import { resetCart } from "../../slices/cartSlice"
import { setProfile } from "../../slices/profileSlice";
import { getUserDetails } from "./profileAPI"

const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API,
  } = endpoints

export function login(email,password,navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try{
            const res = await apiConnector("POST",LOGIN_API,{email,password})
            console.log(res);

            if (!res.data.success) {
                throw new Error(res.data.message)
            }

            toast.success("Login Successful")
        
            dispatch(setToken(res.data.token))
            dispatch(setUser(res.data.userObj))
            localStorage.setItem("token", JSON.stringify(res.data.token))
            localStorage.setItem("user", JSON.stringify(res.data.userObj));
            // dispatch(getUserDetails(res.data.token)) 
            navigate("/dashboard/my-profile")
            
        }catch(error){
            console.log("LOGIN API ERROR............", error)
            toast.error("Login Failed. Please try again.")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function logout (navigate) {
    return async (dispatch) => {
        try{
            dispatch(setToken(null))
            dispatch(setUser(null))
            dispatch(resetCart())
            dispatch(setProfile(null))
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            localStorage.removeItem("details")
            toast.success("Logged Out")
            navigate("/")
        }catch(error){
            toast.error("Logout Failed. Please try again.")
        }
    }
}

export function signup (firstName,lastName,email,password,confirmPassword,accountType,otp,navigate) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try{
            console.log(password,confirmPassword)
            const response = await apiConnector("POST",SIGNUP_API,{
                firstName,lastName,email,password,confirmPassword,accountType,otp
            })

            console.log(response);

            if(!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("Signup Successful")
            navigate("/login");

        }
        catch(error){
            console.log("SIGNUP API ERROR............", error)
            toast.error("Signup Failed")
            navigate("/signup")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function sendotp (email,navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try{
            const response = await apiConnector("POST",SENDOTP_API,{
                email
            })

            if(!response.data.success){
                throw new Error(response.data.message)
            }
            console.log(response)
            toast.success("OTP Sent Successfully")
            navigate("/verify-email")
        } catch (error) {
            console.log("SENDOTP API ERROR............", error)
            toast.error("Could Not Send OTP")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function resetPasswordToken (email,setEmailSent){
        return async (dispatch) => {
            const toastId = toast.loading("Loading...")
            dispatch(setLoading(true))
            try{
                console.log("inside")
                const response = await apiConnector("POST",RESETPASSTOKEN_API,{email})

                console.log("RESETPASSTOKEN RESPONSE............", response)

                if (!response.data.success) {
                    throw new Error(response.data.message)
                }

                toast.success("Reset Email Sent")
                setEmailSent(true);
            }catch(error){
                console.log("RESETPASSTOKEN ERROR............", error)
                toast.error("Failed To Send Reset Email")
            }
            dispatch(setLoading(false))
            toast.dismiss(toastId)
        }       
}

export function resetPassword (token,password,confirmPassword,navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try{

            const response = await apiConnector("POST",RESETPASSWORD_API,{
                token,password,confirmPassword
            });

            console.log("RESETPASSWORD RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Password Reset Successfully")
            navigate("/login")

        }catch(error){
            console.log("RESETPASSWORD ERROR............", error)
            toast.error("Failed To Reset Password")
        }
        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}