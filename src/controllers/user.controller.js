import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.module.js";
import { UploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken"
const generateAccessAndRefreshToken=async(userid)=>{
    try {
        const user=await User.findById(userid);
        const refreshToken=user.generateRefreshToken();
        const accessToken=user.generateAccessToken();
        user.refreshtoken=refreshToken;
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(400,"we got error while creating access and refresh token")
    }
}
const registerUser=asyncHandler(async(req,res)=>{
   const {fullname,email,username,password}=req.body
   if(
       [fullname,email,username,password].some((field)=>field?.trim()==="")
   ){
       throw new ApiError(400,"all fields are required")
   }
    console.log(fullname);

   const userfound= await User.findOne({
    $or: [{ username: username }, { email: email }]
    })
   if(userfound){
      throw new ApiError(409 ,"user already exist by this name")
   }  

   const avatarlocalpath=req.files?.avatar?.[0]?.path;
   //const coverImagelocalpath=req.files?.coverimage[0]?.path;
   let coverImagelocalpath;
   if(req.files &&Array.isArray(req.files.coverimage)&&req.files.coverimage.length>0){
    coverImagelocalpath=req.files.coverimage[0].path;
   }

   if(!avatarlocalpath){
    throw new ApiError(400,"avatar not found")
   }  

   const avatar=await UploadOnCloudinary(avatarlocalpath);
   const coverimage=await UploadOnCloudinary(coverImagelocalpath);

   if(!avatar){
    throw new ApiError(400,"avatar is required")
   }

   const user=await User.create({
      fullname,
      avatar:avatar.url,
      coverimage:coverimage?.url||"",
      email,
      password,
      username:username.toLowerCase()
   })

   const createdUser=await User.findById(user._id).select(
    "-password -refreshToken"
   )

   if(!createdUser){
    throw new ApiError(500,"user in not created right now")
   }

   return res.status(201).json(
    new ApiResponse(200,createdUser,"user registored successfully")
   )
});
const loginUser=asyncHandler(async(req,res)=>{
    //userdata
    //username or email
    //find the user
    //password check
    //access and refresh token
    //send coockie
    console.log(req.body ,"hi how are you")

    const {username,email,password}=req.body
    
    if(!email && !password){
        throw new ApiError(400,"email or password is required")
    }
    const user=await User.findOne({
        $or:[{username,email}]
    })
    if(!user){
        throw new ApiError(400,"user not found")
    }
    const isPasswordCorrect=await user.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        throw new ApiError(400,"invalid credentials")
    }

    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);
    const loggedinuser=await User.findById(user._id).select("-password -refreshtoken").lean();
    const isProd = process.env.NODE_ENV === 'production';

    const options = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'None' : 'Lax'
    };

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,{user: { ...loggedinuser },accessToken,refreshToken},"user logged in successfully")
    )

})

const logoutUser=asyncHandler(async(req,res)=>{
   await  User.findByIdAndUpdate(req.user._id,
    {
        $unset: {
            refreshtoken: 1 // this removes the field from document
        }
        
    },
    {
        new :true
    }
   )
    const options={
        httpOnly:true,
        secure:true,
    }  

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user logged out"))
})

const refreshaccesstoken=asyncHandler(async(req,res)=>{
    const incomingrefreshtoken=req.cookies.refreshtoken||req.body.refreshtoken;
    if(!incomingrefreshtoken){
        throw new ApiError(400,"user not authorised")
    }
    const decodedrefreshtoken=jwt.verify(
        incomingrefreshtoken,
        process.env.REFRESH_TOKEN_SECRET
    );
    const user=await User.find(decodedrefreshtoken._id);
    if(!user){
        throw new ApiError(400,"user not found");
    }
    if(incomingrefreshtoken!==user?.refreshtoken){
        throw new ApiError(400,"refrsh token expaired")
    }
    const {accesstoken,newrefreshtoken}=await generateAccessAndRefreshToken(user._id);

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.staus(200)
    .cookie("accesstoken",accesstoken,options)
    .cookie("refreshtoken",newrefreshtoken,options)
    .json(
        new ApiResponse(
            200,
            {accessToken, refreshToken: newRefreshToken},
            "Access token refreshed"
        )
    )
})
const changepassword=asyncHandler(async(req,res)=>{
    const {oldpassword,newpassword}=req.body;
    const user=await User.findById(req.user?._id);
    const isPasswordCorrect=user.isPasswordCorrect(oldpassword);
    if(!isPasswordCorrect){
        throw ApiError(400,"password is incorrect");
    }
    user.password=newpassword;
    await user.save({validateBeforeSave:false});
    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"))
});

const getcurrentuser=asyncHandler(async(req,res)=>{
    const user=await User.findById(req?.user?._id);
    if(!user){
        throw new ApiError(400,"currently not any user is loggedin");
    }
    return res.staus(200).json(new ApiResponse(200,user,"this is the user"))
})

const updateavatar=asyncHandler(async(req,res)=>{
    const avatarpath=req.file?.path;
    if(!avatarpath){
        throw new ApiError(400,"for updation of avatar we dont found avatar");
    }
    const avatar=await UploadOnCloudinary(avatarpath);
    if(!avatar){
        throw new avatar(400,"on avatar update we get error on cloudinary");
    }
    const user =await User.findByIdAndUpdate(req.user._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {new:true}
    ).select("-password")

    return  res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})
const updatecoverimage=asyncHandler(async(req,res)=>{
    const coverimagepath=req.file?.path;
    if(!coverimagepath){
        throw new ApiError(400,"for updation of coverimage we dont found coverimage ")
    }
    const coverimage=await UploadOnCloudinary(coverimagepath);
    if(!coverimage){
        throw new avatar(400,"on coverimage update we get error on cloudinary");
    }
    const user =User.findByIdAndUpdate(req.user._id,
        {
            $set:{
                coverimage:coverimage.url
            }
        },
        {new:true}
    ).select("-password")
    return  res
    .status(200)
    .json(
        new ApiResponse(200, user, "cover image updated successfully")
    )
})

const getWatchhistory=asyncHandler(async(req,res)=>{
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchhistory",
                foreignField: "_id",
                as: "watchhistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchhistory,
            "Watch history fetched successfully"
        )
    )
})
const getUserChannelProfile = asyncHandler(async(req, res) => {
    const {username} = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )
})

export {
    registerUser
    ,loginUser
    ,logoutUser
    ,refreshaccesstoken
    ,changepassword
    ,getcurrentuser,
    updateavatar,
    updatecoverimage,
    getWatchhistory,
    getUserChannelProfile
}