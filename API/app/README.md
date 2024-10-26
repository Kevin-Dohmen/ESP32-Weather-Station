# Calls:
# Data:

## GET: ```/data/GetHistoricalData```
Get historical data for a specific sensor from a specific date range.

**Usage:** ```/Data/GetHistoricalData/?ID=#&StartDate=#&EndDate=#```
### Query Parameters:
|Name|Format|Description|
|:---|:-----|:----------|
|**ID**||ID of the sensor|
|**StartDate**|ISO8601|The start data|
|**EndDate**|ISO8601|The end date|

Example: ```/Data/GetHistoricalData/?ID=1&StartDate=2024-08-01T12:00:00Z&EndDate=2024-08-30T12:00:00Z```

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
        "Time": "2024-08-05T07:06:35.000Z",
        "SensorID": 1,
        "Temperature": 25.4,
        "Humidity": 46
    },
    {
        "Time": "2024-08-05T07:11:35.000Z",
        "SensorID": 1,
        "Temperature": 25.7,
        "Humidity": 44
    }
]
```
### Errors:
|Code|Description|
|:---|:----------|
|400|Bad Request|
|404|Data not found|


## GET: ```/Data/GetLatestSensorData```
Get the latest sensor data for a specific sensor.

**Usage:** ```/Data/GetLatestSensorData/?ID=#```
### Query Parameters:
|Name|Description|
|:---|:----------|
|**ID**|The ID of the sensor|

Example: ```/Data/GetLatestSensorData/?ID=1```

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
        "Time": "2024-10-23T17:14:47.000Z",
        "SensorID": 1,
        "Temperature": 19.8,
        "Humidity": 66.5
    }
]
```
### Errors:
|Code|Description|
|:---|:----------|
|400|Bad Request|
|404|Data not found|

## GET: ```/Data/GetSensorList```
Get all sensors

**Usage:** ```/Data/GetSensorList``` **[NOT FULLY IMPLEMENTED, DOCUMENTATION INACURATE]**

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
### Errors:
|Code|Description|
|:---|:----------|
|404|Data not found|

# Sensor:
## POST: ```/v2/Sensor/HeartBeat```
Send a heartbeat to the server to indicate that the sensor is still online.
Also contains the status of the sensor, which can be used to indicate if the sensor is in an error state.

**Usage:** ```/Sensor/HeartBeat```

### Request Headers:
|Name|Description|
|:---|:----------|
|**API-Key**|The API key for the sensor|

### Request Body:
A json object with the following fields:

|Name|Type|Description|
|:---|:---|:----------|
|**Status**|Integer(Enum)|The sensor status|

* Status
  * 0 = Online
  * 1 = Unknown Error
  * 2 = Sensor Error

#### Example:
```json
{
    "Status": 0
}
```

### Output:
A response code with a message

### Response Codes:
|Code|Description|
|:---|:----------|
|200|OK|
|400|Invalid status|
|401|Unauthorized|
|500|Internal Server Error|

## POST: ```/v2/Sensor/UpdateData```
Update the sensor data on the server.

**Usage:** ```/Sensor/UpdateData```

### Request Headers:
|Name|Description|
|:---|:----------|
|**API-Key**|The API key for the sensor|

### Request Body:
A json object with the following fields:

|Name|Type|Description|
|:---|:---|:----------|
|**Temperature**|Float|Temerature in °C|
|**Humidity**|Float|Relative Humidity in %|

#### Example:
```json
{
    "Temperature": 25.4,
    "Humidity": 46
}
```

### Output:
A response code with a message

### Response Codes:
|Code|Description|
|:---|:----------|
|200|OK|
|400|Invalid data|
|401|Unauthorized|
|500|Internal Server Error|

## GET: ```/v2/Sensor/GetConfig```
Get the configuration for the sensor.

**Usage:** ```/Sensor/GetConfig```

### Request Headers:
|Name|Description|
|:---|:----------
|**API-Key**|The API key for the sensor|

### Output:
A json object with the configuration for the sensor, consisting of the following fields:

|Name|Type|Description|
|:---|:---|:----------|
|**SensorID**|Integer|The sensor ID|
|**Interval**|Integer|The interval in seconds between updates|

#### Example:
```json
{
    "SensorID": 1,
    "Interval": 300
}
```

### Response Codes:
|Code|Description|
|:---|:----------|
|200|OK|
|401|Unauthorized|
|404|Config not found|
|500|Internal Server Error|
