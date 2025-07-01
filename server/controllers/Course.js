const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {imageUploader} = require("../utils/imageUploader");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const {convertSecondsToDuration} = require("../utils/secToDuration")
require("dotenv").config();

exports.createCourse = async (req,res) => {
    try{

        const {
            courseName,
			courseDescription,
			whatYouWillLearn,
			price,
			tag,
			category,
			status,
			instructions,
        } = req.body;

        if (!req.files || !req.files.thumbnailImage) {
            return res.status(400).json({ success: false, message: "Thumbnail image is required" });
        }

        const thumbnail = req.files.thumbnailImage;


        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail || !tag){
            return res.status(401).json({ success: false, message:"All fields are required"});
        }

        const courseStatus = status || "Draft";

        const userId = req.user.id; // Ensure req.user is available
        const instructorDetails = await User.findById(userId);

        if (!instructorDetails || instructorDetails.accountType !== "Instructor") {
            return res.status(403).json({ success: false, message: "User is not an instructor" });
        }

        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            return res.status(404).json({ success: false, message:" Category not found" });
        }

        const responseImage = await imageUploader(thumbnail,process.env.FOLDER_NAME);

        const newCourse = await Course.create({
            courseName,
			courseDescription,
			instructor: instructorDetails._id,
			whatYouWillLearn,
			price,
			tag,
			category: categoryDetails._id,
			thumbnail: responseImage.secure_url,
			status: courseStatus,
			instructions,
        });

        await User.findByIdAndUpdate(
            instructorDetails._id,
            {
                $push:{
                    courses: newCourse._id,
                }                
            },
            {new:true},
        )

        await Category.findByIdAndUpdate(
            categoryDetails._id,
            {
                $push:{
                    courses:newCourse._id
                }
            },
            {new:true}
        )

        return res.status(200).json({ success: true, message:"course created successfully",data:newCourse});


    }catch(error){
        return res.status(500).json({ success: false, message:error.message });
    }
};

exports.getAllCourses = async(req,res) => {
    try{
        
        const allCourses = await Course.find({},{
            courseName:true,
            price:true,
            thumbnail:true,
            instructor:true,
            ratingAndReviews:true,
            studentsEnrolled:true,
        }).populate("instructor")
        .exec();

        return res.status(200).json({ success:true, message:"Data of courses fetched successfully",data:allCourses});

    }catch(error){
        return res.status(500).json({ success: false, message:"Course not found"});   
    }
};

exports.getCourseDetail = async(req,res) => {
    try{

        const {courseId} = req.body;

        if(!courseId){
            return res.status(400).json({ success: false, message:"Course Id not found" });
        }

        const courseDetails = await Course.findById(courseId)
                                    .populate(
                                        {
                                            path:"instructor",
                                            populate:{
                                                path:"additionalDetail",
                                            },
                                        }
                                    )
                                    .populate("category")
                                    .populate("ratingAndReviews")
                                    .populate({
                                        path:"courseContent",
                                        populate:{
                                            path:"subSection",
                                        },
                                    })
                                    .exec();


        if(!courseDetails){
            return res.status(404).json({ 
                success: false, 
                message:" Course not found" ,
            });
        }

        return res.status(200).json({
            success:true,
            message:"Details of course populated successfully",
            data:courseDetails,
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({ success: false, message:error.message});   
    }
}

exports.editCourse = async(req,res) => {
    try{
        const {courseName,
			courseDescription,
			whatYouWillLearn,
			price,
			tag,
			category,
			status,
			instructions,courseId} = req.body;

        const course = await Course.findById(courseId)

        if(!course) {
            return res.status(404).json({ error: "Course not found" })
        }

        if (req.files) {
            console.log("thumbnail update")
            const thumbnail = req.files.thumbnailImage
            const thumbnailImage = await imageUploader(
              thumbnail,
              process.env.FOLDER_NAME
            )
            course.thumbnail = thumbnailImage.secure_url
        }

        if(courseName !== undefined){
            course.courseName = courseName
        }

        if(courseDescription !== undefined){
            course.courseDescription = courseDescription
        }
        if(whatYouWillLearn !== undefined){
            course.whatYouWillLearn = whatYouWillLearn
        }
        if(price !== undefined){
            course.price = price
        }
        if(category !== undefined){
            course.category = category
        }
        if(tag !== undefined){
            course.tag = JSON.parse(tag);
        }

        if(instructions !== undefined){
            course.instructions = JSON.parse(instructions);
        }

        if(status !== undefined){
            course.status = status
        }

        await course.save()

        const updatedCourse = await Course.findOne({
        _id: courseId,
        })
        .populate({
            path: "instructor",
            populate: {
            path: "additionalDetail",
            },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path: "courseContent",
            populate: {
            path: "subSection",
            },
        })
        .exec()

        res.json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        })

    }catch(error){
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}

exports.getInstructorCourses = async (req,res) => {
    try{
        const userId = req.user.id;

        const courses = await Course.find({
            instructor:userId,
        }).sort({createdAt:-1});

        res.status(200).json({
            success:true,
            message:"All Courses of Instructor fetched successfully",
            data:courses
        })
    }catch(error){
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error.message,
        })
    }
}

exports.deleteCourse = async(req,res) => {
    try{
        const {courseId} = req.body;

        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }

        const studentsEnrolled = course.studentsEnrolled;
        for(const studentId of studentsEnrolled){
            await User.findByIdAndUpdate(studentId,{
                $pull:{courses:courseId}
            })
        }

        const courseSections = course.courseContent
        for (const sectionId of courseSections) {
        // Delete sub-sections of the section
            const section = await Section.findById(sectionId)
            if (section) {
                const subSections = section.subSection
                for (const subSectionId of subSections) {
                    await SubSection.findByIdAndDelete(subSectionId)
                }
            }

        // Delete the section
            await Section.findByIdAndDelete(sectionId)
        }

        // Delete the course
        await Course.findByIdAndDelete(courseId)

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        })

    }catch(error){
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    // console.log(courseId)
    const userId = req.user.id
    // console.log(userId)
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetail",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    // console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}