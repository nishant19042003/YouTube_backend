import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Comment } from "../models/comment.module.js"
import { Video } from "../models/video.module.js"
import { User } from "../models/user.module.js"
import mongoose from "mongoose"

import { asyncHandler } from "../utils/asyncHandler.js"
import { Subscription } from "../models/subscription.module.js"
const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const { channelid } = req.params;
    if (!channelid) {
        throw new ApiError(400, "Channel ID is required");
    }
    const totalView = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelid)
            }
        },
        {
            $group: {
              _id: null, 
              totalView: {
                $sum:"$view"
              }
            }
        }
        
    ])
    const totalVideoLike = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelid)
            }
        },
        {
            $lookup: {
              from: 'likes', 
              localField: '_id', 
              foreignField: 'video', 
              as: 'result'
            }
          },
          {
            $project: {
              likeCount: { $size: { $ifNull: ["$result", []] } }
            }
          },
          {
            $group: {
              _id: null,
              totalLikes: { $sum: "$likeCount" }
            }
          }
        
    ])
    const totalsubscriber=await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelid)
            }
        },
        {
            $count: "subscriberCount"
          }
        
    ])
    const totalvideo=await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelid)
            }
        },
        {
            $count: "videoCount"
          }
        
    ])
    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {totalVideoLike, totalView, totalsubscriber, totalvideo},
            "TotalView fetched successfully"
        )
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const { channelid } = req.params;
    const videos = await Video.find({ owner: channelid });
    console.log("bhej raha hoon")
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videos,
                "Videos fetched successfully"
            )
        );
        
})

export {
    getChannelStats, 
    getChannelVideos
    }