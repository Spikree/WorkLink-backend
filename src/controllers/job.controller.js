import Job from "../models/job.model.js";

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