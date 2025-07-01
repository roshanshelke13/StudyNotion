const User = require("../models/User");
const Profile = require("../models/Profile");
const Course = require("../models/Course");
const {imageUploader} = require("../utils/imageUploader");
const CourseProgress = require("../models/CourseProgress");
const {convertSecondsToDuration} = require("../utils/secToDuration");

exports.updateProfile = async (req,res) => {
    try {
      const {
        firstName = "",
        lastName = "",
        dateOfBirth = "",
        about = "",
        contactNumber = "",
        gender = "",
      } = req.body
		const id = req.user.id;

		// Find the profile by id
    const userDetails = await User.findById(id);
		const profile = await Profile.findById(userDetails.additionalDetail);

		// Update the profile fields
		profile.dateOfBirth = dateOfBirth;
		profile.about = about;
		profile.contactNumber = contactNumber;
    profile.gender = gender;

		// Save the updated profile
    const user = await User.findById(id)
    user.firstName = firstName;
    user.lastName = lastName;
    await user.save()
    
		await profile.save();

		return res.json({
			success: true,
			message: "Profile updated successfully",
			profile,
      user
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

exports.deleteProfile = async(req,res) => {
    try{

        const userId = req.user.id;
        if(!userId){
            return res.status(401).json({
                success:false,
                message:"user id not found"
            });
        }

        const user = await User.findById(userId);

        if(!user){
            return res.status(401).json({
                success:false,
                message:"user not found"
            });
        }

        const profileId = user.additionalDetail;

        if(!profileId){
            return res.status(401).json({
                success:false,
                message:"profile id not found"
            });
        }

        const profile = await Profile.findByIdAndDelete(profileId);

        if(!profile){
            return res.status(401).json({
                success:false,
                message:"profile not found"
            });
        }

        // if(user.courses && user.courses.length>0){
        //     for(const courseId of user.courses){
        //         await Course.findByIdAndUpdate(
        //             courseId,
        //             {
        //                 $pull:{studentsEnrolled: userId}
        //             },
        //             {new:true},
        //         );
        //     }
        // }

        // if (user.courses && user.courses.length > 0) {
        //     await Promise.all(
        //         user.courses.map(courseId =>
        //             Course.findByIdAndUpdate(
        //                 courseId,
        //                 { $pull: { studentsEnrolled: userId } },
        //                 { new: true }
        //             )
        //         )
        //     );
        // }

        if (user.courses && user.courses.length > 0) {
            await Course.updateMany(
                { _id: { $in: user.courses } },  // Find courses where user is enrolled
                { $pull: { studentsEnrolled: userId } } // Remove user from the array
            );
        } 
        

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(500).json({
                success: false,
                message: "User deletion failed",
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "User and profile deleted successfully",
        });

    }catch(error){
        return res.status(403).json({
            success:false,
            message:error.message
        });
    }
};

exports.getAllUserDetails = async (req, res) => {
	try {
		const id = req.user.id;
		const userDetails = await User.findById(id)
			.populate("additionalDetail")
			.exec();
		console.log(userDetails);
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.updateDisplayPicture = async (req, res) => {
    try {
      if (!req.files || !req.files.displayPicture) {
        return res.status(400).json({ success: false, message: "No display picture uploaded" });
      }
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await imageUploader(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      let userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path:"courses",
          populate:{
            path:"courseContent",
            populate:{
              path:"subSection"
            }
          }
        })
        .exec()


      userDetails = userDetails.toObject()
      var SubsectionLength = 0
      for (var i = 0; i < userDetails.courses.length; i++) {
        let totalDurationInSeconds = 0
        SubsectionLength = 0
        for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
          totalDurationInSeconds += userDetails.courses[i].courseContent[
            j
          ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
          userDetails.courses[i].totalDuration = convertSecondsToDuration(
            totalDurationInSeconds
          )
          SubsectionLength +=
            userDetails.courses[i].courseContent[j].subSection.length
        }
        let courseProgressCount = await CourseProgress.findOne({
          courseID: userDetails.courses[i]._id,
          userId: userId,
        })
        courseProgressCount = courseProgressCount?.completedVideos.length
        if (SubsectionLength === 0) {
          userDetails.courses[i].progressPercentage = 100
        } else {
          // To make it up to 2 decimal point
          const multiplier = Math.pow(10, 2)
          userDetails.courses[i].progressPercentage =
            Math.round(
              (courseProgressCount / SubsectionLength) * 100 * multiplier
            ) / multiplier
        }
      }  
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }


      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

exports.getInstructorStat = async (req,res) => {
  try{

    const userId = req.user.id

    const courses = await Course.find({
      instructor:userId
    })

    const courseData = courses.map((course) => {
      const totalStudents = course.studentsEnrolled.length
      const totalAmount = totalStudents * course.price

      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudents,
        totalAmount,
      }

      return courseDataWithStats
    })

    return res.status(200).json({
        success: true,
        data:courseData,        
    })

  } catch(error){
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      })
  }
}