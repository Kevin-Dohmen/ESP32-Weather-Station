# Calls:
## WEB:

## GET: ```/web/gethistoricaldata``` [NOT IMPLEMENTED]
Get historical data for a specific sensor from a specific date to a specific date
### Parameters:
* ```id``` is the sensor id
* ```startdate``` is the start date
* ```enddate``` is the end date

### Output:
A json object with all the data, consisting of the following fields:
* ```Time``` is the date
* ```SensorID``` is the sensor id
* ```Temperature``` is the temperature
* ```Humidity``` is the humidity

#### Example:
```json
[
    {
        "Time": "2021-06-01 12:00:00",
        "SensorID": 1,
        "Temperature": 20.0,
        "Humidity": 50.0
    },
    {
        "Time": "2021-06-01 12:01:00",
        "SensorID": 1,
        "Temperature": 20.1,
        "Humidity": 50.1
    }
]
```


## GET: ```/web/getsensordata``` [NOT IMPLEMENTED]
Get the latest sensor data for a specific sensor

### Parameters:
* ```id``` is the sensor id

### Output:
A json object with asingle record of the latest data, consisting of a single record with the following fields:
* ```Time``` is the date
* ```SensorID``` is the sensor id
* ```Temperature``` is the temperature
* ```Humidity``` is the humidity

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
* ```ID``` is the sensor id
* ```Name``` is the sensor name
* ```Status``` is the sensor status
    * 0 = Offline
    * 1 = Online
    * 2 = Unknown Error
    * 3 = Sensor Error
* ```LastStatus``` is the time of the last heartbeat

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
* ```Time``` is the date
* ```Type``` is the log type
    * 0 = Info
    * 1 = Warning
    * 2 = Error
* ```Message``` is the log message

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