const User = require('../models/user.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => field?.trim() === '')) {
    throw new ApiError(400, 'All fields are required');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const user = await User.create({ name, email, password });

  const createdUser = await User.findById(user._id).select('-password');

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering the user');
  }

  return res.status(201).json(new ApiResponse(201, createdUser, 'User registered successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid user credentials');
  }

  const accessToken = user.generateAccessToken();

  const loggedInUser = await User.findById(user._id).select('-password');

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        'User logged in successfully'
      )
    );
});

const getCurrentUser = asyncHandler(async(req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, 'Current user fetched successfully'));
})

module.exports = { registerUser, loginUser, getCurrentUser };
