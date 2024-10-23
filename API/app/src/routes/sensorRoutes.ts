import { Router } from 'express';
import { HeartBeat, SetData, GetConfig } from '../controllers/sensorController';
import { sensorAuth } from '../middleware/sensorAuth';

const router = Router();

router.post('/HeartBeat', HeartBeat);       // POST /sensor/status
router.post('/SetData', SetData);           // POST /sensor/setData
router.get('/GetConfig', GetConfig);        // GET /sensor/getConfig

export default router;