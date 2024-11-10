import { TempHumRecordModel } from "./recordModel.js";

export class TempHumDataModel {
    Records = [];

    constructor() {
        this.Records = [];
    }

    JsonToRecords(jsonData) {
        this.Records = jsonData.map(record => {
            return new TempHumRecordModel().JsonToRecord(record);
        });
    }

    AddRecord(record) {
        this.Records.push(record);
    }

    GetRecords() {
        return this.Records;
    }

    FilterDateRange(startDate, endDate) {
        this.Records = this.Records.filter(record => {
            return record.Time >= startDate && record.Time <= endDate;
        });
    }

    FitNewData(newData) {
        this.Records = this.Records.concat(newData);
    }

    FitNewDataJson(jsonData) {
        this.Records = this.Records.concat(jsonData.map(record => {
            return new TempHumRecordModel().JsonToRecord(record);
        }));
    }
}