import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import IconBtn from '../../../common/IconBtn';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from '../../../../services/operations/settingsAPI';

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [state1, setState1] = useState(false);
  const [state2, setState2] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  function submitHandler(e) {
    e.preventDefault();
    if (!password || !newPassword) {
      return alert("Please fill in all fields.");
    }
    const confirmPassword = newPassword;
    dispatch(updatePassword(password, newPassword, confirmPassword, token));
    setPassword("");
    setNewPassword("");
  }

  return (
    <form onSubmit={submitHandler}>
      <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <h2 className="text-lg font-semibold text-richblack-5">Password</h2>
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="relative flex flex-col gap-2 lg:w-[48%]">
            <label className="lable-style">Current Password</label>
            <input
              value={password}
              type={state1 ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Current Password"
              className="form-style"
            />
            <span
              onClick={() => setState1((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {state1 ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" /> : <AiOutlineEye fontSize={24} fill="#AFB2BF" />}
            </span>
          </div>

          <div className="relative flex flex-col gap-2 lg:w-[48%]">
            <label className="lable-style">New Password</label>
            <input
              type={state2 ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter New Password"
              className="form-style"
            />
            <span
              onClick={() => setState2((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {state2 ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" /> : <AiOutlineEye fontSize={24} fill="#AFB2BF" />}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => navigate("/dashboard/my-profile")}
          className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
        >
          Cancel
        </button>
        <IconBtn type="submit" text="Update" onClick={submitHandler} />
      </div>
    </form>
  );
};

export default ChangePassword;
