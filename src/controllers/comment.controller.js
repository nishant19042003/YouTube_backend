import mongoose from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Comment } from "../models/comment.module.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ObjectId } from "mongodb"
const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if (!videoId) {
        throw new ApiError(400, "videoId is required");
    }

    const comments = await Comment.aggregate([
  {
    '$match': {
      'video': new ObjectId(videoId)
    }
  }, {
    '$lookup': {
      'from': 'users', 
      'localField': 'owner', 
      'foreignField': '_id', 
      'as': 'owner'
    }
  }
]);
    
    
    if(!comments){
        throw new ApiError(400, "no comments yet");
    }

    const total = await Comment.countDocuments({ video: videoId });
    return res.status(200).json(
        new ApiResponse(200, 
            comments
           
        , "Fetched comments successfully")
    )

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(400,"videid is must required")
    }
    const {content}=req.body
    if(!content){
        throw new ApiError(400,"for comment content is required")
    }
    const comment =await Comment.create({
        content,
        video:videoId,
        owner:req.user._id
    })
    return res.status(200).json(
        new ApiResponse(200,comment,"comment pussed succesfully")
    )

})

const updateComment = asyncHandler(async (req, res) => {
    const userid=req?.user._id;
    if(!userid){
        throw new ApiError(400,"please login")
    }
    const {content}=req.body;
    if(!content){
        throw new ApiError(500,"add some content");
    }
    const {commentId}=req.params;
    const comment =await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(500,"we got error while finding comment")
    }
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this comment");
    }
   const newcomment= await Comment.findByIdAndUpdate(commentId,{content:content},{new:true,runValidators:false});
   return res.status(200).json(
    new ApiResponse(200,newcomment,"comment updated succesfully")
   )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const userid=req?.user._id;
    if(!userid){
        throw new ApiError(400,"please login")
    }
    const {commentId}=req.params;
    const comment =await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(500,"we got error while finding comment")
    }
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this comment");
    }
    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json(
        new ApiResponse(200,{},"comment deleted succesfully")
       )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }