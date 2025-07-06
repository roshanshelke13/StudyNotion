const Section = require("../models/Section");
const Course = require("../models/Course");


exports.createSection = async(req,res) => {
    try{

        const {sectionName,courseId} = req.body;

        if(!sectionName || !courseId){
            return res.status(500).json({
                success:false,
                message:"Missing fields",
            })
        }

        const newSection = await Section.create({
            sectionName,     
        });

        const course = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id
                }
            },
            {new:true}
        )//how to use populate to replace sectios/sub-sections both in the updatedCourseDetails
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection", // Assuming `subSections` is a field inside `Section`
            },
        });

        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            course
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Section was not created",
        })
    }
};

exports.updateSection = async(req,res) => {
    try{

        const {sectionName,sectionId,courseId} = req.body;

        if(!sectionName || !sectionId){
            return res.status(500).json({
                success:false,
                message:"Missing fields",
            })
        }

        const section = await Section.findByIdAndUpdate(
            sectionId,
            {sectionName},
            {new:true}
        )

        const course =  await Course.findById(courseId)
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection", // Assuming `subSections` is a field inside `Section`
            },
        });

        return res.status(200).json({
            success: true,
            message: "Section updated",
            data:course
        });


    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Failed to update section",
        })
    }
};

exports.deleteSection = async (req,res) => {
    try{ 
        const {sectionId,courseId} = req.body;

        if(!sectionId || !courseId){
                return res.status(401).json({
                    success:false,
                    message:"Failed to update section",
                })
        }

        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }
 
        await Section.findByIdAndDelete(sectionId);

        await Course.findByIdAndUpdate(
            courseId,
            {
                $pull:{
                    courseContent:sectionId
                },
            },
            {new:true}
        );

        const course = await Course.findById(courseId)
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection", // Assuming `subSections` is a field inside `Section`
            },
        });

        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            data:course
        });

         
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Failed to update section",
        })
    }
}

