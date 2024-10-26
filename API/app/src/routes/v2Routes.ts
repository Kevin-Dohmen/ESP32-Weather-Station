import { Router } from 'express';
import v2dataRoutes from '../routes/dataRoutes';
import v2sensorRoutes from '../routes/sensorRoutes';

const router = Router();

router.use('/Data', v2dataRoutes);
router.use('/Sensor', v2sensorRoutes);

export default router;