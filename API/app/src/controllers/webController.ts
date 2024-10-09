import { Request, Response } from 'express';

// GET /web/gethistoricaldata/:id/:startdate/:enddate
export const getHistoricalData = async (req: Request, res: Response) => {
    res.send('get historical data');
};

// GET /web/getsensordata/:id
export const getSensorData = async (req: Request, res: Response) => {
    const id = req.params.id;
    res.send('get sensor data' + id);
};

// GET /web/getsensorlist
export const getSensorList = async (req: Request, res: Response) => {
    res.send('get sensor list');
};

// GET /web/getLogs
export const getLogs = async (req: Request, res: Response) => {
    res.send('get logs');
}