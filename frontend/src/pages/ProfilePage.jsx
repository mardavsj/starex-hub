import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Hash, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  useEffect(() => {
    document.title = "Personalize Your Avatar - Starex Hub Profile";
  }, []);

  const { authUser, isUpdatingProfile, updateProfile, logout } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const navigate = useNavigate();

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

  const handleDeleteAccount = () => {
    setDeleteConfirmation(true);
  };

  const handleDeletePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsDeleting(true);

    try {
      const response = await axios.post(
        "/api/auth/delete-account",
        { password: deletePassword },
        { withCredentials: true }
      );

      toast.success(response.data.message);
      localStorage.removeItem("authToken");
      logout();

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting account");
    } finally {
      setIsDeleting(false);
    }
  };

  const profileImage = selectedImg || authUser.profilePic || "/avatar.png";

  return (
    <>
    <div className="min-h-screen bg-primary/10">
      <div className="pt-16">
        <div className="max-w-2xl mx-auto p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative cursor-pointer" onClick={() => setShowFullImage(true)}>
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-40 rounded-full object-cover border border-base-content/30 hover:scale-105 transition-transform"
              />
              <label
                htmlFor="avatar-upload"
                onClick={(e) => e.stopPropagation()}
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-110 p-2 rounded-full cursor-pointer transition-transform ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }`}
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
              <p className="px-4 py-2.5 bg-primary/25 rounded-lg border">{authUser?.fullName || "N/A"}</p>
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
              <p className="px-4 py-2.5 bg-primary/25 rounded-lg border">{authUser?.email || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="mt-28 text-center">
          <button
            onClick={handleDeleteAccount}
            className="btn btn-danger md:w-[25%] w-[90%] text-base bg-red-500/15 text-red-500 hover:border-red-500 hover:bg-red-500/20"
          >
            Delete Account Permanently
          </button>
        </div>

        {deleteConfirmation && (
          <div className="fixed inset-0 flex justify-center items-center bg-black/60">
            <div className="bg-base-200 p-10 rounded-lg shadow-xl max-w-md w-full relative border border-base-content/30">
              <p className="mt-2 text-center">Enter your password to confirm account deletion.</p>

              <form onSubmit={handleDeletePasswordSubmit} className="space-y-4 mt-6">
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input input-bordered w-full text-base py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-base-content/50"
                  required
                />
                <div className="flex gap-4 mt-4">
                  <button
                    type="submit"
                    className="btn btn-danger w-full py-2 px-4 text-base text-red-500 font-medium bg-red-500/15 rounded-lg hover:bg-red-500/20 border hover:border-red-500"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Confirm Delete"}
                  </button>
                </div>
              </form>
              <button
                onClick={() => setDeleteConfirmation(false)}
                className="absolute top-2 right-2 text-2xl text-gray-500 hover:scale-125 ease-in-out duration-100 focus:outline-none"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 p-10 bg-primary/25 text-center">
          <h2 className="text-lg font-medium">Account Information</h2>
          <hr className="md:max-w-[25%] mx-auto border border-zinc-400 m-4" />
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
        </div>
      </div>
    </div>
      {showFullImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="relative max-w-lg w-full p-4">
            <img
              src={profileImage}
              alt="Full Profile"
              className="w-full h-full rounded-lg border border-base-content/30"
            />
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-2 right-2 text-base-content bg-primary hover:scale-105 transition-transform p-1 rounded-full"
            >
              <X className="md:size-6 size-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;