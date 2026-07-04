import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name : (process.env.CLOUDINARY_CLOUD_NAME || "").trim(),
    api_key : (process.env.CLOUDINARY_API_KEY || "").trim(),
    api_secret : (process.env.CLOUDINARY_API_SECRET || "").trim(),
});

export const uploadToCloudinary = (filebuffer) => {
    return new Promise((resolve, reject)=>{
        const uploadStream = cloudinary.uploader.upload_stream(
            {folder : 'rooms'}, (error,result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        uploadStream.end(filebuffer);
    });
};