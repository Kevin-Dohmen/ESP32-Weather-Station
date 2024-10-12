import { Router } from 'express';
import { HeartBeat, SetData, GetConfig } from '../controllers/sensorController';
import { sensorAuth } from '../middleware/sensorAuth';

const router = Router();

router.post('/heartbeat', HeartBeat);       // POST /sensor/status
router.post('/setData', SetData);           // POST /sensor/setData
router.get('/getConfig', GetConfig);        // GET /sensor/getConfig

export default router;