import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    getMessages,
    getUsersForSidebar,
    sendMessage,
    deleteMessage,
    editMessage,
    getChatHistory,
    markMessagesAsSeen,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/chats", protectRoute, getChatHistory);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.delete("/delete/:messageId", protectRoute, deleteMessage);
router.put("/edit/:messageId", protectRoute, editMessage);
router.put("/mark-seen", protectRoute, markMessagesAsSeen);

export default router;
