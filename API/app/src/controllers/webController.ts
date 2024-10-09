import { Request, Response } from 'express';
import { getLatestSensorData } from '../services/getSensorDataService';

// GET /web/gethistoricaldata/:id/:startdate/:enddate
export const getHistoricalData = async (req: Request, res: Response) => {
    res.send('get historical data');
};

// GET /web/getsensordata/:id
export const getSensorData = async (req: Request, res: Response) => {
    res.header('Content-Type', 'application/json');
    const id = parseInt(req.params.id, 10);
    const data = await getLatestSensorData(id);
    res.send(data);
};

// GET /web/getsensorlist
export const getSensorList = async (req: Request, res: Response) => {
    res.send('get sensor list');
};

// GET /web/getLogs
export const getLogs = async (req: Request, res: Response) => {
    res.send('get logs');
}