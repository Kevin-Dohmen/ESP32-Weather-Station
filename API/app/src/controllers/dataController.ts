import { Request, Response } from 'express';
import { getLatestSensorDataService, getHistoricalSensorDataService, getSensorListService } from '../services/getDataService';

// GET /data/gethistoricaldata/:id/:startdate/:enddate
export const getHistoricalData = async (req: Request, res: Response) => {
    res.header('Content-Type', 'application/json');
    const id = parseInt(req.params.id, 10);
    const startdate = new Date(req.params.startdate);
    const enddate = new Date(req.params.enddate);
    const data = await getHistoricalSensorDataService(id, startdate, enddate);
    // if no data, return 404
    if (data === undefined) {
        res.status(404).send('Data not found');
        return;
    }
    res.send(data);
};

// GET /data/getlatestsensordata/:id
export const getLatestSensorData = async (req: Request, res: Response) => {
    res.header('Content-Type', 'application/json');
    const id = parseInt(req.params.id, 10);
    const data = await getLatestSensorDataService(id);
    // if no data, return 404
    if (data === undefined) {
        res.status(404).send('Data not found');
        return;
    }
    res.send(data);
};

// GET /data/getsensorlist
export const getSensorList = async (req: Request, res: Response) => {
    res.header('Content-Type', 'application/json');
    const data = await getSensorListService();
    // if no data, return 404
    if (data === undefined) {
        res.status(404).send('No sensors found');
        return;
    }
    res.send(data);
};

// GET /data/getLogs
export const getLogs = async (req: Request, res: Response) => {
    res.send('get logs');
}