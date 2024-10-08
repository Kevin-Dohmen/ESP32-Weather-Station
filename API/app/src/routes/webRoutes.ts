import { Router } from 'express';
import { getWebData } from '../controllers/webDataController';

const router = Router();

router.get('/gethistoricaldata', getWebData);   // GET /web/gethistoricaldata
router.get('/getsensordata', getWebData);       // GET /web/getsensordata/:id
router.get('/getsensorlist', getWebData);       // GET /web/getsensorlist
router.get('/getLogs', getWebData);             // GET /web/getLogs

export default router;