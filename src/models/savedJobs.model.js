import mongoose from "mongoose";
const schema = mongoose.Schema;

const savedJobSchema = schema({
    jobTitle: {type: String, required: true},
    jobDescription: {type: String, required: true},
    jobId: {type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true},
    freelancer: {type: mongoose.Schema.Types.ObjectId, ref : 'User', required: true}
})

export default mongoose.model('savedJobs', savedJobSchema);