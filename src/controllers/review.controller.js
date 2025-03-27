import Rating from "../models/rating.model.js";

export const postReview = async (req,res) => {
    const user = req.user;
    const {rating,review} = req.body;
    const {userId} = req.params;

    if(!userId) {
        return res.status(400).json({
            message: "userId is missing"
        })
    }

    if(!rating || !review) {
        return res.status(400).json({
            message: "Please Provide A Rating And A Review"
        })
    }

    try {
        const userRating = await Rating.create({
            reviewer: user._id,
            rating: rating,
            reviewOf: userId,
            review:review,
        })

        userRating.save();

        return res.status(200).json({
            message: "Review Added Successfully",
            userRating
        })
    } catch (error) {
        console.log("error in review controller at post review" , error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}