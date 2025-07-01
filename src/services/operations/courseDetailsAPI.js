import { apiConnector } from "../apiconnector"
import { toast } from "react-hot-toast"
import { courseEndpoints } from "../apis"

const {
    COURSE_DETAILS_API,
    COURSE_CATEGORIES_API,
    GET_ALL_COURSE_API,
    CREATE_COURSE_API,
    EDIT_COURSE_API,
    CREATE_SECTION_API,
    CREATE_SUBSECTION_API,
    UPDATE_SECTION_API,
    UPDATE_SUBSECTION_API,
    DELETE_SECTION_API,
    DELETE_SUBSECTION_API,
    GET_ALL_INSTRUCTOR_COURSES_API,
    DELETE_COURSE_API,
    GET_FULL_COURSE_DETAILS_AUTHENTICATED,
    CREATE_RATING_API,
    LECTURE_COMPLETION_API,
  } = courseEndpoints

  export async function fetchCategories() { 
    let result = []
    try {
      const response = await apiConnector("GET", COURSE_CATEGORIES_API)
  
      console.log("COURSE_CATEGORIES_API API RESPONSE............", response)
  
      result = response?.data?.data
      if (!response?.data?.success) {
        throw new Error("Could Not Fetch Course Categories")
      }
    } catch (error) {
      console.log("COURSE_CATEGORY_API API ERROR............", error)
      toast.error(error.message)
    }
  
    return result  // Return the result directly
  }
  

export const addCourseDetails = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("POST", CREATE_COURSE_API, data, {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      })
      console.log("CREATE COURSE API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Add Course Details")
      }
      toast.success("Course Details Added Successfully")
      result = response?.data?.data
    } catch (error) {
      console.log("CREATE COURSE API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const deleteCourse = async(data,token) => {
  const toastId = toast.loading("Loading...");
  try{
    const response = await apiConnector("DELETE",DELETE_COURSE_API,data,{
      Authorization : `Bearer ${token}`
    })

    if(!response?.data?.success){
      throw new Error("Could Not Delete Course")
    }

    toast.success("Course DELETED Successfully")
  }catch(error){
    console.log("DELETE COURSE API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId);
}

export const getCourseDetail = async(data) => {
  let result = null
  const toastId = toast.loading("Loading....")
  try{
    const response = await apiConnector("POST",COURSE_DETAILS_API,data)

    if(!response?.data?.success){
      throw new Error("Could Not Get Course")
    }

    result =  response.data.data

    // toast.success("Course fetched Successfully")


  }catch(error){
    console.log("FETCH COURSE API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const getFullCourseDetail = async(data,token) => {
  let result = null
  const toastId = toast.loading("Loading....")
  try{
    const response = await apiConnector("POST",GET_FULL_COURSE_DETAILS_AUTHENTICATED,data,{
      Authorization: `Bearer ${token}`
    })

    if(!response?.data?.success){
      throw new Error("Could Not Get Course")
    }

    result =  response.data.data

    // toast.success("Course fetched Successfully")


  }catch(error){
    console.log("FETCH COURSE API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}
  
  // edit the course details
export const editCourseDetails = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("POST", EDIT_COURSE_API, data, {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      })
      console.log("EDIT COURSE API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Update Course Details")
      }
      toast.success("Course Details Updated Successfully")
      result = response?.data?.data
    } catch (error) {
      console.log("EDIT COURSE API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const createSection = async (data,token) => {
  let result = null
  let toastId = toast.loading("Loading....")
  try{

    const response = await apiConnector("POST",CREATE_SECTION_API,data,{
      Authorization: `Bearer ${token}`,
    })

    console.log("CREATE SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Create Section")
    }
    toast.success("Course Section Created")
    result = response.data.course

  }catch(error){
    console.log("CREATE SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const deleteSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Section")
    }
    toast.success("Course Section Deleted")
    result = response?.data?.data
  } catch (error) {
    console.log("DELETE SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}
// delete a subsection
export const deleteSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE SUB-SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Lecture")
    }
    toast.success("Lecture Deleted")
    result = response?.data?.data
  } catch (error) {
    console.log("DELETE SUB-SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const updateSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("UPDATE SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Update Section")
    }
    toast.success("Course Section Updated")
    result = response?.data?.data
  } catch (error) {
    console.log("UPDATE SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const updateSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("UPDATE SUB-SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Update Lecture")
    }
    toast.success("Lecture Updated")
    result = response?.data?.data
  } catch (error) {
    console.log("UPDATE SUB-SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const createSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    console.log("data",data);
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE SUB-SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Add Lecture")
    }
    toast.success("Lecture Added")
    result = response?.data?.data
  } catch (error) {
    console.log("CREATE SUB-SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const getInstructorCourses = async (token) => {
  const toastId = toast.loading("Loading....")
  let result = null
  try{

    const response = await apiConnector("GET",GET_ALL_INSTRUCTOR_COURSES_API,null,{
      Authorization: `Bearer ${token}`
    });

    if(!response?.data?.success){
      throw new Error("Could not Fetch instructor courses");
    }

    result = response?.data?.data;
    // toast.success("Fetched Courses");

  }catch(error){
    console.log("INSTRUCTOR COURSES API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId);
  return result;
}

export const createRating = async(data,token) => {
  const toastId = toast.loading("Loading.....")
  try{
      const response = await apiConnector("POST",CREATE_RATING_API,data,{
        Authorization: `Bearer ${token}`
      });

      if(!response?.data?.success){
          throw new Error("Could not post the Review")
      }

      toast.success("Review posted")


  }catch(error){
      console.log("CREATE_RATING_API API ERROR............", error)
      toast.error(error.message)
  }
  toast.dismiss(toastId);
}

export const markLectureAsComplete = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading");

  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      const errorMessage = response.data?.error || "Something went wrong";
      throw new Error(errorMessage);
    }

    toast.success("Lecture marked as completed");
    result = true;
  } catch (error) {
    console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", error);
    toast.error(error.message || "Failed to mark lecture as completed");
    result = false;
  }

  toast.dismiss(toastId);
  return result;
};
