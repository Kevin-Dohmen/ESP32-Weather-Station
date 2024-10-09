import { Request, Response } from 'express';

// POST /sensor/status
export const HeartBeat = async (req: Request, res: Response) => {
    res.send('Heartbeat');
};

// POST /sensor/setData
export const SetData = async (req: Request, res: Response) => {
    res.send('SetData');
};

// GET /sensor/getConfig
export const GetConfig = async (req: Request, res: Response) => {
    res.send('GetConfig');
}