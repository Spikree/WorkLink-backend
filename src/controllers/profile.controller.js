import User from "../models/user.model.js";
import Rating from "../models/rating.model.js";
import Job from "../models/job.model.js";

export const getUser = async (req, res) => {
  const  user  = req.user;

  try {
    const userDetails = await User.findById(user._id).select("-password").lean();

    if (!userDetails) {
      return res.status(404).json({
        message: "No User Found",
      });
    }

    const ratings = await Rating.find({
      reviewOf: userDetails._id,
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

    return res.status(200).json({
        message: "Fetch User Details Sucessfully",
        userDetails,
        ratingStats: {
            averageRating: parseFloat(averageRating),
            totalRatings
        }
    })
  } catch (error) {
    console.log("Error in profile controller in get user" + error);
    return res.status(500).json({
        message: "Internal Server Error"
    })
  }
};

export const editUser = async (req,res) => {
    const user = req.user;
    const {name,bio,skills,portfolio} = req.body;

    try {
        const isUser = await User.findById(user._id);

        if(!isUser) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        if (name !== undefined) isUser.profile.name = name;
        if (bio !== undefined) isUser.profile.bio = bio;
        if (skills !== undefined) isUser.profile.skills = skills;
        if (portfolio !== undefined) isUser.profile.portfolio = portfolio;

        const updatedUser = await isUser.save();
        
        return res.status(200).json({
            message: "Profile Updated Sucessfully",
            updatedUser
        });

    } catch (error) {
        console.log("error in profile controller in edit user");
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const   getUserProfile = async (req,res) => {
    const {userId} = req.params;

    try {
        const userDetails = await User.findById(userId);

        if(!userDetails) {
            return res.stale(404).json({
                message: "User Not Fouund"
            });
        }

        const ratings = await  Rating.find({
            reviewOf: userDetails._id,
        });

        const totalRatings = ratings.length;

        let averageRating = 0;

        if (totalRatings > 0) {
            const sumOfRatings = ratings.reduce(
                (sum, rating) => sum + rating.rating,
                0
            );
            averageRating = (sumOfRatings / totalRatings).toFixed(1); // Rounds to 1 decimal place
        }

        return res.status(200).json({
            message: "Fteched user details sucessfully",
            userDetails,
            ratingStats: {
                averageRating: parseFloat(averageRating),
                totalRatings,
            },
        });
    } catch (error) {
        console.log("Error in profile controller in get user profile" + error);
        return res.status(500).json(
        );
    }
}

export const getEmployer = async (req,res) => {
    const jobId = req.params.id;

    try {
        const employer = await Job.findById(jobId).populate('employer');

        return res.status(200).json({
            message: "Employer found",
            employer
        });
    } catch (error) {
        console.log("error in get Employer Route", error.message)
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getUserById = async (req,res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);

        return res.status(200).json({
            message: "User found",
            user
        });
    } catch (error) {
        console.log("error in get get user Route", error.message)
        return res.status(500).json({ message: "Internal server error" });
    }
}
