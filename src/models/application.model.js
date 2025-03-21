import mongoose from "mongoose";
const schema = mongoose.Schema;

const applicationSchema = schema({
    job: {type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true},
    freelancer: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    bidAmount: {type: String, required: true},
    coverLetter: {type: String},
    submittedAt: {type: Date, default: Date.now},
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
})

export default mongoose.model('Application', applicationSchema);