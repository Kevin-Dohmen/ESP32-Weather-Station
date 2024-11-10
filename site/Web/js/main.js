import { getHistoricalData, getSensorList, getLatestData } from "./dataFetcher.js";
import { logger, logLevel } from "./logger.js";
import { TempHumDataModel } from "./models/dataModel.js";
import { TempHumRecordModel } from "./models/recordModel.js";

const host = "http://vps.kevin-dohmen.nl:3000";

let sensors = [];
let data = new TempHumDataModel();
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

    
    data.JsonToRecords(await getHistoricalData(sensorID, startTime.toISOString(), endTime.toISOString(), host));
    logger(data);

    let latest = new TempHumRecordModel().JsonToRecord((await getLatestData(sensorID, host))[0]);
    logger(latest);
}

async function checkUpdate(){
    logger('Checking for updates');
    let newData = await getHistoricalData(sensorID, data.Records[data.Records.length - 1].Time.toISOString(), new Date().toISOString(), host);
    if(newData.length > 1){
        logger('New data found');
        data.FitNewDataJson(newData.slice(1));
        data.FilterDateRange(new Date().setDate(new Date().getDate() - dataRange), new Date());
        logger(data);
    }
    return false;
}

