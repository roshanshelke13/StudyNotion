const express = require("express");
const router = express.Router();

const {createCourse,getAllCourses,getCourseDetail,editCourse,getInstructorCourses,deleteCourse,getFullCourseDetails} = require("../controllers/Course");
const {createSection,updateSection,deleteSection} = require("../controllers/Section");
const {createSubSection,updateSubSection,deleteSubSection} = require("../controllers/SubSection");
const {createCategory,getAllCategory,categoryPageDetails} = require("../controllers/Category");
const {createRatingAndReview,averageRating,getAllRatingOfCourse,getAllRating} = require("../controllers/RatingAndReview");
const {updateCourseProgress} = require("../controllers/CourseProgress");

const {auth,isInstructor,isStudent,isAdmin} = require("../middlewares/auth");

//routes for instructor
router.post("/createCourse",auth,isInstructor,createCourse);
router.post("/addSection",auth,isInstructor,createSection);
router.post("/updateSection",auth,isInstructor,updateSection);
router.post("/deleteSection",auth,isInstructor,deleteSection);
router.post("/addSubSection",auth,isInstructor,createSubSection);
router.post("/updateSubSection",auth,isInstructor,updateSubSection);
router.post("/deleteSubSection",auth,isInstructor,deleteSubSection);
router.post("/editCourse", auth, isInstructor, editCourse)
router.get("/getInstructorCourses",auth,isInstructor,getInstructorCourses);
router.delete("/deleteCourse",auth,isInstructor,deleteCourse)

//routes for admin
router.post("/createCategory",auth,isAdmin,createCategory);

//routes for students
router.post("/createRating",auth,isStudent,createRatingAndReview);

//routes for everyone
router.get("/getAllCourses",getAllCourses);
router.post("/getCourseDetail",getCourseDetail);
router.post("/getFullCourseDetails",auth,isStudent,getFullCourseDetails);
router.get("/showAllCategories",getAllCategory);
router.post("/getCategoryPageDetails",categoryPageDetails);
router.get("/getAverageRating",averageRating);
router.get("getRatingOfCourse",getAllRatingOfCourse);
router.get("/getReviews",getAllRating);

// To Update Course Progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)

module.exports = router;
