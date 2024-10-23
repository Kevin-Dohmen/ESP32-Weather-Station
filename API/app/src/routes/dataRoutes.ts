import { Router } from 'express';
import { GetHistoricalDataController, GetLatestSensorDataController, GetSensorListController } from '../controllers/dataController';
import { ValidateSensorId, ValidateDateRange } from '../middleware/validationMiddleware';

const router = Router();

// GET /Data/GetHistoricalData
router.get('/GetHistoricalData',
    ValidateSensorId,
    ValidateDateRange,
    GetHistoricalDataController
);

// GET /Data/GetLatestSensorData
router.get('/GetLatestSensorData', 
    ValidateSensorId,
    GetLatestSensorDataController
);

// GET /Data/GetSensorList
router.get('/GetSensorList',
    GetSensorListController
);

export default router;