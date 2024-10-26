import { Request, Response } from 'express';
import { SensorHeartbeatService, GetSensorConfigService, UpdateDataService } from '../services/sensorService';
import { SensorNotFoundError, InvalidStatusError, InternalServerError } from '../Exceptions/exceptions';

// POST /sensor/status
export const HeartBeat = async (req: Request, res: Response) => {
    const status = req.body.Status as number;
    try {
        await SensorHeartbeatService(req.body.SensorID, status);
    } catch (err) {
        if (err instanceof SensorNotFoundError) {
            res.status(401).send('Sensor not found');
            return;
        }
        if (err instanceof InvalidStatusError) {
            res.status(400).send('Invalid status');
            return;
        }
        res.status(500).send('Internal Server Error');
        return;
    }
    res.send('OK');
};

// POST /sensor/UpdateData
export const UpdateData = async (req: Request, res: Response) => {
    try {
        await UpdateDataService(req.body.SensorID, req.body.Data);
    } catch (err) {
        if (err instanceof SensorNotFoundError) {
            res.status(401).send('Sensor not found');
            return;
        }
        res.status(500).send('Internal Server Error');
        return;
    }
    res.send('OK');
};

// GET /sensor/getConfig
export const GetConfig = async (req: Request, res: Response) => {
    try {
        const config = await GetSensorConfigService(req.body.SensorID);
        res.send(config);
    } catch (err) {
        if (err instanceof SensorNotFoundError) {
            res.status(404).send('Config not found');
            return;
        }
        res.status(500).send('Internal Server Error');
        return
    }
}