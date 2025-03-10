import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
    enrollmentNo: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["student", "faculty"]
    }
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment;
