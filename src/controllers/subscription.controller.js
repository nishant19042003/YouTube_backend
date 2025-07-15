import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Subscription} from "../models/subscription.module.js"
const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription

    //subscribe hai
    //find the subcription card with logged in user and given channel and then delete that
    const userid=req?.user._id;
    if(!userid){
        throw new ApiError(400,"login please")
    }
    const subscription=await Subscription.findOne({subscriber:userid,channel:channelId});
    if(subscription){
        await Subscription.findByIdAndDelete(subscription._id);
        return res.status(200).json(
            new ApiResponse(200,{},"unsubscribe succefully")
        )
    }
    //subscribe nahi hai
    //put the subscription card with logged in user and given channel
    else{
         const newsubscription=await Subscription.create({
            subscriber:userid,
            channel:channelId
         });
         if(!newsubscription){
            throw new ApiError(200,"we got error while subscribing")
         }
         return res.status(200).json(
            new ApiResponse(200,{newsubscription},"subscribe succefully")
        )
    }
    
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    //get all the subcription cards with the this channelid.
    const subscribers=await Subscription.find({"channel":channelId});
    const subscribebyme=await Subscription.find({"channel":channelId,"subscriber":req?.user._id});
    if(!subscribers){
        throw new ApiError(400,"error while fatching subscriber")
    }
    if(!subscribebyme){
        throw new ApiError(400,"error while fatching subscribebyme")
    }
    return res.status(200).json(
        new ApiResponse(200,{subscribebyme,subscribers},"this are the subscribers")
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    //get all the subcription cards with the this subscriber id
    const subscribedchannels=await Subscription.find({subscriber:subscriberId});
    if(!subscribedchannels){
        throw new ApiError(400,"error while fatching subscribed channels")
    }
    return res.status(200).json(
        new ApiResponse(200,{subscribedchannels},"this are the subscribers")
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}