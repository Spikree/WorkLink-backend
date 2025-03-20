import mongoose from "mongoose";

const schema = mongoose.Schema;

const ratingSchema = schema({
  reviewer: {type: mongoose.Schema.Types.ObjectId, ref : "User", required: true},
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewOf: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  review: {type: String, required: true},
});

export default mongoose.model("Rating", ratingSchema);