import { setLoading,setProfile, setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { profileEndpoints, settingsEndpoints } from "../apis";
import toast from "react-hot-toast";
import { getUserDetails } from "./profileAPI";
import { useSelector } from "react-redux";
import {logout} from "./authAPI";

const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API
} = settingsEndpoints



export function updateProfile(data,token,navigate){
    return async(dispatch,getState) => {
        const toastId = toast.loading("Loading.....")
        try{
            const response = await apiConnector("PUT",UPDATE_PROFILE_API,data,{
                Authorization: `Bearer ${token}`,
            })

            console.log("user updated details ...",response)
            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            dispatch(getUserDetails(token,navigate))
      
            toast.success("Updated Successfully");
            
            
        }catch(error){
            console.log("UPDATE_PROFILE_API API ERROR............", error)
            toast.error("Could Not Update Profile")
        }
        toast.dismiss(toastId)
    }
}

export function updatePassword(password,newPassword,confirmPassword,token){
    return async(dispatch) => {
        const toastId = toast.loading("Loading...")
        try{
            const response = await apiConnector("POST",CHANGE_PASSWORD_API,{
                password,newPassword,confirmPassword
            },{
                Authorization: `Bearer ${token}`,
            })

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Password Changed Successfully");
        }
        catch(error){
            console.log(" CHANGE_PASSWORD_API API ERROR............", error)
            toast.error("Could Not Update Profile")
        }
        toast.dismiss(toastId)
    }
}

export function deleteProfile(token,navigate){
    return async(dispatch) => {
        try{
            const response = await apiConnector("DELETE",DELETE_PROFILE_API,null,{
                Authorization:`Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Account Deleted Successfully");
            dispatch(logout(navigate))
        }
        catch(error){

        }
    }
}

export function updateDisplayPicture(token, formData) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      try {
        const response = await apiConnector(
          "PUT",
          UPDATE_DISPLAY_PICTURE_API,
          formData,
          {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          }
        )
        console.log(
          "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
          response
        )
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        toast.success("Display Picture Updated Successfully")
        dispatch(setUser(response.data.data))
      } catch (error) {
        console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
        toast.error("Could Not Update Display Picture")
      }
      toast.dismiss(toastId)
    }
  }