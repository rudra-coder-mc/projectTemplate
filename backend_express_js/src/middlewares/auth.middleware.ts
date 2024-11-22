import { ObjectId } from 'mongoose';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.models';
import { CustomUser, User as UserType } from 'src/types/user.types';
import { NextFunction, Response } from 'express';

export const verifyJWT = asyncHandler(
  async (req: CustomUser, res: Response, next: NextFunction) => {
    try {
      // Get the token from cookies or Authorization header
      const token =
        req.cookies?.accessToken ||
        req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
        throw new ApiError(401, 'Unauthorized request');
      }

      // Verify the JWT token and decode it
      if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new ApiError(500, 'Access token secret is not defined');
      }

      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      ) as { _id: ObjectId };

      // Find the user by the decoded token ID
      const user = (await User.findById(decodedToken._id).select(
        '-password -refreshToken'
      )) as UserType;

      if (!user) {
        throw new ApiError(401, 'Invalid Access Token');
      }

      // Attach user information to the request object
      req.user = user;
      next();
    } catch (error: unknown) {
      const e = error as Error;
      throw new ApiError(401, e.message || 'Invalid access token');
    }
  }
);
