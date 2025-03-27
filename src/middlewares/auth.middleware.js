import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";

// -----------------------------------response not use that way use "_"----------------
export const verifyJWT = asyncHandler(async (req, _, next) => {

  try {

    // console.log(req.cookies)
    const token =
    //>> get accessToken form cookies OR get from header
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
  
      // console.log("hello",token)

    if (!token) {
      throw new apiError(401, "Unauthorized request");
    }
  
    // >> verify token is correct or not if correct then decode using SECRET key
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log(decodedToken)

    // >> decodedToken have id using this id find User and get detail but without password and refresh token
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

  
    if (!user) {
      throw new apiError(401, "Invalid Access Token");
    }
  
    // >> then make req.user and give user details and proside to next()
    req.user = user;
    next();
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid access token.")
  }
});
 