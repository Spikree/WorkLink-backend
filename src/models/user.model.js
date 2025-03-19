import mongoose from "mongoose";
const schema = mongoose.Schema;

const userSchema = schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["freelancer", "employer"],
    message: "Role must be either freelancer or employer",
  },
  profile: {
    name: String,
    bio: String,
    skills: [String],
    portfolio: String,
    rating: { type: Number, default: 0 },
  },
  createdOn: { type: Date, default: new Date().getTime() },
});

export default mongoose.model("User", userSchema);