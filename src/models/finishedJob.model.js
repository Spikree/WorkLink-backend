import mongoose from "mongoose";
const schema = mongoose.Schema

const finishedJobSchema = schema({
    jobTitle: {type: String, required: true},
    jobDescription: {type: String, required: true},
    jobId: {type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true},
    freelancer: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt: {type: Date, default: Date.now},
})

export default mongoose.model("FinishedJob", finishedJobSchema);