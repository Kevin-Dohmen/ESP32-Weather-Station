import { Router } from 'express';
import { getHistoricalData, getSensorData, getSensorList, getLogs } from '../controllers/webController';

const router = Router();

router.get('/gethistoricaldata', getHistoricalData);   // GET /web/gethistoricaldata
router.get('/getsensordata/:id', getSensorData);       // GET /web/getsensordata/:id
router.get('/getsensorlist', getSensorList);       // GET /web/getsensorlist
router.get('/getlogs', getLogs);             // GET /web/getLogs

export default router;