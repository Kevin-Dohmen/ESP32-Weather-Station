import { getHistoricalData, getSensorList, getLatestData } from "./dataFetcher.js";
import { logger, logLevel } from "./logger.js";

const host = "http://vps.kevin-dohmen.nl:3000";

let sensors = [];
let data = [];
let dataRange = 30; // days
let sensorID = 1;

main();

async function main() {
    getData();
    setInterval(checkUpdate, 10000);
}

async function getData(){
    let startTime = new Date();
    startTime.setDate(startTime.getDate() - dataRange);
    let endTime = new Date();

    sensors = await getSensorList(host);
    logger(sensors);

    data = await getHistoricalData(sensorID, startTime.toISOString(), endTime.toISOString(), host);
    logger(data);

    let latest = await getLatestData(sensorID, host);
    logger(latest);
}

async function checkUpdate(){
    logger('Checking for updates');
    const latest = await getLatestData(sensorID, host);
    if (latest[0].Time != data[data.length - 1].Time){
        data = await getHistoricalData(sensorID, new Date(data[data.length - 1].Time).toISOString(), new Date().toISOString(), host);
        logger('Data has been updated');
        return true;
    }
    return false;
}


