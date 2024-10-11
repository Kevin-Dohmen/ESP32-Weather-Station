import { Request, Response } from 'express';
import { getLatestSensorData, getHistoricalSensorData } from '../services/getDataService';

// GET /web/gethistoricaldata/:id/:startdate/:enddate
export const getHistoricalData = async (req: Request, res: Response) => {
    res.header('Content-Type', 'application/json');
    const id = parseInt(req.params.id, 10);
    const startdate = new Date(req.params.startdate);
    const enddate = new Date(req.params.enddate);
    const data = await getHistoricalSensorData(id, startdate, enddate);
    res.send(data);
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