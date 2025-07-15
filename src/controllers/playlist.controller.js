import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Playlist } from "../models/playlist.module.js"
import { UploadOnCloudinary } from "../utils/cloudinary.js"
import mongoose from "mongoose"
const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const thumbnail=req?.file.path;
    const uploaded=await UploadOnCloudinary(thumbnail)
    
    const userid=req?.user._id;
    if(!userid){
        throw new ApiError(400,"login please")
    }
    const playlist =await Playlist.create({
        name,
        description,
        owner:userid,
        thumbnail:uploaded.url,
    })
    if(!playlist){
        throw new ApiError(400,"playlist create nahi ho pa rahi hai")
    }
    return res.status(200).json(
        new ApiResponse(200,playlist,"playlist is created")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    const playlists=await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
    
        {
            '$lookup': {
            'from': 'videos', 
            'localField': 'videos', 
            'foreignField': '_id', 
            'as': 'videos'
            }
        }

    ])
    if(!playlists){
        throw new ApiError(400,"playlist nahi mil rahi hai")
    }
    return res.status(200).json(
        new ApiResponse(200,playlists,"playlists mil gayi")
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    const playlist=await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
    
        {
            '$lookup': {
            'from': 'videos', 
            'localField': 'videos', 
            'foreignField': '_id', 
            'as': 'videos'
            }
        }

    ])
    if(!playlist){
        throw new ApiError(400,"playlist nahi mil rahi hai")
    }
    return res.status(200).json(
        new ApiResponse(200,playlist,"playlists mil gayi")
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    const playlist=await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(400,"playlist not found")
    }
    const userid=req?.user._id;
    if(!userid){
        throw new ApiError(400,"login please")
    }
    if(userid.toString()!==playlist.owner.toString()){
        throw new ApiError(400,"opration not allowed")
    }
    const updatedplaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $push: { videos: videoId } },
        { new: true, runValidators: false }
    );
    if(!updatedplaylist){
        throw new ApiError(400,"playlist is not  updated")
    }
    return res.status(200).json(
        new ApiResponse(200,updatedplaylist,"playlist is updated")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    const playlist=await Playlist.findById(playlistId);
    const userid=req?.user._id;
    if(!userid){
        throw new ApiError(400,"login please")
    }
    if(userid.toString()!==playlist.owner.toString()){
        throw new ApiError(400,"opration not allowed")
    }
    
    const updatedplaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { videos: videoId } },
        { new: true, runValidators: false }
    );
    if(!updatedplaylist){
        throw new ApiError(400,"playlist is not  updated")
    }
    return res.status(200).json(
        new ApiResponse(200,updatePlaylist,"playlist is updated")
    )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    const playlist=await Playlist.findById(playlistId);
    const userid=req?.user._id;
    if(!userid){
        throw new ApiError(400,"login please")
    }
    if(userid.toString()!==playlist.owner.toString()){
        throw new ApiError(400,"opration not allowed")
    } 
    await Playlist.findByIdAndDelete(playlistId);
    return res.status(200).json(
        new ApiResponse(200,{},"playlist is deleted")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    const playlist=await Playlist.findById(playlistId);
    const userid=req?.user._id;
    if(!userid){
        throw new ApiError(400,"login please")
    }
    if(userid.toString()!==playlist.owner.toString()){
        throw new ApiError(400,"opration not allowed")
    } 
    const updatedplaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { name,description },
        { new: true, runValidators: false }
    );
    if(!updatedplaylist){
        throw new ApiError(400,"playlist is not  updated")
    }
    return res.status(200).json(
        new ApiResponse(200,updatePlaylist,"playlist is updated")
    )
})
const getallplaylists=asyncHandler(async(req,res)=>{
    const playlists = await Playlist.find().populate('videos');
    return res.status(200).json(
        new ApiResponse(200,playlists,"all playlists")
    )
})
export {
    getallplaylists,
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}