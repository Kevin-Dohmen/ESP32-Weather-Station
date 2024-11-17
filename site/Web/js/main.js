import { getHistoricalData, getSensorList, getLatestData } from "./providers/dataProvider.js";
import { logger, logLevel } from "./logger.js";
import { TempHumDataModel } from "./models/dataModel.js";
import { TempHumRecordModel } from "./models/recordModel.js";
import { setCookie, getCookie } from "./providers/cookieProvider.js";
import { updateGraph } from "./graphs.js";

const host = "http://vps.kevin-dohmen.nl:3000";

let sensors = [];
let data = new TempHumDataModel();
let dataRange = 7; // days
let sensorID = 1;

dataRange = getCookie('dataRange') !== "" ? getCookie('dataRange') : dataRange;
document.getElementById('histDays').value = dataRange;
sensorID = getCookie('sensorID') !== "" ? getCookie('sensorID') : sensorID;

main();

async function main() {
    updateGraphData();
    updateSensorStatus();
    setInterval(() => {
        checkUpdate();
        updateSensorStatus();
    }, 10000);
}

async function updateGraphData(){
    let startTime = new Date();
    startTime.setDate(startTime.getDate() - dataRange);
    let endTime = new Date();

    data.JsonToRecords(await getHistoricalData(sensorID, startTime.toISOString(), endTime.toISOString(), host));
    updateGraph(data);
    updateStats();
}

async function updateStats(){
    document.getElementById('numRecords').innerText = data.Records.length;
    if (data.Records.length > 0) {
        const lastRecord = data.Records[data.Records.length - 1];
        document.getElementById('currentTemp').innerText = lastRecord.Temp;
        document.getElementById('currentHum').innerText = lastRecord.Hum;
    } else {
        document.getElementById('currentTemp').innerText = 'N/A';
        document.getElementById('currentHum').innerText = 'N/A';
    }
}

async function checkUpdate(){
    let newData = await getHistoricalData(sensorID, data.Records[data.Records.length - 1].Time.toISOString(), new Date().toISOString(), host);
    if(newData.length > 1){
        data.FitNewDataJson(newData.slice(1));
        data.FilterDateRange(new Date().setDate(new Date().getDate() - dataRange), new Date());
        updateGraphData(data);
        return true;
    }
    return false;
}

const statusTable = document.getElementById('statusTable');
async function updateSensorStatus() {
    const status = await getSensorList(host);
    statusTable.innerHTML = `
        <tr>
            <th>Select</th>
            <th>SensorID</th>
            <th>Name</th>
            <th>Status</th>
        </tr>
    `;

    status.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="checkbox" id="sensor${item.ID}" onchange="changeSensor(${item.ID})" ${item.ID == sensorID ? 'checked' : ''}></td>
            <td>${item.ID}</td>
            <td>${item.Name}</td>
            <td class="${item.Status === 'Offline' ? 'statusOffline' : item.Status === 'Online' ? 'statusOnline' : 'statusError'}">${item.Status}</td>
        `;
        statusTable.appendChild(tr);
    });
}

window.changeSensor = function(id){
    sensorID = id;
    let children = statusTable.children
    setCookie('sensorID', id, 30);
    for (let i = 1; i < children.length; i++) {
        let child = children[i];
        let currentID = child.children[1].innerText;
        let checkBox = child.children[0].children[0];
        
        if (currentID == id) {
            sensorID = id;
            if (!checkBox.checked) {
                checkBox.checked = true;
            }
        } else {
            checkBox.checked = false;
        }
    }
    updateGraphData();
}

window.changeDataRange = function(range) {
    dataRange = range;
    setCookie('dataRange', range, 30);
    updateGraphData();
}
