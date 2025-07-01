import { setLoading,setProfile } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { profileEndpoints, settingsEndpoints } from "../apis";
import toast from "react-hot-toast";
import {logout} from "./authAPI"
import { setUser } from "../../slices/profileSlice";

const {
    GET_USER_DETAILS_API,
    GET_USER_ENROLLED_COURSES_API,
    GET_INSTRUCTOR_DATA_API,
  } = profileEndpoints



export function getUserDetails (token,navigate){
    return async(dispatch,getState) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try{
            
            const response = await apiConnector("GET",GET_USER_DETAILS_API,null,{
                Authorization: `Bearer ${token}`,
            })

            console.log("GET_USER_DETAILS API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            const userImage = response.data.data.image
            ? response.data.data.image
            : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`

            dispatch(setProfile(response.data.data.additionalDetail))
            localStorage.setItem("details", JSON.stringify(response.data.data))

            dispatch(setUser({ ...response.data.data, image: userImage }));
            
            const user = getState().profile.user;
            
            // Store it in localStorage
            localStorage.setItem("user", JSON.stringify(user));

        }
        catch(error){
            dispatch(logout(navigate))
            console.log("GET_USER_DETAILS API ERROR............", error)
            toast.error("Could Not Get User Details")
        }
        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}

export async function getUserEnrolledCourses(token) {
    const toastId = toast.loading("Loading...")
    let result = []
    try {
      const response = await apiConnector(
        "GET",
        GET_USER_ENROLLED_COURSES_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      )
      console.log(
        "GET_USER_ENROLLED_COURSES_API API RESPONSE............",
        response
      )
  
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      result = response.data.data
    } catch (error) {
      console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
      toast.error("Could Not Get Enrolled Courses")
    }
    toast.dismiss(toastId)
    return result
}

export async function getInstructorStat(token){
  const toastId = toast.loading("Loading...")
  let result = []
  try{
    const response = await apiConnector("GET",GET_INSTRUCTOR_DATA_API,null,{
      Authorization: `Bearer ${token}`
    })

    result = response.data.data

  }catch(error){
    console.log("error",error)
  }
  toast.dismiss(toastId)
  return result
}
