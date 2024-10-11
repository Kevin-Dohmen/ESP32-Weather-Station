# Calls:
## WEB:

## GET: ```/web/gethistoricaldata```
Get historical data for a specific sensor from a specific date range.
### Parameters:
```/web/gethistoricaldata/:id/:startdate/:enddate```
|Name|Format|Description|
|:---|:-----|:----------|
|**id**||ID of the sensor|
|**startdate**|ISO8601|The start data|
|**enddate**|ISO8601|The end date|

Example: ```/web/gethistoricaldata/1/2024-10-01T12:00:00Z/2024-10-30T12:00:00Z```

### Output:
A json object with all the data, consisting of the following fields:

|Name|Type|Description|
|:---|:---|:----------|
|**Time**|DateTime|Time of record|
|**SensorID**|Integer|ID of the source sensor|
|**Temperature**|Float|Temerature in °C|
|**Humidity**|Float|Relative Humidity in %|

#### Example:
```json
[
    {
        "Time": "2024-10-030 11:57:43",
        "SensorID": 1,
        "Temperature": 20.0,
        "Humidity": 50.0
    },
    {
        "Time": "2021-06-01 11:52:43",
        "SensorID": 1,
        "Temperature": 20.1,
        "Humidity": 50.1
    }
]
```


## GET: ```/web/getlatestsensordata```
Get the latest sensor data for a specific sensor

### Parameters:
```/web/getlatestsensordata/:id```
|Name|Description|
|:---|:----------|
|**ID**|The ID of the sensor|

Example: ```/web/getlatestsensordata/1```

### Output:
A json object with a record of the latest data, consisting of a single record with the following fields:

|Name|Type|Description|
|:---|:---|:----------|
|**Time**|DateTime|Time of record|
|**SensorID**|Integer|ID of the source sensor|
|**Temperature**|Float|Temerature in °C|
|**Humidity**|Float|Relative Humidity in %|

#### Example:
```json
[
    {
        "Time": "2021-06-01 12:01:00",
        "SensorID": 1,
        "Temperature": 20.1,
        "Humidity": 50.1
    }
]
```

## GET: ```/web/getsensorlist``` [NOT IMPLEMENTED]
Get all sensors

### Output:
A json object with all the sensors, consisting of the following fields:

|Name|Type|Description|
|:---|:---|:----------|
|**ID**|Integer|The sensor ID|
|**Name**|String|The sensor name|
|**Status**|Integer(Enum)|The sensor status|
|**LastHeartbeat**|DateTime|Time of last heartbeat|
* Status
  * 0 = Offline
  * 1 = Online
  * 2 = Unknown Error
  * 3 = Sensor Error

#### Example:
```json
[
    {
        "ID": 1,
        "Name": "Sensor 1",
        "Status": 0,
        "LastStatus": "2021-06-01 12:01:00"
    },
    {
        "ID": 2,
        "Name": "Sensor 2",
        "Status": 1,
        "LastStatus": "2021-06-01 12:01:00"
    }
]
```

## GET: ```/web/getLogs``` [NOT IMPLEMENTED]
Get all logs

### Output:
A json object with all the logs, consisting of the following fields:

|Name|Type|Description|
|:---|:---|:----------|
|**Time**|DateTime|Time of message|
|**Type**|Integer(Enum)|The log type|
|**Message**|String|The log message|
* Type
  * 0 = Info
  * 1 = Warning
  * 2 = Error
  * 3 = FATAL (maybe)

#### Example:
```json
[
    {
        "Time": "2021-06-01 12:01:00",
        "Type": 0,
        "Message": "Info message"
    },
    {
        "Time": "2021-06-01 12:02:00",
        "Type": 1,
        "Message": "Warning message"
    }
]
```
