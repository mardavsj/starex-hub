import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        enrollmentNo: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        fullName: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        profilePic: {
            type: String,
            default: ""
        },
        role: {
            type: String,
            enum: ["student", "faculty"],
            default: ""
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;