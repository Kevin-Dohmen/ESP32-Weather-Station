import { Request, Response, NextFunction } from 'express';
import { param, validationResult } from 'express-validator';

// validate sensor ID
export const ValidateSensorId = (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.ID || isNaN(parseInt(req.query.ID as string))) {
        res.status(400).json({ error: 'Invalid sensor ID' });
        return;
    }
    next();
};

// validate date range
export const ValidateDateRange = (req: Request, res: Response, next: NextFunction) => {
    // required
    if (!req.query.StartDate || !req.query.EndDate) {
        res.status(400).json({ error: 'Start and end date are required' });
        return;
    }

    // valid format
    if (!param('startdate').isISO8601().run(req.query)) {
        res.status(400).json({ error: 'Invalid date format' });
        return;
    }
    if (!param('enddate').isISO8601().run(req.query)) {
        res.status(400).json({ error: 'Invalid date format' });
        return;
    }

    // valid range
    const startDate = new Date(req.query.StartDate as string);
    const endDate = new Date(req.query.EndDate as string);
    if (startDate.toString() === 'Invalid Date' || endDate.toString() === 'Invalid Date') {
        res.status(400).json({ error: 'Invalid date format' });
        return;
    }
    if (startDate > endDate) {
        res.status(400).json({ error: 'End date must be after start date' });
        return;
    }
    const diffInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    if (diffInDays > 31) {
        res.status(400).json({ error: 'Date range must be less than 30 days' });
        return;
    }

    next();
};

