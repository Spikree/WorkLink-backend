import Job from "../models/job.model.js";
import Applications from "../models/application.model.js"

export const createJob = async(req,res) => {
    const {user} = req.user;
    const {title, description,budget,skillsRequired,status} = req.body;

    if(!title || !description || !budget || !skillsRequired) {
        return res.status(400).json({message: "All Fields Are Required"});
    };

    try {
        const job = await Job.create({
            title: title,
            description: description,
            budget: budget,
            skillsRequired:skillsRequired,
            status: status,
            employer: user._id
        });

        job.save();

        return res.status(200).json({
            message: "Job Listing Created Sucessfully",
            job
        })
    } catch (error) {
        console.log("error in job controller at create job" + error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const getJobApplications = async (req,res) => {
    const {id: jobId} = req.params;
    const {user} = req.user;

    if(!jobId) {
        return res.status(400).json({
            message: "Job Id is Required"
        })
    }

    try {
        const applications = await Applications.find({job: jobId}).lean();

        const job = await Job.findById(jobId)

        const isCurrentEmployer = job.employer.toString() === user._id;

        if(!isCurrentEmployer) {
            return res.status(401).json({
                message: "This Job Listing Is Not By You"
            })
        }

        return res.status(200).json({
            message: "Fetched All Job Applications Sucessfully",
            applications
        })
    } catch (error) {
        console.log("error in job controller in get job applications"+error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}