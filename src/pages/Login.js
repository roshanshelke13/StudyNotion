import { useEffect } from "react"
import loginImg from "../assets/Images/login.webp"
import Template from "../components/core/Auth/Template"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

function Login() {
  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token)
  useEffect(() => {
    if(token ){
      navigate("/home")
    }
  },[token,navigate]
  )
  return (
    <Template
      title="Welcome Back"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={loginImg}
      formType="login"
    />
  )
}

export default Login
