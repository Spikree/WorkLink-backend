import Rating from "../models/rating.model.js";

export const postReview = async (req, res) => {
  const user = req.user;
  const { rating, review } = req.body;
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      message: "userId is missing",
    });
  }

  if (!rating || !review) {
    return res.status(400).json({
      message: "Please Provide A Rating And A Review",
    });
  }

  try {
    const isRating = await Rating.findOne({
      reviewer: user._id,
      reviewOf: userId,
    });

    if (isRating) {
      return res.status(400).json({
        message: "You already reviewed this user",
      });
    }

    const userRating = await Rating.create({
      reviewer: user._id,
      rating: rating,
      reviewOf: userId,
      review: review,
    });

    userRating.save();

    return res.status(200).json({
      message: "Review Added Successfully",
      userRating,
    });
  } catch (error) {
    console.log("error in review controller at post review", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getReview = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      message: "user id is not provided",
    });
  }

  try {
    const reviews = await Rating.find({
      reviewOf: userId,
    }).populate({
      path: "reviewer",
      select: "profile.name",
    });

    if (reviews.length === 0) {
      return res.status(200).json({
        message: "no reviews on this user yet",
      });
    }

    return res.status(200).json({
      message: "Reviews fetched sucessfully",
      reviews,
    });
  } catch (error) {
    console.log("Error in review controller at get review", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteReview = async (req, res) => {
  const user = req.user;
  const { reviewId } = req.params;

  try {
    const review = await Rating.findOneAndDelete({
      reviewer: user._id,
      _id: reviewId,
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found or you are not authorized to delete it",
      });
    }

    return res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const editReview = async (req, res) => {
  const { reviewId } = req.params;
  const user = req.user;
  const { newRating, NewReview } = req.body;

  if (!reviewId || !user) {
    return res.status(400).json({
      message: "Provide reviewId and user",
    });
  }

  if (!newRating && !NewReview) {
    return res.status(400).json({
      message: "Provide At Least One Field To Update (rating or review)",
    });
  }

  try {
    const review = await Rating.findOne({
      _id: reviewId,
      reviewer: user._id,
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (newRating) {
      review.rating = newRating;
    }

    if (NewReview) {
      review.review = NewReview;
    }

    await review.save();

    return res.status(200).json({
      message: "Review updated successfully",
      updatedReview: review,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const hasReviewed = async (req, res) => {
  const user = req.user;
  const { userId } = req.params;

  try {
    const hasReviewed = await Rating.findOne({
      reviewer: user._id,
      reviewOf: userId,
    }).populate({
      path: "reviewer",
      select: "profile.name",
    });

    if (!hasReviewed) {
      return res.status(400).json({
        message: "You haven't posted a review yet",
        userReview: false,
        hasReviewed,
      });
    }

    return res.status(200).json({
      message: "User review found",
      userReview: true,
      hasReviewed,
    });
  } catch (error) {
    console.log("error in review controller at has reviewed route", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
