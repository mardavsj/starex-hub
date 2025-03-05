import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

otpSchema.pre("save", async function (next) {
    if (!this.isModified("otp")) return next();

    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, salt);
    next();
});

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
