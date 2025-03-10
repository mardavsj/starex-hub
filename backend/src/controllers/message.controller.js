import User from "../models/user.model.js";
import Enrollment from "../models/enrollment.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Fetch all users except logged-in user
        const users = await User.find({ _id: { $ne: loggedInUserId } })
            .select("fullName profilePic enrollmentNo"); // Include enrollmentNo to match Enrollment

        // Fetch corresponding enrollment records
        const enrollmentNos = users.map(user => user.enrollmentNo);
        const enrollments = await Enrollment.find({ enrollmentNo: { $in: enrollmentNos } });

        // Create a map of enrollmentNo -> role
        const roleMap = new Map();
        enrollments.forEach(enrollment => {
            roleMap.set(enrollment.enrollmentNo, enrollment.role);
        });

        // Attach role to each user
        const usersWithRoles = users.map(user => ({
            ...user.toObject(),
            role: roleMap.get(user.enrollmentNo) || "Unknown", // Default to "Unknown" if no role found
        }));

        res.status(200).json(usersWithRoles);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({ senderId, receiverId, text, image: imageUrl });
        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) io.to(receiverSocketId).emit("newMessage", newMessage);

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user?._id;

        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const message = await Message.findOneAndDelete({ _id: messageId, senderId: userId });

        if (!message) return res.status(404).json({ error: "Message not found or unauthorized" });

        io.emit("messageDeleted", messageId);
        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const editMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { text } = req.body;
        const userId = req.user._id;

        const message = await Message.findOneAndUpdate(
            { _id: messageId, senderId: userId },
            { text },
            { new: true }
        );

        if (!message) return res.status(404).json({ error: "Message not found or unauthorized" });

        io.emit("messageEdited", message);
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getChatHistory = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find messages where the user is sender or receiver
        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        }).sort({ createdAt: -1 });

        // Extract unique user IDs
        const uniqueUserIds = [...new Set(messages.flatMap(msg => [msg.senderId.toString(), msg.receiverId.toString()]))];

        // Exclude the logged-in user
        const filteredUserIds = uniqueUserIds.filter(id => id !== userId.toString());

        // Fetch user details
        const users = await User.find({ _id: { $in: filteredUserIds } })
            .select("_id fullName profilePic enrollmentNo");

        // Fetch corresponding enrollment records
        const enrollmentNos = users.map(user => user.enrollmentNo);
        const enrollments = await Enrollment.find({ enrollmentNo: { $in: enrollmentNos } });

        // Create a role mapping
        const roleMap = new Map();
        enrollments.forEach(enrollment => {
            roleMap.set(enrollment.enrollmentNo, enrollment.role);
        });

        // Attach roles to users
        const usersWithRoles = users.map(user => ({
            ...user.toObject(),
            role: roleMap.get(user.enrollmentNo) || "Unknown",
        }));

        res.json(usersWithRoles);
    } catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({ message: "Failed to fetch chat history" });
    }
};