import { Request, Response } from 'express';
import { GetLatestSensorDataService, GetHistoricalSensorDataService, GetSensorListService } from '../services/getDataService';

// GET /Data/GetGistoricalData/?ID=#&StartDate=#&EndDate=#
export const GetHistoricalDataController = async (req: Request, res: Response) => {
    // get parameters
    const id = parseInt(req.query.ID as string);
    const startdate = new Date(req.query.StartDate as string);
    const enddate = new Date(req.query.EndDate as string);

    // call service for data
    const data = await GetHistoricalSensorDataService(id, startdate, enddate);

    // if no data, return 404
    if (data === undefined) {
        res.status(404).send('Data not found');
        return;
    }

    // return data
    res.header('Content-Type', 'application/json');
    res.send(data);
};

// GET /Data/GetLatestSensorData
export const GetLatestSensorDataController = async (req: Request, res: Response) => {
    // get parameters
    const id = parseInt(req.query.ID as string);

    // call service for data
    const data = await GetLatestSensorDataService(id);

    // if no data, return 404
    if (data === undefined) {
        res.status(404).send('Data not found');
        return;
    }

    // return data
    res.header('Content-Type', 'application/json');
    res.send(data);
};

// GET /Data/GetSensorList
export const GetSensorListController = async (req: Request, res: Response) => {
    // call service for data
    const data = await GetSensorListService();

    // if no data, return 404
    if (data === undefined) {
        res.status(404).send('No sensors found');
        return;
    }

    // return data
    res.header('Content-Type', 'application/json');
    res.send(data);
};