import multer from "multer";

const storage = multer.memoryStorage();

const update = multer({
    storage,
    limits: { fileSize: 1 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPEG, PNG and WEBP images are allowed"), false);
        }
    },
});

export const updateSingleImage = update.single("profilePic");
