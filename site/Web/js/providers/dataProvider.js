import { logger, logLevel } from "../logger.js";

async function GETJson(RequestLink){
    try {
        const response = await fetch(RequestLink);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        logger('There has been a problem with your fetch operation:', logLevel.ERROR);
        return null;
    }
}

export async function getHistoricalData(sensorID, startDate, endDate, host) {
    const fetchLink = host + '/API/V2/Data/GetHistoricalData/?ID=' + sensorID + `&StartDate=` + startDate + '&EndDate=' + endDate;
    const data = await GETJson(fetchLink);
    return data;
}

export async function getSensorList(host) {
    const fetchLink = host + '/API/V2/Data/GetSensorList';
    const data = await GETJson(fetchLink);
    return data;
}

export async function getLatestData(sensorID, host) {
    const fetchLink = host + '/API/V2/Data/GetLatestSensorData/?ID=' + sensorID;
    const data = await GETJson(fetchLink);
    return data;
}