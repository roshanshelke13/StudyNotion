const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const {imageUploader} = require("../utils/imageUploader");
const Course = require("../models/Course");

exports.createSubSection = async (req,res) => {
    try{

        const{title,description,timeDuration,sectionId} = req.body;

        const video = req.files.video;
        
        if(!sectionId || !title || !video || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }

        const response = await imageUploader(video,process.env.FOLDER_NAME);

        const newSubSection = await SubSection.create({
            title,
            timeDuration: `${response.duration}`,
            description,
            videoUrl:response.secure_url
        });

        const uploadToSection = await Section.findByIdAndUpdate(
            sectionId,
            {
                $push:{
                    subSection:newSubSection._id,
                }
            },
            {new:true}
        )
        .populate("subSection")

        //log updated section here , after adding populate query

        return res.status(200).json({
            success:true, 
            message:"Sub-section created",
            data:uploadToSection
        })


    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to create a sub-section",
        })
    }
};

exports.updateSubSection = async (req,res) => {
    try{
        
        const {title,description,subSectionId,courseId} = req.body;

        if(!subSectionId){
            return res.status(401).json({
                success:false,
                message:"Sub-section id not found",
            })
        }

        const subSection = await SubSection.findById(subSectionId);

        if(!subSection){
            return res.status(401).json({
                success:false,
                message:"Sub-section not found",
            });
        }

        if(title !== undefined){
            subSection.title = title
        }

        if(description !== undefined){
            subSection.description = description
        }

        if(req.files && req.files.video !== undefined){
            const video = req.files.video;
            const response = await imageUploader(video,process.env.FOLDER_NAME);
            subSection.videoUrl = response.secure_url;
            subSection.timeDuration = `${response.duration}`;
        }

        await subSection.save();

        const course = await Course.findById(courseId)
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection", // Assuming `subSections` is a field inside `Section`
            },
        });

        return res.status(200).json({
            success:true,
            message:"sub-section updated",
            data:course
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Failed to update sub-section",
        })
    }
};

exports.deleteSubSection = async (req,res) => {
    try{

        const {subSectionId,sectionId,courseId} = req.body;

        if(!subSectionId || !sectionId){
            return res.status(400).json({
                success:false,
                message:"All Fields are required",
            });
        }

        const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);

        if(!deletedSubSection){
            return res.status(404).json({
                success:false,
                message:"Sub-section not found",
            });
        }

        await Section.findByIdAndUpdate(
            sectionId,
            {
                $pull:{
                    subSection:subSectionId,
                }
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
            success:true,
            message:"Sub-section Deleted",
            data:course
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Failed to delete sub-section",
        })
    }
};