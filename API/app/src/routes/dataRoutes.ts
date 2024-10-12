import { Router } from 'express';
import { getHistoricalData, getLatestSensorData, getSensorList, getLogs } from '../controllers/dataController';
import { validateSensorId, validateDateRange } from '../middleware/validationMiddleware';

const router = Router();

// GET /data/gethistoricaldata
router.get('/gethistoricaldata/:id/:startdate/:enddate',
    validateSensorId,
    validateDateRange,
    getHistoricalData
);

// GET /data/getsensordata/:id
router.get('/getlatestsensordata/:id', 
    validateSensorId,
    getLatestSensorData
);

// GET /data/getsensorlist
router.get('/getsensorlist',
    getSensorList
);

// GET /data/getLogs
router.get('/getlogs',
    getLogs
);

export default router;