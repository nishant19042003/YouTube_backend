import { ApiError } from "../utils/ApiError.js";
import { Tweet } from "../models/tweet.module.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content}=req.body;
    if(!content){
        throw new ApiError(400,"content is required")
    }
    const userid=req?.user._id;
    if(!userid){
        throw new ApiError(400,"for tweet you have to be login")
    }
    const tweet=await Tweet.create({
        content,
        owner:userid
    })
    if(!tweet){
        throw new ApiError(400,"tweet got some error")
    }
    return res.status(200).json(
        new ApiResponse(200,tweet,"tweet successfull")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userid=req?.user._id;
    if(!userid){
        throw new ApiError(400,"for tweet you have to be login")
    }
    const tweets=await Tweet.find({owner:userid});
    if(!tweets){
        throw new ApiError(400,"tweets fatching  got some error")
    }
    return res.status(200).json(
        new ApiResponse(200,tweets,"tweets fatched successfully")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const userid=req?.user._id;
    if(!userid){
        throw new ApiError(400,"for tweet you have to be login")
    }
    const {tweetid}=req.params
    if(!tweetid){
        throw new ApiError(400,"tweetid missing or required" )
    }
    const tweet=await Tweet.findById(tweetid);
    if(userid.toString()!==tweet.owner.toString()){
        throw new ApiError(400,"this is not your tweet" )
    }
    const {content}=req.body;
    if(!content){
        throw new ApiError(400,"content is required")
    }
    const newtweet=await Tweet.findByIdAndUpdate(tweetid, {content:content}, {
        new: true, 
        runValidators: false, 
    });
    if(!newtweet){
        throw new ApiError(400,"tweet update  got some error")
    }
    return res.status(200).json(
        new ApiResponse(200,newtweet,"tweet updated successfully")
    )
    
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const userid=req?.user._id;
    if(!userid){
        throw new ApiError(400,"for tweet you have to be login")
    }
    const {tweetid}=req.params
    if(!tweetid){
        throw new ApiError(400,"tweetid missing or required" )
    }
    const tweet=await Tweet.findById(tweetid);
    if(userid.toString()!==tweet.owner.toString()){
        throw new ApiError(400,"this is not your tweet" )
    }
    await Tweet.findByIdAndDelete(tweetid);
    return res.status(200).json(
        new ApiResponse(200,{},"tweet deleted successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}