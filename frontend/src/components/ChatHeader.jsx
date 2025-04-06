import { useState } from "react";
import { X, GraduationCap, BriefcaseBusiness } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ConfirmationModal from "./ConfirmationModal";
import { GiBroom } from "react-icons/gi";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser, setIsSidebarOpen, clearMessagesForUser } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const [isImageOpen, setIsImageOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const getRoleIconWithText = (role) => {
        if (role === "student") {
            return (
                <span className="flex items-center md:gap-1 gap-0.5 md:text-sm text-[12px] text-primary font-semibold">
                    <GraduationCap className="md:size-5 size-3" /> Student
                </span>
            );
        }
        if (role === "faculty") {
            return (
                <span className="flex items-center md:gap-1 gap-0.5 md:text-sm text-[12px] text-primary font-semibold">
                    <BriefcaseBusiness className="size-4" /> Faculty
                </span>
            );
        }
        return null;
    };

    const handleClearChat = () => {
        setIsConfirmModalOpen(true);
    };

    const confirmClearChat = () => {
        clearMessagesForUser();
        setIsConfirmModalOpen(false);
    };

    return (
        <>
            <div className="md:p-2.5 p-1.5 border-b border-base-300 sticky z-10 bg-primary/15">
                <div className="flex items-center justify-between">
                    <div className="flex items-center md:gap-3 gap-1.5">
                        <div className="avatar cursor-pointer hover:scale-105 transition-transform" onClick={() => setIsImageOpen(true)}>
                            <div className="md:size-10 size-8 rounded-full relative">
                                <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center md:gap-2 gap-1">
                                <h3 className="font-semibold text-sm md:text-base lg:text-md">{selectedUser.fullName}</h3>
                                {getRoleIconWithText(selectedUser.role)}
                            </div>

                            <p className="md:text-sm text-xs text-base-content/70">
                                {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex flex-col items-center justify-center">
                            <button
                                onClick={handleClearChat}
                                className="flex items-center md:gap-1.5 gap-0.5 md:text-sm text-xs py-1 md:px-2 px-1 font-semibold rounded-lg text-red-500 bg-red-500/20 hover:bg-red-500/30 border border-transparent hover:border-red-500"
                            >
                                <span><GiBroom /></span>
                                <span className="md:hidden block">Clear</span>
                                <span className="hidden md:block">Clear Chat</span>
                            </button>
                            <p className="hidden md:block text-xs text-base-content/80 mt-0.5 text-center">Clear chat regularly to keep things running smooth.</p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedUser(null);
                                setIsSidebarOpen(true);
                            }}
                            className="md:px-10 px-0"
                        >
                            <X className="md:size-6 size-5 md:ml-0 ml-2"/>
                        </button>
                    </div>
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
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onConfirm={confirmClearChat}
                onCancel={() => setIsConfirmModalOpen(false)}
                message={`If you and ${selectedUser.fullName} both clear this chat, all messages will be permanently deleted from the system.`}
            />
        </>
    );
};

export default ChatHeader;