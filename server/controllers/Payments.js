
const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const mongoose = require("mongoose");
const crypto = require('crypto');
const CourseProgress = require("../models/CourseProgress")
const {paymentSuccessEmail} = require("../mail/templates/paymentSuccessEmail");

exports.capturePayment = async(req,res) => {

        const {courses} = req.body;
        const userId = req.user.id;

        if(courses.length === 0){
            return res.json({success:false,message:"Please select course"});
        }

        let totalAmount = 0;

        for(const course_id of courses){
            let course;
            try{
                course = await Course.findById(course_id);
                if(!course){
                    return res.status(200).json({success:false , message:"Could not find the course"});
                }

                const uid = new mongoose.Types.ObjectId(userId);

                // const user = course.studentsEnrolled.some((id) => id.equals(userId));

                if(course.studentsEnrolled.includes(uid)){
                    return res.status(200).json({success:false , message:"Studnet is already enrolled"});
                }

                totalAmount = totalAmount += course.price; 
            }catch(error){
                console.log(error);
                return res.status(500).json({success:false,message:error.message}); 
            }
        }

        const options = {
            amount:totalAmount * 100,
            currency:"INR",
            receipt:Math.random(Date.now()).toString(),
        }

        try{
            const payementResponse  = await instance.orders.create(options);
            res.json({
                success:true, 
                message:payementResponse
            })
        }catch(error){
            console.log(error)
            res.status(500).json({ success: false, message: "Could not initiate order." })
        }
    
}


exports.verifyPayment = async(req,res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !courses ||
        !userId
    ) {
        return res.status(200).json({ success: false, message: "Payment Failed" })
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex")

    if (expectedSignature === razorpay_signature) {
        await enrollStudents(courses, userId, res)
        return res.status(200).json({ success: true, message: "Payment Verified" })
    }

    return res.status(200).json({ success: false, message: "Payment Failed" })
}

const enrollStudents = async(courses,userId,res) => {
    if (!courses || !userId) {
        return res
        .status(400)
        .json({ success: false, message: "Please Provide Course ID and User ID" })
    }

    for(const courseId of courses){
        try{
            const course = await Course.findById(courseId);

            if (!course) {
                return res
                .status(500)
                .json({ success: false, error: "Course not found" })
            }

            const enrolledCourse = await Course.findOneAndUpdate(
                {_id:courseId},
                {
                    $push:{studentsEnrolled:userId}
                },
                {new:true}
            )

            if (!enrolledCourse) {
                return res
                .status(500)
                .json({ success: false, error: "Course not found" })
            }
            console.log("Updated course: ", enrolledCourse)

            const courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            })

            const enrolledStudent = await User.findByIdAndUpdate(userId,
                {
                    $push:{
                        courses:courseId,
                        courseProgress: courseProgress._id,
                    }
                },
                {new:true}
            )

            const emailResponse = await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(
                enrolledCourse.courseName,
                `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
                )
            )

            console.log("Email sent successfully: ", emailResponse.response)
        }catch(error){
            console.log(error)
            return res.status(400).json({ success: false, error: error.message })
        }
    }
}

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}

// exports.capturePayment = async (req,res) => {
//     try{
//         const {course_id} = req.body;
//         const userId = req.user.id;

//         if(!course_id) {
//             return res.json({
//                 success:false,
//                 message:'Please provide valid course ID',
//             })
//         };
//         //valid courseDetail
//         let course;
//         try{
//             course = await Course.findById(course_id);
//             if(!course) {
//                 return res.json({
//                     success:false,
//                     message:'Could not find the course',
//                 });
//             }

//             if (!mongoose.Types.ObjectId.isValid(userId)) {
//                 return res.status(400).json({ success: false, message: "Invalid user ID" });
//             }
            
//             const uid =  mongoose.Types.ObjectId(userId.toString());
            
//             if (course.studentsEnrolled.some(studentId => studentId.equals(uid))) {
//                 return res.status(200).json({
//                     success: false,
//                     message: "Student is already enrolled",
//                 });
//             }

//         }catch(error) {
//             console.error(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });
//         }
        
//         const amount = course.price;
//         const currency = "INR";

//         const options = {
//             amount: amount*100,
//             currency,
//             receipt: `receipt_${Date.now()}`,
//             notes:{
//                 courseId:course_id,
//                 userId
//             }
//         };

//         try{
//             const paymentResponse = await instance.orders.create(options);
//             console.log(paymentResponse);
//         }catch(error){
//             console.error(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });
//         }
//         return res.status(200).json({
//                 success:true,
//                 courseName:course.courseName,
//                 courseDescription:course.courseDescription,
//                 thumbnail: course.thumbnail,
//                 orderId: paymentResponse.id,
//                 currency:paymentResponse.currency,
//                 amount:paymentResponse.amount,
//         });


//     }
//     catch(error){
//         return res.status(500).json({
//             success:false,
//             message:"payement was not able to captured"
//         })
//     }
// };

// exports.verifySignature = async (req, res) => {
//     try {
//         const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
//         const signature = req.headers["x-razorpay-signature"];

//         const shasum = crypto.createHmac("sha256", webhookSecret);
//         shasum.update(JSON.stringify(req.body));
//         const digest = shasum.digest("hex");

//         if (!signature === digest) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid request - Signature Mismatch",
//             });
//         }

//         console.log("Payment is Authorized");

//         const { courseId, userId } = req.body.payload.payment.entity.notes;

//         // Enroll the student in the course
//         const enrolledCourse = await Course.findByIdAndUpdate(
//             courseId,
//             { $push: { studentsEnrolled: userId } },
//             { new: true }
//         );

//         if (!enrolledCourse) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Course not Found",
//             });
//         }

//         console.log("Course Updated:", enrolledCourse);

//         // Add the course to the student's list
//         const enrolledStudent = await User.findByIdAndUpdate(
//             userId,
//             { $push: { courses: courseId } },
//             { new: true }
//         );

//         if (!enrolledStudent) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not Found",
//             });
//         }

//         console.log("User Updated:", enrolledStudent);

//         // Send confirmation email
//         if (enrolledStudent.email) {
//             await mailSender(
//                 enrolledStudent.email,
//                 "Congratulations from CodeHelp",
//                 "Congratulations, you are onboarded into the new CodeHelp Course!"
//             );
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Signature Verified and Course Added",
//         });

//     } catch (error) {
//         console.error("Error in Webhook Processing:", error);
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

