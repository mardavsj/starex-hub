import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Hash, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const ProfilePage = () => {
  useEffect(() => {
    document.title = "Personalize Your Avatar - Starex Hub Profile";
  }, []);

  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account permanently? This action cannot be undone."
    );

    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      await axios.delete("/api/auth/delete-account", {
        withCredentials: true,
      });

      toast.success("Account deleted successfully.");
      window.location.href = "/";
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account.");
    }

    setIsDeleting(false);
  };

  return (
    <div className="min-h-screen bg-primary/10">
      <div className="pt-16">
        <div className="max-w-2xl mx-auto p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-40 rounded-full object-cover"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-md text-primary font-bold flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-primary/25 rounded-lg border">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-md text-primary font-bold flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Enrollment Number
              </div>
              <p className="px-4 py-2.5 bg-primary/25 rounded-lg border">{authUser?.enrollmentNo || "N/A"}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-md text-primary font-bold flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-primary/25 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-16 p-10 bg-primary/25 text-center">
          <h2 className="text-lg font-medium">Account Information</h2>
          <hr className="sm:max-w-[25%] mx-auto border border-zinc-400 m-4" />
          <div className="text-sm">
            <div className="flex items-center justify-center gap-2">
              <span>Member Since:</span>
              <span>{authUser.createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span>Account Status:</span>
              <span className="text-green-500 font-bold">Active</span>
            </div>
          </div>
          <div className="text-center sm:max-w-[20%] mx-auto sm:mt-14 mt-10">
            <button
              onClick={handleDeleteAccount}
              className="btn btn-error w-full flex items-center justify-center gap-2"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Trash2 className="w-5 h-5 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  Delete Account Permanently
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
