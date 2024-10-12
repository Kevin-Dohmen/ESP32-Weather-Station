import { Request, Response, NextFunction } from 'express';
import { decryptApiKey } from '../utils/decrypt';

export const sensorAuth = (req: Request, res: Response, next: NextFunction) => {
    const { encryptedApiKey } = req.headers;
    if (!encryptedApiKey) {
        res.status(401).send('API Key is required');
        return;
    }
    const decryptedKey = decryptApiKey(encryptedApiKey as string);
    console.log(decryptedKey);
    if (decryptedKey !== process.env.API_KEY) {
        res.status(401).send('Unauthorized');
        return;
    }
    next();
}