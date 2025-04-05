import express from "express";
import {
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    checkAuth,
    sendOtp,
    deleteAccount
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { updateSingleImage } from "../middleware/update.middleware.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.put("/update-profile", protectRoute, updateSingleImage, updateProfile);
router.post("/delete-account", protectRoute, deleteAccount);
router.get("/check", protectRoute, checkAuth);

export default router;