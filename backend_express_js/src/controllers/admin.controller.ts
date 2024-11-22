import { Response } from 'express';
import { User } from '../models/user.models';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { CustomUser } from 'src/types/user.types';
import { asyncHandler } from 'src/utils/asyncHandler';
import { validateUserInput } from 'src/utils/validation';

// Create Admin or Super Admin
const createAdmin = asyncHandler(async (req: CustomUser, res: Response) => {
  const { username, email, password, role } = req.body;

  validateUserInput(username, email, password);

  if (role !== 'admin' && role !== 'super-admin') {
    throw new ApiError(400, 'Role must be admin or super-admin');
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) throw new ApiError(400, 'User already exists');

  if (req.user.role !== 'super-admin') {
    throw new ApiError(
      403,
      'Only super-admins can create admins or super-admins'
    );
  }

  const user = await User.create({
    username,
    email,
    password,
    role,
  });

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  res
    .status(201)
    .json(new ApiResponse(201, createdUser, 'User created successfully'));
});

// Get All Admins and Super-Admins
const getAllAdminsAndSuperAdmins = asyncHandler(
  async (req: CustomUser, res: Response) => {
    const users = await User.find({ role: { $in: ['admin', 'super-admin'] } });
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          users,
          'Admins and Super Admins fetched successfully'
        )
      );
  }
);

// Delete Admin or Super-Admin
const deleteAdminOrSuperAdmin = asyncHandler(
  async (req: CustomUser, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
      throw new ApiError(400, 'User ID is required');
    }

    const targetUser = await User.findById(userId);

    if (!targetUser) {
      throw new ApiError(404, 'User not found');
    }

    if (targetUser.role !== 'admin' && targetUser.role !== 'super-admin') {
      throw new ApiError(400, 'User is neither an admin nor a super-admin');
    }

    if (req.user.role !== 'super-admin') {
      throw new ApiError(
        403,
        'Only super-admins can delete admins or super-admins'
      );
    }

    if (targetUser.role === 'super-admin') {
      throw new ApiError(403, 'Cannot delete another super-admin');
    }

    await User.findByIdAndDelete(userId);

    res
      .status(200)
      .json(
        new ApiResponse(200, null, 'Admin or Super Admin deleted successfully')
      );
  }
);

export { createAdmin, getAllAdminsAndSuperAdmins, deleteAdminOrSuperAdmin };
