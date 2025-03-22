import { User } from "../models/user.models.js";
import { apiError } from "../utils/apiError.js";
import { apiResponnse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// >> i already make method on user model so just get data using userId and generate tokens and return res
const generateAccessAndRefreshToken = async (userId) => {
  try {
    // >>find using userId
    const user = await User.findById(userId);

    // user varible hable all data in object form we get accessToken and refresh token
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // console.log("ac",accessToken)
    // >> then only refresh token save in database
    user.refreshToken = refreshToken;

    // >> this is save method and validateBeforeSave: false mean direct save without validation
    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "somthing went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //   message: "ok",
  // });

  /*
    >> get user details from forntend 
    >> validation - not empty
    >> check if user already exists: username, email
    >> check for images, check for avatar 
    >> upload them to cloudinary, avatar
    >> create user object - create entry in db
    >> remove password and refresh token field from response
    >> check for user creation
    >> return response
  */

  //>> get data from user
  const { fullname, email, username, password } = req.body;
  // console.log("email: ", email);

  //>> then validate that data empty or not
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  // >> then find username and email exist or not in the database
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  // >> then show error msg user exist
  if (existedUser) {
    throw new apiError(409, "User with email or username already exist");
  }
  // console.log(req.files);

  // >> then user given file are exit or not if exist then avatar first value path give
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // >> then coverphoto check and get cover photo path
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // >>if avatar not have then give error
  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is required");
  }

  // console.log(avatarLocalPath)

  // >> then upload avatar and coverImage store in cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // >> if avatar not exist throw error
  if (!avatar) {
    throw new apiError(400, "Avatar file is required");
  }

  // >> then store data in database
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // >> after store find user by id and select password and refresh token for not give in response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // >> if not user create then throw error
  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user");
  }

  // >> and atlast return res
  return res
    .status(201)
    .json(new apiResponnse(200, createdUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  /*

  >> req.body -> data
  >> username or email check
  >> find the user
  >> password check
  >> access and referesh token
  >> send cookie
  */

  //>> get data from user
  const { username, email, password } = req.body;

  // >> chech empty or not
  if (!(username || email)) {
    throw new apiError(400, "username or email is required");
  }

  // >> find username and email in database
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  // >> user not exist error
  if (!user) {
    throw new apiError(404, "User does not exist");
  }

  // >> password check
  const isPasswordValid = await user.isPasswordCorrect(password);

  // >> if password not valid then error
  if (!isPasswordValid) {
    throw new apiError(401, "Invalid user credentials");
  }

  // >> get access token and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // console.log(accessToken,refreshToken)

  // >> becase user have all information but we not given to user password and refresh token
  const loggedInUser = await User.findOne(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
    
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponnse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "user logged in successfully."
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // req.user._id
  // so i have user details from req.user and req.user under we have id (req.user._id)

  // using req.user._id we find and update database refreshToken 
  await User.findByIdAndUpdate(
    req.user._id,
    {
      // $set: { refreshToken: undefined },
      $unset: {
        refreshToken: 1 // this removes the field from document
      }
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
  .status(200)
  // >> clear cookie 
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken",options)
  .json(new apiResponnse(200, {}, "User logged Out"))
});

export { registerUser, loginUser, logoutUser };
