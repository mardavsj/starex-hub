import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
    enrollmentNo: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    }
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment;
