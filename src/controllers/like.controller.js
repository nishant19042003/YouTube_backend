import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Like } from "../models/like.module.js";
const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const userid=req?.user._id;
        if(!userid){
            throw new ApiError(400,"login please")
        }
    //TODO: toggle like on video
    const like=await Like.findOne({video:videoId,likedby:userid})
    if(like){
       await Like.findByIdAndDelete(like._id);
       return res.status(200).json(
        new ApiResponse(200,{},"video disliked")
       )
    }
    else{
       const like= await Like.create({video:videoId,likedby:userid});
       if(!like){
        throw new ApiError(400,"video likeing problem");
       }
       return res.status(200).json(
        new ApiResponse(200,like,"video liked")
       )
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const userid=req?.user._id;
        if(!userid){
            throw new ApiError(400,"login please")
        }
    //TODO: toggle like on video
    const like=await Like.find({comment:commentId,likedby:userid})
    if(like){
       await Like.findByIdAndDelete(like._id);
       return res.status(200).json(
        new ApiResponse(200,{},"video disliked")
       )
    }
    else{
       const like= await Like.create({comment:commentId,likedby:userid});
       if(!like){
        throw new ApiError(400,"video likeing problem");
       }
       return res.status(200).json(
        new ApiResponse(200,like,"video liked")
       )
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const userid=req?.user._id;
        if(!userid){
            throw new ApiError(400,"login please")
        }
    //TODO: toggle like on video
    const like=await Like.find({tweet:tweetId,likedby:userid})
    if(like){
       await Like.findByIdAndDelete(like._id);
       return res.status(200).json(
        new ApiResponse(200,{},"video disliked")
       )
    }
    else{
       const like= await Like.create({tweet:tweetId,likedby:userid});
       if(!like){
        throw new ApiError(400,"video likeing problem");
       }
       return res.status(200).json(
        new ApiResponse(200,like,"video liked")
       )
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userid=req?.user._id;
    if(!userid){
        throw new ApiError(400,"login please")
    }
    //vidoe schema me gaye -allvidoes.
    //like by me.
    //foreign field me like se match kara diya-all liked video by me.
    
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}