export class TempHumRecordModel {
    Temp;
    Hum;
    Time;

    constructor(temp = 0, hum = 0, time = new Date()) {
        this.Temp = temp;
        this.Hum = hum;
        this.Time = time;
    }

    JsonToRecord(jsonData) {
        return new TempHumRecordModel(jsonData.Temperature, jsonData.Humidity, new Date(jsonData.Time));
    }
}