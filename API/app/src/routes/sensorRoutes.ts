import { Router } from 'express';
import { HeartBeat, GetConfig, UpdateData } from '../controllers/sensorController';
import { ValidateSensorData } from '../middleware/validationMiddleware';
import { SensorAuth } from '../middleware/sensorAuth';

const router = Router();

router.post('/HeartBeat', SensorAuth, HeartBeat);       // POST /sensor/status
router.post('/UpdateData', SensorAuth, ValidateSensorData, UpdateData);     // POST /sensor/setData
router.get('/GetConfig', SensorAuth, GetConfig);        // GET /sensor/getConfig

export default router;