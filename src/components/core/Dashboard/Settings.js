import React from 'react'
import ImageSetting from "./Settings/ImageSetting";
import ProfileInfoSetting from './Settings/ProfileInfoSetting';
import ChangePassword from './Settings/ChangePassword';
import DeleteAccount from './Settings/DeleteAccount';
import { useSelector,useDispatch } from 'react-redux'

const Settings = () => {
 
  return (
    <div className='text-richblack-5'>
        <h1></h1>
        <ImageSetting/>
        <ProfileInfoSetting/>
        <ChangePassword/>
        <DeleteAccount/>
    </div>
  )
}

export default Settings