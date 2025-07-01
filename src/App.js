import { Route , Routes , useNavigate} from "react-router-dom";
import { useEffect } from "react"
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/common/Navbar";
import Error from "./pages/Error";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import OpenRoute from "./components/core/Auth/OpenRoute";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./components/core/Dashboard/MyProfile";
import { useSelector,useDispatch } from "react-redux";
import Settings from "./components/core/Dashboard/Settings";
import { getUserDetails } from "./services/operations/profileAPI";
import { ACCOUNT_TYPE } from "./utils/constants";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import AddCourse from "./components/core/Dashboard/AddCourse/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse/EditCourse";
import Catalog from "./pages/Catalog";
import Course from "./pages/Course";
import Cart from "./components/core/Dashboard/Cart/Cart";
import ViewCourse from "./pages/viewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails"
import InstructorDash from "./components/core/Dashboard/InstructorDashboard/InstructorDash";


function App() {
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.profile.user)
  const token = useSelector((state) => state.auth.token)

  useEffect(() => {
    if (token) {
      dispatch(getUserDetails(token, navigate))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar/>
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs/>}/>
        <Route path="catalog/:catalogName" element={<Catalog/>}/>
        <Route path="/courses/:courseId" element={<Course/>}/>

        {/* Open Route - for Only Non Logged in User */}
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/settings" element={<Settings/>} />
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="dashboard/enrolled-courses" element={<EnrolledCourses/>}/>
              <Route path="/dashboard/cart" element={<Cart/>}/>
              
            </>
          )}
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/add-course" element={<AddCourse/>}/>
              <Route path="dashboard/edit-course/:courseId" element={<EditCourse/>}/>
              <Route path="dashboard/my-courses" element={<MyCourses/>}/>
              <Route path="dashboard/instructor" element={<InstructorDash/>}/>
              
            </>
          )}

        </Route>

        <Route 
          element={
            <PrivateRoute>
              <ViewCourse/>
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>

        <Route path="*" element={<Error />} />
        
      </Routes>
    </div>


  );
}

export default App;
