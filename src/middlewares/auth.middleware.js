import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.module.js";

export const verifyJWT=asyncHandler(async(req,_,next)=>{
    try {
        const token=req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(400,"unauthorized request")
        }
        const decodedToken=await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user=await User.findById(decodedToken._id);
        if(!user){
            throw new ApiError(400,"invalid access token")
        }
        req.user=user;
        next();
    } catch (error) {
        throw new ApiError(400,error?.message||"invalid accesstoken")
    }
})