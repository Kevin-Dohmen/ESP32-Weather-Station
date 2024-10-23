import { Request, Response } from 'express';
import { getLatestSensorDataService, getHistoricalSensorDataService, getSensorListService } from '../services/getDataService';

// GET /data/GetGistoricalData/:id/:startdate/:enddate
export const GetHistoricalDataController = async (req: Request, res: Response) => {
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

// GET /data/GetLatestSensorData/:id
export const GetLatestSensorDataController = async (req: Request, res: Response) => {
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

// GET /data/GetSensorList
export const GetSensorListController = async (req: Request, res: Response) => {
    res.header('Content-Type', 'application/json');
    const data = await getSensorListService();
    // if no data, return 404
    if (data === undefined) {
        res.status(404).send('No sensors found');
        return;
    }
    res.send(data);
};

// GET /data/GetLogs
export const GetLogsController = async (req: Request, res: Response) => {
    res.send('get logs');
}