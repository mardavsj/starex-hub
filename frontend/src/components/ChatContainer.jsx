import { useEffect, useRef, useState } from "react";
import { Trash2, Loader, Edit2, Check, X, ChevronDown } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage,
    editMessage,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [loadingMessages, setLoadingMessages] = useState({});
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");
  const [openOptions, setOpenOptions] = useState({});

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleDeleteMessage = async (messageId) => {
    setLoadingMessages((prev) => ({ ...prev, [messageId]: true }));

    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }

    setLoadingMessages((prev) => ({ ...prev, [messageId]: false }));
  };

  const handleEditMessage = (message) => {
    setEditingMessage(message._id);
    setEditText(message.text);
  };

  const handleSaveEdit = async (messageId) => {
    if (!editText.trim()) return;

    try {
      await editMessage(messageId, editText);
      setEditingMessage(null);
    } catch (error) {
      console.error("Failed to edit message:", error);
    }
  };

  const toggleOptions = (messageId) => {
    setOpenOptions((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      {isMessagesLoading ? (
        <MessageSkeleton />
      ) : (
        <div className="flex-1 overflow-y-auto md:p-4 p-2 md:space-y-3 space-y-1">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`chat group ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              <div className="chat-image hidden lg:block avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>

              <div
                className={`chat-bubble p-2 md:gap-4 gap-1 rounded-lg max-w-[80%] flex flex-col items-start relative 
                  ${message.senderId === authUser._id ? "bg-primary text-primary-content" : "bg-base-200 text-base-content"}
                `}
              >
                {message.image && (
                  <div className="grid">
                    <img src={message.image} alt="Attachment" className="sm:max-w-[200px] rounded-md" />
                  </div>
                )}

                <div className="flex items-center gap-2 relative w-full">
                  {editingMessage === message._id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-2 py-1 rounded-md focus:outline-none bg-white/30"
                      autoFocus
                    />
                  ) : (
                    <p>{message.text}</p>
                  )}

                  <time className="md:text-[11px] text-[9px] opacity-50 whitespace-nowrap justify-self-end self-end">
                    {formatMessageTime(message.createdAt)}
                  </time>

                  {message.senderId === authUser._id && (
                    <div className="relative">
                      <button
                        onClick={() => toggleOptions(message._id)}
                        className="text-base-content"
                      >
                        <ChevronDown size={18}/>
                      </button>

                      {openOptions[message._id] && (
                        <div className="absolute top-10 right-0 bg-base-200 rounded-lg shadow-md p-2 grid sm:flex-row space-x-0 md:space-x-2 sm:w-60 w-44 z-10">
                          {editingMessage === message._id ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(message._id)}
                                className="text-green-600 flex items-center space-x-2 hover:bg-green-500/15 rounded-lg p-2"
                              >
                                <Check size={18} />
                                <span className="inline">Save</span>
                              </button>
                              <button
                                onClick={() => setEditingMessage(null)}
                                className="text-base-content flex items-center space-x-2 hover:bg-primary/25 rounded-lg p-2"
                              >
                                <X size={18} />
                                <span className="inline">Cancel</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditMessage(message)}
                                className="flex text-base-content items-center space-x-2 hover:bg-primary/25 rounded-lg p-2"
                              >
                                <Edit2 size={18} />
                                <span className="inline text-start">Edit message</span>
                              </button>

                              <button
                                onClick={() => handleDeleteMessage(message._id)}
                                className="text-red-500 flex items-center space-x-2 hover:bg-red-500/15 rounded-lg p-2"
                                disabled={loadingMessages[message._id]}
                              >
                                {loadingMessages[message._id] ? (
                                  <Loader size={18} className="animate-spin" />
                                ) : (
                                  <Trash2 size={18} />
                                )}
                                <span className="inline text-start">Delete message</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
