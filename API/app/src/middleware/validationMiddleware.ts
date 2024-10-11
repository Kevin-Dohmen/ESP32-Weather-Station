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
    // Valid ID
    param('id')
        .isInt({ min: 1 }).withMessage('ID must be a positive integer'),

    // Valid start and end dates
    param('enddate')
        .isISO8601().withMessage('End date must be a valid date'),
    param('startdate')
        .isISO8601().withMessage('Start date must be a valid date'),
    
    // End date must be after start date
    param('enddate').custom((value, { req }) => {
        if (new Date(value) < new Date(req.params?.startdate || '')) {
            throw new Error('End date must be after start date');
        }
        return true;
    }),

    // Date range must be less than 30 day
    param('enddate').custom((value, { req }) => {
        const startDate = new Date(req.params?.startdate || '');
        const endDate = new Date(value);
        const diffInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
        if (diffInDays > 31) {
            throw new Error('Date range must be less than 30 days');
        }
        return true;
    }),
    
    // Validate the request
    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    }
];

