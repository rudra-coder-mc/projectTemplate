import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { User } from '../models/user.models';
import { ApiResponse } from '../utils/ApiResponse';
import {
  isValidEmail,
  isValidPassword,
  validateUserInput,
} from '../utils/validation';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import { generateTokens } from '../utils/geretateTken';
import { CustomUser } from 'src/types/user.types';

// validation checks

// Registration controller
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, fullName, password } = req.body;

  validateUserInput(username, email, password);

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) throw new ApiError(400, 'User already exists');

  const user = await User.create({
    username,
    email,
    fullName,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  res
    .status(201)
    .json(new ApiResponse(201, createdUser, 'User registered successfully'));
});

// Login controller
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  validateUserInput(username, email, password);

  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(400, 'Invalid credentials');
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  res
    .status(200)
    .cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .json(
      new ApiResponse(
        200,
        { username: user.username, email: user.email },
        'Login successful'
      )
    );
});

// Logout controller
const logoutUser = asyncHandler(async (req: CustomUser, res: Response) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      throw new ApiError(401, 'User is not logged in');
    }

    await User.findByIdAndUpdate(userId, { $set: { refreshToken: null } });

    res
      .status(200)
      .clearCookie('accessToken', { secure: true, httpOnly: true })
      .clearCookie('refreshToken', { secure: true, httpOnly: true })
      .json({ message: 'User logged out successfully' });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Error logging out user' });
    }
  }
});

// Refresh token controller
const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  if (!incomingRefreshToken)
    throw new ApiError(401, 'Refresh token is required');

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET!
  ) as { _id: ObjectId };
  const user = await User.findById(decodedToken._id);
  if (!user || incomingRefreshToken !== user.refreshToken)
    throw new ApiError(401, 'Invalid refresh token');

  const { accessToken, refreshToken } = await generateTokens(user._id);

  res
    .status(200)
    .cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .json(
      new ApiResponse(
        200,
        { accessToken },
        'Access token refreshed successfully'
      )
    );
});

// change password
const changePassword = asyncHandler(async (req: CustomUser, res: Response) => {
  if (!req.user) {
    throw new ApiError(400, 'user not logedin');
  }

  const { oldPassword, newPassword, confirmPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(502, ' user not found');
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, 'passwords do not match');
  }

  if (!isValidPassword(newPassword)) {
    throw new ApiError(
      400,
      'Password must be at least 8 characters long, contain uppercase and lowercase letters, a number, and a special character'
    );
  }

  if (oldPassword === newPassword) {
    throw new ApiError(400, 'new password cannot be same as old password');
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, 'wrong old password');
  }

  user.password = newPassword;

  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, {}, 'password changed successfully'));
});

// update user details

const updateUserDetails = asyncHandler(
  async (req: CustomUser, res: Response) => {
    const { fullName, username, email } = req.body;

    if (!fullName || !username || !email) {
      throw new ApiError(400, 'all fields are required');
    }

    if (!isValidEmail(email)) {
      throw new ApiError(400, 'invalid email');
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(502, 'user not found');
    }

    const newUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { fullName, username, email } },
      { new: true }
    ).select('-password -refreshToken');

    res
      .status(200)
      .json(new ApiResponse(200, newUser, 'user details updated successfully'));
  }
);

// get current user

const getCurrentUser = asyncHandler(async (req: CustomUser, res: Response) => {
  if (!req.user) {
    throw new ApiError(400, 'user not logedin');
  }

  res
    .status(200)
    .json(new ApiResponse(200, req.user, 'user fetched successfully'));
});

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  changePassword,
  updateUserDetails,
  getCurrentUser,
};
