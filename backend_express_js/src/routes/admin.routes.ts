import { RequestHandler, Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware';
import { verifyRole } from '../middlewares/role.middleware';
import {
  createAdmin,
  getAllAdminsAndSuperAdmins,
  deleteAdminOrSuperAdmin,
} from '../controllers/admin.controller';

const router = Router();

// Route to create a new admin or super-admin
// This route is protected and only accessible to super-admins
router.post(
  '/create',
  verifyJWT,
  verifyRole(['super-admin']) as RequestHandler,
  createAdmin
);

// Route to fetch all admins and super-admins
// This route is protected and only accessible to super-admins
router.get(
  '/',
  verifyJWT,
  verifyRole(['super-admin']) as RequestHandler,
  getAllAdminsAndSuperAdmins
);

// Route to delete an admin or super-admin
// This route is protected and only accessible to super-admins
router.delete(
  '/:userId',
  verifyJWT,
  verifyRole(['super-admin']) as RequestHandler,
  deleteAdminOrSuperAdmin
);

export default router;
