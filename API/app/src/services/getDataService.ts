import db from '../config/db';
import logger from '../utils/logger';

export const getLatestSensorDataService = async (id: number) => {
    try {
        const [data] = await db.query('SELECT * FROM Data WHERE SensorID = ? ORDER BY Time DESC LIMIT 1', [id]);
        return data;
    } catch (err) {
        logger.error(err);
    }
};

export const getHistoricalSensorDataService = async (id: number, startdate: Date, enddate: Date) => {
    try {
        const [data] = await db.query('SELECT Time, SensorID, Temperature, Humidity FROM Data WHERE SensorID = ? AND Time BETWEEN ? AND ?', [id, startdate, enddate]);
        return data;
    } catch (err) {
        logger.error(err);
    }
}

export const getSensorListService = async () => {
    try {
        const [data] = await db.query('SELECT ID, Name, Status, LastStatus FROM Sensor');
        return data;
    } catch (err) {
        logger.error(err);
    }
}