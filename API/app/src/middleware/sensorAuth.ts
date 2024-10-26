import { Request, Response, NextFunction } from 'express';
import db from '../config/db';

export const SensorAuth = async (req: Request, res: Response, next: NextFunction) => {
    const ApiKey = req.headers["api-key"] as string;
    if (!ApiKey) {
        res.status(401).send('API Key is required');
        return;
    }

    try {
        const rows: any[] = await db.query('SELECT * FROM Sensor WHERE APIKey = ?', [ApiKey]);
        const sensors = rows[0];

        if (sensors.length === 0) {
            res.status(401).send('Invalid API Key');
            return;
        }
    
        req.body.SensorID = sensors[0].ID;
        next();
    } catch (err) {
        res.status(500).send('Internal Server Error');
        return;
    }

    return;
}

