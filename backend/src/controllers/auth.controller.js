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

        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord) {
            return res.status(400).json({ message: "OTP not found, please request a new one." });
        }

        const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
        if (!isOtpValid || otpRecord.expiresAt < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const enrollmentData = await Enrollment.findOne({ enrollmentNo });
        if (!enrollmentData) {
            return res.status(400).json({ message: "Invalid Enrollment Number" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            enrollmentNo,
            fullName: enrollmentData.fullName,
            email,
            password: hashedPassword,
            role: enrollmentData.role
        });

        await newUser.save();
        generateToken(newUser._id, res);

        await OTP.deleteOne({ email });

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
            role: newUser.role
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

        await User.findByIdAndUpdate(
            user._id,
            {
                resetPasswordToken: resetToken,
                resetPasswordExpires: Date.now() + 3600000
            },
            { new: true, runValidators: false }
        );

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
        console.log("Received token:", token);

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        console.log("User found:", user);

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.updateOne({ password: user.password, resetPasswordToken: undefined, resetPasswordExpires: undefined });

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.log("Error in resetPassword controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const file = req.file;
        const { removePic } = req.body;

        let updateData = {};

        if (removePic === "true") {
            updateData.profilePic = null;
        }

        if (file) {
            const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

            const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                folder: "avatars",
            });

            updateData.profilePic = uploadResponse.secure_url;
        }

        if (!file && removePic !== "true") {
            return res.status(400).json({ message: "No update provided" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in updateProfile:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteAccount = async (req, res) => {
    const { password } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "Account deleted successfully" });

    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({ message: "Error deleting account" });
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