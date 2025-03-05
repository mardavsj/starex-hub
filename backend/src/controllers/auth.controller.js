import crypto from "crypto";
import User from "../models/user.model.js"
import Enrollment from "../models/enrollment.model.js";
import OTP from "../models/otp.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import nodemailer from "nodemailer";
import sendEmail from "../lib/sendEmail.js";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOtp = async (req, res) => {
    const { enrollmentNo, email } = req.body;

    try {
        if (!enrollmentNo || !email) {
            return res.status(400).json({ message: "Enrollment Number & Email are required" });
        }

        const enrollmentData = await Enrollment.findOne({ enrollmentNo });
        if (!enrollmentData) {
            return res.status(400).json({ message: "Invalid Enrollment Number" });
        }


        const otpCode = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000;

        await OTP.deleteOne({ email });
        await OTP.create({ email, otp: otpCode, expiresAt: otpExpiry });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP for Account Verification",
            text: `Your OTP is ${otpCode}. It will expire in 10 minutes.`,
        });

        res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        console.error("Error in sending OTP:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const signup = async (req, res) => {
    const { enrollmentNo, email, password, otp } = req.body;

    try {
        if (!enrollmentNo || !email || !password || !otp) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Step 1: Check OTP Exists & Not Expired
        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord) {
            return res.status(400).json({ message: "OTP not found, please request a new one." });
        }

        // Compare OTP (Stored OTP is hashed)
        const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
        if (!isOtpValid || otpRecord.expiresAt < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Step 2: Check if User Already Exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Step 3: Validate Enrollment Number
        const enrollmentData = await Enrollment.findOne({ enrollmentNo });
        if (!enrollmentData) {
            return res.status(400).json({ message: "Invalid Enrollment Number" });
        }

        // Step 4: Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Step 5: Create User
        const newUser = new User({
            enrollmentNo,
            fullName: enrollmentData.fullName,
            email,
            password: hashedPassword,
        });

        // Step 6: Save User & Generate Token
        await newUser.save();
        generateToken(newUser._id, res);

        // Step 7: Delete OTP Record After Successful Signup
        await OTP.deleteOne({ email });

        // Step 8: Send Response
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });

    } catch (error) {
        console.error("Error in signup controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;

        await user.save();

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        const message = `
            <h1>Password Reset Request</h1>
            <p>Please click on the following link to reset your password:</p>
            <a href="${resetUrl}" target="_blank">Reset Password</a>
        `;

        await sendEmail(user.email, "Password Reset Request", message);

        res.status(200).json({ message: "Password reset link sent to email." });
    } catch (error) {
        console.log("Error in forgotPassword controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {

        console.log("Received token:", token)

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        console.log("User found:", user)

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.log("Error in resetPassword controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log("Attempting to delete user with ID:", userId);

        if (!userId) {
            return res.status(400).json({ message: "User ID is missing" });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.clearCookie("jwt");
        res.status(200).json({ message: "Your account has been permanently deleted." });

    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({ message: "Failed to delete account. Please try again later." });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};