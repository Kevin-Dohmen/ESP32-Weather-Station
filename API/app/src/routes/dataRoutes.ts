import { Router } from 'express';
import { GetHistoricalDataController, GetLatestSensorDataController, GetSensorListController, GetLogsController } from '../controllers/dataController';
import { validateSensorId, validateDateRange } from '../middleware/validationMiddleware';

const router = Router();

// GET /data/GetGistoricalData
router.get('/GetGistoricalData/:id/:startdate/:enddate',
    validateSensorId,
    validateDateRange,
    GetHistoricalDataController
);

// GET /data/GetLatestSensorData/:id
router.get('/GetLatestSensorData/:id', 
    validateSensorId,
    GetLatestSensorDataController
);

// GET /data/GetSensorList
router.get('/GetSensorList',
    GetSensorListController
);

// GET /data/GetLogs
router.get('/GetLogs',
    GetLogsController
);

export default router;