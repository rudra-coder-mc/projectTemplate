import { Request, Response, NextFunction } from 'express';
import { CustomUser, User } from 'src/types/user.types';
import { ApiError } from 'src/utils/ApiError';

/**
 * Middleware to verify if the authenticated user has one of the specified roles.
 * 
 * @param {string[]} roles - An array of allowed roles that can access the route.
 * @returns {Function} A middleware function that checks the user's role.
 * 
 * @throws {ApiError} If the user is not authenticated (HTTP 401) or if the user 
 *                    does not have one of the allowed roles (HTTP 403).
 */
export const verifyRole = (roles: string[]) => {
  return (req: CustomUser, res: Response, next: NextFunction) => {
    // Check if the user object exists in the request (meaning they are authenticated)
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'Access denied');
    }

    // Proceed to the next middleware or route handler if the user is authenticated and authorized
    next();
  };
};
