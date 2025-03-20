import mongoose from "mongoose";
const schema = mongoose.Schema;

const jobSchema = schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    budget: {type: String, required: true},
    skillsRequired: {type: [String], required: true},
    createdAt: {type: Date, default: Date.now},
    employer: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    status: {
        type: String,
        enum: ['open', 'in progress', 'completed', 'cancelled'],
        default: 'open'
    }
})

export default mongoose.model('Job', jobSchema);