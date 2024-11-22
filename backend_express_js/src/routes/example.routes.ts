// import { Router } from 'express';
// import { verifyRole } from '../middlewares/auth.middleware';
// import {
//   adminController,
//   superAdminController,
// } from '../controllers/admin.controller';

// const router = Router();

// // Admin-only route
// router
//   .route('/admin-data')
//   .get(verifyJWT, verifyRole(['admin', 'super-admin']), adminController);

// // Super-admin-only route
// router
//   .route('/super-admin-data')
//   .get(verifyJWT, verifyRole(['super-admin']), superAdminController);

// export default router;
