const RatingAndReview = require("../models/RatingAndReview");
const User = require("../models/User");
const Course = require("../models/Course");

exports.createRatingAndReview = async (req,res) => {
    try{

        const {courseId,rating,review} = req.body;
        const userId = req.user.id;

        if(!courseId || !rating || !review){
            return res.status(400).json({
                success:false,
                message:"all fields are required",
            });
        }

        if(!userId){
            return res.status(400).json({
                success:false,
                message:"User not found",
            });
        }

        const courseDetail = await Course.findById(courseId);

        if(!courseDetail){
            return res.status(400).json({
                success:false,
                message:"Course not found",
            });
        }

        //check whether user is enrolled in course

        const isUserEnrolled = courseDetail.studentsEnrolled.some(
            (studentId) => studentId.equals(userId)
        );

        if(!isUserEnrolled){
            return res.status(400).json({
                success:false,
                message:"User is not enrolled in course",
            });
        }

        //check if rating and review already given
        const alreadyReviewed = await RatingAndReview.findOne({
            user:userId,
            course:courseId,
        });

        if(alreadyReviewed) {
            return res.status(403).json({
                success:false,
                message:'Course is already reviewed by the user',
            });
        }

        const ratingAndReview = await RatingAndReview.create({
            rating,
            review,
            user:userId,
            course:courseId
        })

        if(!ratingAndReview){
            return res.status(400).json({
                success:false,
                message:"rating and review not created",
            });
        }

        await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    ratingAndReviews:ratingAndReview._id,
                }
            },
            {new:true}
        )

        return res.status(200).json({
            success:true,
            message:"rating and review created",
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "rating and review not posted",
        });
    }

};


exports.averageRating = async(req,res) => {
    try{
        const {courseId} = req.body;

        if(!courseId){
            return res.status(400).json({
                success:false,
                message:"course id not found",
            });
        }

        const courseDetail = await Course.findById(courseId);

        if(!courseDetail){
            return res.status(400).json({
                success:false,
                message:"Course not found",
            });
        }

        let sum = 0;

        const ratingArray = await Course.findById(courseId)
                                        .populate({
                                            path:"ratingAndReviews",
                                            select:"rating"
                                        })
                                        .exec();

        const ratings = ratingArray.ratingAndReviews.map((review) => review.rating);

        ratings.forEach((rating) => {
            sum = sum + rating;
        })

        let count = ratings.length;

        const averageRating = count>0 ?  sum/count : 0;

        return res.status(200).json({
            success: true,
            averageRating,
            totalRatings: count,
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "rating and review not posted",
        });
    }
};

exports.getAllRatingOfCourse = async(req,res) => {
    try{

        const {courseId} = req.body;

        if(!courseId){
            return res.status(401).json({
                success:false,
                message:"Course id is not available"
            })
        }

        const courseDetail = await Course.findById(courseId);

        if(!courseDetail){
            return res.status(401).json({
                success:false,
                message:"Course is not available"
            })
        }

        const ratings = await Course.findById(courseId)
                                    .populate({
                                        path:"ratingAndReviews",
                                        populate:{
                                            path:"user",
                                            select:"firstName lastName image",

                                        }
                                    })
                                    .exec();

        if(!ratings){
            return res.status(401).json({
                success:false,
                message:"Rating And Reviews not found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"fetching the data done successfully",
            data:ratings
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"error in fetching the ratings"
        })
    }
}

exports.getAllRating = async(req,res) => {
    try{

        const rating = await RatingAndReview.find({})
                                            .sort({rating:"desc"})
                                            .populate({
                                                path:"user",
                                                select:"firstName lastName image"
                                            })
                                            .populate({
                                                path:"course",
                                                select:"courseName"
                                            })
                                            .exec();
        if(!rating){
            return res.status(401).json({
                success:false,
                message:"Rating And Reviews not found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"fetching the data done successfully",
            data:rating
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"error in fetching the ratings"
        })
    }
}