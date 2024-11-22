import { Router } from 'express';
import healthcheck from 'src/controllers/healthcheck.controller';

const router = Router();

router.route('/').get(healthcheck);

export default router;
