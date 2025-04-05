import { useState } from "react";
import { X, GraduationCap, BriefcaseBusiness } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser, setIsSidebarOpen } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const [isImageOpen, setIsImageOpen] = useState(false);

    const getRoleIconWithText = (role) => {
        if (role === "student") {
            return (
                <span className="flex items-center gap-1 text-sm text-primary font-semibold">
                    <GraduationCap className="size-5" /> Student
                </span>
            );
        }
        if (role === "faculty") {
            return (
                <span className="flex items-center gap-1 text-sm text-primary font-semibold">
                    <BriefcaseBusiness className="size-4" /> Faculty
                </span>
            );
        }
        return null;
    };

    return (
        <>
            <div className="md:p-2.5 p-1.5 border-b border-base-300 sticky z-10 bg-primary/15">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="avatar cursor-pointer hover:scale-105 transition-transform" onClick={() => setIsImageOpen(true)}>
                            <div className="size-10 rounded-full relative">
                                <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-medium">{selectedUser.fullName}</h3>
                                {getRoleIconWithText(selectedUser.role)}
                            </div>

                            <p className="text-sm text-base-content/70">
                                {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setSelectedUser(null);
                            setIsSidebarOpen(true);
                        }}
                        className="px-2"
                    >
                        <X />
                    </button>
                </div>
            </div>
            {
                isImageOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                        onClick={() => setIsImageOpen(false)}
                    >
                        <img
                            src={selectedUser.profilePic || "/avatar.png"}
                            alt="Full Profile"
                            className="md:size-96 size-60 object-cover rounded-xl border border-base-content/30 bg-black"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )
            }
        </>
    );
};

export default ChatHeader;