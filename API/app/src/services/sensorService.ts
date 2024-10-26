import db from '../config/db';
import logger from '../utils/logger';
import { SensorNotFoundError, InvalidStatusError, InternalServerError } from '../Exceptions/exceptions';

export const SensorHeartbeatService = async (id: number, status: number) => {
    try {
        const rows: any[] = await db.query('SELECT * FROM Sensor WHERE ID = ?', [id]);
        const sensors = rows[0];

        if (sensors.length === 0) {
            throw new SensorNotFoundError();
        }

        switch (status) {
            case 0:
                await db.query('UPDATE Sensor SET Status = "Online", LastStatus = NOW() WHERE ID = ?', [id]);
                break;
            case 1:
                await db.query('UPDATE Sensor SET Status = "Unknown Error", LastStatus = NOW() WHERE ID = ?', [id]);
                break;
            case 2:
                await db.query('UPDATE Sensor SET Status = "Sensor Error", LastStatus = NOW() WHERE ID = ?', [id]);
                break;
            default:
                throw new InvalidStatusError();
        }
        return
    } catch (err) {
        logger.error(err);
        throw new InternalServerError();
    }
};

export const GetSensorConfigService = async (id: number) => {
    try {
        const sensorRows: any[] = await db.query('SELECT * FROM Sensor WHERE ID = ?', [id]);
        const sensors = sensorRows[0];

        if (sensors.length === 0) {
            throw new SensorNotFoundError();
        }

        const rows: any[] = await db.query('SELECT `SensorID`, `Interval` FROM SensorConfig WHERE SensorID = ?', [id]);
        const sensorConfig = rows[0][0];
        return sensorConfig;
    } catch (err) {
        logger.error(err);
        throw new InternalServerError();
    }
}

export const UpdateDataService = async (id: number, data: any) => {
    try {
        const rows: any[] = await db.query('SELECT * FROM Sensor WHERE ID = ?', [id]);
        const sensors = rows[0];

        if (sensors.length === 0) {
            throw new SensorNotFoundError();
        }

        await db.query('INSERT INTO Data (SensorID, Temperature, Humidity) VALUES (?, ?, ?)', [id, data.Temperature, data.Humidity]);
        return
    } catch (err) {
        logger.error(err);
        throw new InternalServerError();
    }
}