import mongoose from 'mongoose';
import { User } from '../models/user.models';
import { ApiError } from './ApiError';

// Utility function for token generation
export const generateTokens = async (userId: {
  _id: mongoose.Types.ObjectId | string;
}) => {
  const user = await User.findById(userId._id);
  if (!user)
    throw new ApiError(400, 'User does not exist while creating token');

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};
