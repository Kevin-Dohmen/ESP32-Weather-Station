import { Router } from 'express';
import { getHistoricalData, getSensorData, getSensorList, getLogs } from '../controllers/webController';
import { validateSensorId, validateGetHistoricalData } from '../middleware/validationMiddleware';

const router = Router();

router.get('/gethistoricaldata/:id/:startdate/:enddate', validateGetHistoricalData, getHistoricalData);                // GET /web/gethistoricaldata
router.get('/getsensordata/:id', validateSensorId, getSensorData);  // GET /web/getsensordata/:id
router.get('/getsensorlist', getSensorList);                        // GET /web/getsensorlist
router.get('/getlogs', getLogs);                                    // GET /web/getLogs

export default router;