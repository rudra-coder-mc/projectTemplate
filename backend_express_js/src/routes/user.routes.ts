import { Request, Router } from 'express';
import {
  changePassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserDetails,
} from '../controllers/user.controller';
import { verifyJWT } from '../middlewares/auth.middleware';
import passport from 'passport';

import { ApiError } from '../utils/ApiError';
import { generateTokens } from 'src/utils/geretateTken';
import { CustomUser } from 'src/types/user.types';

const router = Router();

// User Registration and Login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req: Request, res, next) => {
    const customReq = req as CustomUser;
    try {
      // Check if the user is authenticated
      if (!customReq.user) {
        throw new ApiError(401, 'Google authentication failed');
      }

      const { accessToken } = await generateTokens({ _id: customReq.user._id });

      // Set tokens as HTTP-only cookies
      res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });

      // Redirect to the client application or send a success response
      res.redirect('/');
    } catch (error) {
      next(error);
    }
  }
);

// Logout, Token Refresh, and Account Management
router.post('/logout', verifyJWT, logoutUser);
router.post('/refresh-token', refreshAccessToken);
router.post('/change-password', verifyJWT, changePassword);
router.get('/current-user', verifyJWT, getCurrentUser);
router.patch('/update-account', verifyJWT, updateUserDetails);

export default router;
