import { Request, Response, NextFunction } from 'express';

const sensorAuth = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (authorization === 'Bearer sensor') {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}