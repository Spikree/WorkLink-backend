import Job from "../models/job.model.js";
import Applications from "../models/application.model.js";
import User from "../models/user.model.js";
import savedJobsModel from "../models/savedJobs.model.js";
import CurrentJob from "../models/currentJob.model.js";
import FinishedJob from "../models/finishedJob.model.js";

export const createJob = async (req, res) => {
  const user = req.user;
  const { title, description, budget, skillsRequired, status } = req.body;

  if (!title || !description || !budget || !skillsRequired) {
    return res.status(400).json({ message: "All Fields Are Required" });
  }

  try {
    const job = await Job.create({
      title: title,
      description: description,
      budget: budget,
      skillsRequired: skillsRequired,
      status: status,
      employer: user._id,
    });

    job.save();

    return res.status(200).json({
      message: "Job Listing Created Sucessfully",
      job,
    });
  } catch (error) {
    console.log("error in job controller at create job" + error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getJob = async (req,res) => {
  const jobId = req.params.id

  try {
    const findJob = await Job.findById(jobId).lean();

    if(!findJob) {
      return res.status(404).json({
        message: "Job Not Found"
      })
    }

    const employerId = findJob.employer;

    const employer = await User.findById(employerId);

    const job = {
      ...findJob, employerName: employer.profile.name
    }
      
    return res.status(200).json({
      message: "Job Found Successfully",
      job
    })
    
  } catch (error) {
    console.log("Error in Job Controller at get job" + error);
    return res.status(500).json({
      message:"Internal Server Error"
    })
  }
}

export const getJobApplications = async (req, res) => {
  const { id: jobId } = req.params;
  const user = req.user;

  if (!jobId) {
    return res.status(400).json({
      message: "Job Id is Required",
    });
  }

  try {
    const applications = await Applications.find({ job: jobId }).lean();

    const job = await Job.findById(jobId);

    const isCurrentEmployer = job.employer.toString() === user._id.toString();

    if (!isCurrentEmployer) {
      return res.status(401).json({
        message: "This Job Listing Is Not By You",
      });
    }

    return res.status(200).json({
      message: "Fetched All Job Applications Sucessfully",
      applications,
    });
  } catch (error) {
    console.log("error in job controller in get job applications" + error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "open" });

    const employerIds = jobs.map((job) => job.employer);

    const employers = await User.find({ _id: { $in: employerIds } });

    const employerMap = {};

    employers.forEach((employer) => {
      employerMap[employer._id.toString()] =
        employer.profile?.name || "Unknown";
    });

    const jobsWithEmployerNames = jobs.map((job) => ({
      ...job.toObject(),
      employerName: employerMap[job.employer.toString()] || "Unknown",
    }));

    return res.status(200).json({
      message: "Fetched All Jobs Sucessfully",
      jobs: jobsWithEmployerNames,
    });
  } catch (error) {
    console.log("Error in job controller at getJobs" + error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const saveJob = async (req, res) => {
  const jobId = req.params.jobId;
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      message: "Unauthorised Please login again",
    });
  }

  if (!jobId) {
    return res.status(400).json({
      message: "jobId are required",
    });
  }

  try {
    const existingJob = await savedJobsModel.findOne({
      jobId,
      freelancer: user._id,
    });

    if (existingJob) {
      await savedJobsModel.deleteOne({ jobId: jobId });
      return res.status(200).json({ message: "Job removed from saved jobs." });
    }

    const getJob = await Job.findById(jobId);

    if (!getJob) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const jobTitle = getJob.title;
    const jobDescription = getJob.description;

    const savedJobs = await savedJobsModel.create({
      jobId: jobId,
      jobTitle: jobTitle,
      jobDescription: jobDescription,
      freelancer: user,
    });

    savedJobs.save();

    return res.status(200).json({
      message: "Job saved",
      savedJobs,
    });
  } catch (error) {
    console.log("error in job controller at saveJob" + error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const acceptApplication = async (req, res) => {
  const { jobId, applicationId } = req.params;
  const user = req.user;

  try {
    const job = await Job.findOne({ _id: jobId, employer: user._id });

    if (!job) {
      return res.status(404).json({
        message: "Job Not Found",
      });
    }

    if (job.status !== "open") {
      return res.status(400).json({
        message: "You cannot accept a application for a job that is not open",
      });
    }

    const application = await Applications.findOne({
      _id: applicationId,
      job: jobId,
    });

    if (!application) {
      return res.status(404).json({
        message: "No Application Found",
      });
    }

    application.status = "accepted";

    await application.save();

    await Applications.updateMany(
      { job: jobId, _id: { $ne: applicationId } },
      { status: "rejected" }
    );

    job.status = "in progress";

    await job.save();

    const currJob = new CurrentJob({
      jobId: jobId,
      freelancer: application.freelancer,
      jobTitle: job.title,
      jobDescription: job.description,
      employer: job.employer,
      payCheck: application.bidAmount,
    });

    currJob.save();

    return res.status(200).json({
      message: "Application Accepted Sucessfully",
      application,
    });
  } catch (error) {
    console.log("error in job controller at accept Application", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const cancelAcceptedApplication = async (req, res) => {
  const { jobId, applicationId } = req.params;
  const user = req.user;

  try {
    const job = await Job.findOne({ _id: jobId, employer: user._id });

    if (!job) {
      return res.status(404).json({
        message: "Job Not Found",
      });
    }

    const application = Applications.findOne({
      _id: applicationId,
      job: jobId,
    });

    if (!application || application.status !== "accepted") {
      return res.status(404).json({
        message: "This Application Was Not Accepted",
      });
    }

    application.status = "pending";
    await application.save();

    job.status = "open";
    await job.save();

    await Applications.updateMany(
      {
        job: jobId,
        status: "rejected",
      },
      {
        status: "pending",
      }
    );

    await CurrentJob.deleteOne({
      userId: user._id,
      jobId: jobId,
    });

    return res.status(200).json({
      message: "Accepted Application Cancelled",
    });
  } catch (error) {
    console.log(
      "Error in job controller in cancel accepted application" + error
    );
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const jobFinished = async (req, res) => {
  const user = req.user;
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId);

    if (user._id !== job._id) {
      return res.status(400).json({
        message: "You are not the owner of this job",
      });
    }

    if (!job) {
      return res.status(404).json({
        message: "Job Not Found",
      });
    }

    const currentJob = await CurrentJob.findOne({ jobId: jobId });

    if (!currentJob) {
      return res.status(400).json({
        message: "This Job Was Not Accepted By Anybody",
      });
    }

    if (job.status !== "completed") {
      return res.status(400).json({
        message: "Job Must Be Marked Completed First",
      });
    }

    await Applications.findOneAndDelete({
      job: jobId,
    });

    const finJob = await FinishedJob.findOne({
      jobId: job._id,
      freelancer: currJob.freelancer,
    });

    if (finJob) {
      return res.status(400).json({
        message: "The Job Was Marked Finished Already",
      });
    }

    const finishedJob = new FinishedJob({
      jobTitle: job.title,
      jobDescription: job.description,
      jobId: job._id,
      freelancer: currJob.freelancer,
    });

    await finishedJob.save();

    await currentJob.deleteOne({ _id: currentJob._id });

    return res.status(201).json({
      message: "Job Marked Finished Sucessfully",
      finishedJob,
    });
  } catch (error) {
    console.log("Error in job controller at job finished controller" + error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getOnGoingJob = async (req, res) => {
  const user = req.user;

  try {
    const jobs = await CurrentJob.find({
      employer: user._id,
    });

    if (!jobs) {
      return res.status(200).json({
        message: "You Dont have On Going Jobs",
      });
    }

    return res.status(200).json({
      message: "Fetched current jobs",
      jobs,
    });
  } catch (error) {
    console.log("Error In Job Controller at get on going job" + error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getCreatedJob = async (req, res) => {
  const user = req.user;

  try {
    const jobs = await Job.find({
      status: "open",
      employer: user._id,
    });

    if (jobs.length === 0) {
      return res.status(200).json({
        message: "You didnt create any job yet",
      });
    }

    return res.status(201).json({
      message: "Fetched all jobs sucessfully",
      jobs,
    });
  } catch (error) {
    console.log("Error in job controlller at get created jobs" + error);
    return res.status(400).json({
      message: "Internal server error",
    });
  }
};

export const deletJob = async (req,res) => {
    const user = req.user;
    const { jobId } = req.params;

    if(!jobId) {
      return res.status(400).json({
        message: "Job Id is missing",
      })
    }

    try {
      const job = await Job.findById(jobId);

      if(!job) {
        return res.status(404).json({
          message: "Job Not Found",
        })
      }

      if(!job.employer.equals(user._id)) {
        return res.status(400).json({
          message: "You Are Not Authorized To Delete This Job",
        })
      }

      await job.deleteOne();

      return res.status(200).json({
        message: "Job Deleted",
      })
    } catch (error) {
      console.log("Error in job controller in delete job" + error);
      return res.status(500).json({
        message: "Internal server error",
      })
    }
}
