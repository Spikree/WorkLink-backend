import User from "../models/user.model.js";
import Rating from "../models/rating.model.js";
import Job from "../models/job.model.js";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs";

export const getUser = async (req, res) => {
  const user = req.user;

  try {
    const userDetail = await User.findById(user._id).select("-password").lean();

    if (!userDetail) {
      return res.status(404).json({
        message: "No User Found",
      });
    }

    const ratings = await Rating.find({
      reviewOf: userDetail._id,
    });

    const totalRatings = ratings.length;

    let averageRating = 0;

    if (totalRatings > 0) {
      const sumOfRatings = ratings.reduce(
        (sum, rating) => sum + rating.rating,
        0
      );
      averageRating = (sumOfRatings / totalRatings).toFixed(1);
    }

    const userDetails = {
      ...userDetail,
      averageRating,
      totalRatings,
    };

    return res.status(200).json({
      message: "Fetch User Details Sucessfully",
      userDetails,
    });
  } catch (error) {
    console.log("Error in profile controller in get user" + error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const editUser = async (req, res) => {
  const user = req.user;
  const { name, bio, skills, portfolio } = req.body;

  try {
    const isUser = await User.findById(user._id);

    if (!isUser) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    if (name !== undefined) isUser.profile.name = name;
    if (bio !== undefined) isUser.profile.bio = bio;
    if (skills !== undefined) isUser.profile.skills = skills;
    if (portfolio !== undefined) isUser.profile.portfolio = portfolio;

    const updatedUser = await isUser.save();

    return res.status(200).json({
      message: "Profile Updated Sucessfully",
      updatedUser,
    });
  } catch (error) {
    console.log("error in profile controller in edit user");
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const userDetails = await User.findById(userId).select("-password");

    if (!userDetails) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    const ratings = await Rating.find({ reviewOf: userDetails._id });
    const totalRatings = ratings.length;

    let averageRating = 0;

    if (totalRatings > 0) {
      const sumOfRatings = ratings.reduce(
        (sum, rating) => sum + rating.rating,
        0
      );
      averageRating = (sumOfRatings / totalRatings).toFixed(1);
    }

    const userData = userDetails.toObject();
    userData.averageRating = averageRating;
    userData.totalRatings = totalRatings;

    return res.status(200).json({
      message: "Fetched user details successfully",
      userDetails: userData,
    });
  } catch (error) {
    console.log("Error in profile controller in get user profile: " + error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getEmployer = async (req, res) => {
  const jobId = req.params.id;

  try {
    const employer = await Job.findById(jobId).populate("employer");

    return res.status(200).json({
      message: "Employer found",
      employer,
    });
  } catch (error) {
    console.log("error in get Employer Route", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    return res.status(200).json({
      message: "User found",
      user,
    });
  } catch (error) {
    console.log("error in get get user Route", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const user = req.user;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const isUser = await User.findById(user._id);

    if (!isUser) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    const fileLink = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile-pictures",
    });

    fs.unlinkSync(req.file.path);

    if (isUser.profile.profilePicture) {
      const publicId = isUser.profile.profilePicture
        .split("/")
        .pop()
        .split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    isUser.profile.profilePicture = fileLink.secure_url;
    await isUser.save();

    res.status(200).json({
      message: "Profile Picture Uploaded Sucessfully",
    });
  } catch (error) {
    console.log("error in upload profile picture", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
