import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Playlist } from "../models/playlist.module.js"
const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const userid=req?.user._id;
    if(!userid){
        throw new ApiError(400,"login please")
    }
    const playlist =await Playlist.create({
        name,
        description,
        owner:userid
    })
    if(!playlist){
        throw new ApiError(400,"playlist create nahi ho pa rahi hai")
    }
    return res.status(200).json(
        new ApiResponse(200,playlist,"playlist ban gayi")
    )
    
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    const playlists=await Playlist.find({owner:userId});
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
    const playlist=await Playlist.findById(playlistId);
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
        new ApiResponse(200,updatePlaylist,"playlist is updated")
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

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}