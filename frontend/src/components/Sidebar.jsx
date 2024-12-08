import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Sidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, isSidebarOpen, setIsSidebarOpen } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const filteredUsers = showOnlineOnly ? users.filter(user => onlineUsers.includes(user._id)) : users;

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className={`h-full w-full lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 ${!isSidebarOpen ? "hidden" : ""}`}>
            <div className="md:grid flex border-b border-base-300 w-full md:p-5 p-2.5 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users className="md:size-6 size-4" />
                    <span className="font-medium md:text-base text-sm">All Contacts</span>
                </div>
                <div className="md:mt-3 mt-1.5 flex items-center md:gap-2 gap-1">
                    <label className="cursor-pointer flex items-center md:gap-2 gap-1">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="checkbox md:scale-90 scale-50"
                        />
                        <span className="md:text-sm text-[13px]">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
                </div>
            </div>

            <div className="overflow-y-auto w-full py-3">
                {filteredUsers.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => handleUserSelect(user)}
                        className={`
                            w-full p-3 flex items-center gap-3
                            hover:bg-base-300 transition-colors
                            ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                        `}
                    >
                        <div className="relative mx-auto lg:mx-0">
                            <img
                                src={user.profilePic || "/avatar.png"}
                                alt={user.name}
                                className="size-12 object-cover rounded-full"
                            />
                            {onlineUsers.includes(user._id) && (
                                <span
                                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                                    rounded-full ring-2 ring-zinc-900"
                                />
                            )}
                        </div>

                        <div className="flex-1 text-left min-w-0">
                            <div className="font-medium truncate">{user.fullName}</div>
                            <div className="text-sm text-zinc-400">
                                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="text-center text-zinc-500 py-4">No online Users</div>
                )}

                {users.length === 0 && (
                    <div className="text-center text-zinc-500 py-4">No online users</div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;

