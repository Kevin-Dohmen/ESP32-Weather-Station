import db from '../config/db';
import logger from '../utils/logger';

export const getLatestSensorData = async (id: number) => {
    try {
        const [data] = await db.query('SELECT * FROM Data WHERE SensorID = ? ORDER BY Time DESC LIMIT 1', [id]);
        return data;
    } catch (err) {
        logger.error(err);
        throw new Error('Error fetching data');
    }
};