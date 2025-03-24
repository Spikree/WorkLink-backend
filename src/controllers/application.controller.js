import Application from "../models/application.model.js";
import Job from "../models/job.model.js"

export const applyJob = async (req,res) => {
    const {id: jobId} = req.params;
    const user = req.user;
    const {bidAmount,coverLetter} = req.body;

    if(!bidAmount) {
        return res.status(400).json({
            message: "Bid Amount Is Required"
        })
    }

    if(!coverLetter) {
        return res.status(400).json({
            message: "Cover Letter Is Required"
        })
    }

    try {
        const isJob = await Job.findById(jobId)

        if(!isJob) {
            return res.status(404).json({
                message: "Job Not Found"
            })
        }

        const hasApplied = await Application.findOne({
            job: jobId,
            freelancer: user._id
        });

        if(hasApplied) {
            return res.status(400).json({
                message: "You Have Already Applied For This Job"
            })
        }

        const application = new Application({
            job: jobId,
            freelancer: user._id,
            bidAmount: bidAmount,
            coverLetter: coverLetter
        })

        await application.save();

        return res.status(200).json({
            message: "Application Submitted Sucessfully",
            application
        })
    } catch (error) {
        console.log("Error in application controller in apply job" + error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
} 