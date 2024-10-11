import { Request, Response, NextFunction } from 'express';
import { param, validationResult } from 'express-validator';

// Validation for the ID parameter to ensure it's an integer
export const validateSensorId = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID must be a positive integer'),
    
    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    }
];

export const validateGetHistoricalData = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID must be a positive integer'),
    param('enddate')
        .isISO8601().withMessage('End date must be a valid date'),
    param('startdate')
        .isISO8601().withMessage('Start date must be a valid date'),
    param('enddate').custom((value, { req }) => {
        if (new Date(value) < new Date(req.params?.startdate || '')) {
            throw new Error('End date must be after start date');
        }
        return true;
    }),
    
    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    }
];