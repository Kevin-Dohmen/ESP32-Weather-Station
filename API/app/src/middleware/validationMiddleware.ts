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