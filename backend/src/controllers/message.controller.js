import User from "../models/user.model.js";
import Enrollment from "../models/enrollment.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const users = await User.find({ _id: { $ne: loggedInUserId } })
            .select("fullName profilePic enrollmentNo");

        const enrollmentNos = users.map(user => user.enrollmentNo);
        const enrollments = await Enrollment.find({ enrollmentNo: { $in: enrollmentNos } });

        const roleMap = new Map();
        enrollments.forEach(enrollment => {
            roleMap.set(enrollment.enrollmentNo, enrollment.role);
        });

        const usersWithRoles = users.map(user => ({
            ...user.toObject(),
            role: roleMap.get(user.enrollmentNo) || "Unknown",
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

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
            status: "sent",
        });
        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) io.to(receiverSocketId).emit("newMessage", newMessage);

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const markMessagesAsSeen = async (req, res) => {
    try {
        const { messageIds } = req.body;

        if (!messageIds || messageIds.length === 0) {
            return res.status(400).json({ message: "No messages provided for updating." });
        }

        console.log(`🔹 Marking messages as seen: ${messageIds}`);

        const messages = await Message.updateMany(
            { _id: { $in: messageIds }, status: { $ne: "seen" } },
            { $set: { status: "seen", updatedAt: new Date() } }
        );

        console.log(`🔹 Modified Count: ${messages.modifiedCount}`);

        if (messages.modifiedCount === 0) {
            console.log("⚠️ No messages were updated.");
            return res.status(200).json({ message: "No new messages to update" });
        }

        res.status(200).json({ message: "Messages marked as seen" });

    } catch (error) {
        console.error("❌ Error updating message status: ", error);
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

        io.emit("messageEdited", {
            messageId: message._id,
            newText: message.text 
        });

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getChatHistory = async (req, res) => {
    try {
        const userId = req.user._id;

        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        }).sort({ createdAt: -1 });

        const uniqueUserIds = [...new Set(messages.flatMap(msg => [msg.senderId.toString(), msg.receiverId.toString()]))];

        const filteredUserIds = uniqueUserIds.filter(id => id !== userId.toString());

        const users = await User.find({ _id: { $in: filteredUserIds } })
            .select("_id fullName profilePic enrollmentNo");

        const enrollmentNos = users.map(user => user.enrollmentNo);
        const enrollments = await Enrollment.find({ enrollmentNo: { $in: enrollmentNos } });

        const roleMap = new Map();
        enrollments.forEach(enrollment => {
            roleMap.set(enrollment.enrollmentNo, enrollment.role);
        });

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