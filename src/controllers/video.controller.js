import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.module.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const uploadvideo=asyncHandler(async(req,res)=>{

    //step-1  taking video and thumbnail file.
    const videolocalpath=req.files?.videofile?.[0].path;
    const thumbnaillocalpath=req.files?.thumbnail?.[0].path;
    if(!videolocalpath||!thumbnaillocalpath){
        throw new ApiError(400,"to upload video ,video and thumbnail both required");
    }
    const videofile=await UploadOnCloudinary(videolocalpath);
    const thumbnail=await UploadOnCloudinary(thumbnaillocalpath);
    
    //step-2 taking title and description and taking user from req
    const {title,description}=req.body;
    if(!title||!description){
        throw new ApiError(400,"while uploading video title and description both required");
    }

    const user=req?.user;
    console.log("this is userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",user._id);
    if(!user){
        throw new ApiError(400,"while uploading video video we dont found user in req because missing auth middleware");
    }
    //step-3 creating videofile and sanding respose
   // console.log(videofile);
    const video=await Video.create({
        videofile:videofile.url,
        thumbnail:thumbnail.url,
        title,
        description,
        duration:videofile.duration,
        view:0,
        ispubliced:true,
        owner:user._id
    })
    if(!video){
        throw new ApiError(500,"there could be error in creating object of video shema while uploading")
    }

    return res.status(200).json(
        new ApiResponse(200,video,"video uploaded successfully")
    )

})
const getallvideos=asyncHandler(async(req,res)=>{
    const videos = await Video.find().sort({ createdAt: -1 });
    if(!videos){
        throw new ApiError(400,"we get error while featching all videos")
    }
    return res.status(200).json(
        new ApiResponse(200,videos,"we got all videos here")
    )
})
const getvideobyid=asyncHandler(async(req,res)=>{
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(400,"we are getting error while fatching  video by id")
    }
    return res.status(200).json(
        new ApiResponse(200,video,"you got the video")
    )
})
const deletevideobyid=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found with this ID");
    }

    // Optional: Check if the logged-in user is the owner (authorization)
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this video");
    }
    await Video.findByIdAndDelete(videoId)
    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
})
const updatevideo=asyncHandler(async(req,res)=>{
    const { videoId } = req.params;
    const { title, description } = req.body;
    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found with this ID");
    }

    // Optional: Check if the logged-in user is the owner (authorization)
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this video");
    }
    let updatedFields = {
        title: title || video.title,
        description: description || video.description,
    };
    const thumbnaillocalpath = req.file?.path;
    if (thumbnaillocalpath) {
        const newThumbnail = await UploadOnCloudinary(thumbnaillocalpath);
        updatedFields.thumbnail = newThumbnail.url;
    }
    const updatedVideo = await Video.findByIdAndUpdate(videoId, updatedFields, {
        new: true, // return updated document
        runValidators: false,
    });

    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    );
})
export {
    uploadvideo,
    getallvideos,
    getvideobyid,
    deletevideobyid,
    updatevideo
};