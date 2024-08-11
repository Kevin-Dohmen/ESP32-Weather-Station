# API documentation
This is the API documentation for the project.

## Endpoints
- [GET /](#GET-/)
- [GET /getSensors](#getSensors)
- [GET /getSensorData/:id](#getSensorData)
- [GET /getCurrentSensorData/:id](#getCurrentSensorData)
- [GET /getHistoricalData/:id/:days](#getHistoricalData)

## GET /
```/```
This is the root endpoint. It returns a welcome message.

### Response
```Hello World!```

## GET /getSensors
```/getSensors```
This endpoint returns a list of all sensors.

### Response
```json
[
    {
        "ID": 1,
        "Name": "TestSensor",
        "Host": "1.1.1.1",
        "Interval": 300,
        "Status": "Online",
        "StatusTime": null
    },
    {
        "ID": 2,
        "Name": "TestSensor2",
        "Host": "1.1.1.2",
        "Interval": 300,
        "Status": "Online",
        "StatusTime": null
    }
]
```

## GET /getSensorData/:id
```/getSensorData/:id```
This endpoint returns the data for a specific sensor.

### Parameters
- id: The id of the sensor

### Response
```json
[
    {
        "Time": "2024-08-02T18:40:39.000Z",
        "Temperature": 27.9,
        "Humidity": 39,
        "SensorID": 1
    }
]
```

## GET /getCurrentSensorData/:id
```/getCurrentSensorData/:id```
This endpoint returns the current data for a specific sensor.

### Parameters
- id: The id of the sensor

### Response
```json
{
    "temperature": "28.00",
    "humidity": "40"
}
```

## GET /getHistoricalData/:id/:days
```/getHistoricalData/:id/:days```
This endpoint returns the historical data for a specific sensor.

### Parameters
- id: The id of the sensor
- days: The number of days of data to return

### Response
```json
[
  {
    "Time": "2024-08-02T15:55:39.000Z",
    "Temperature": 27.7,
    "Humidity": 40,
    "SensorID": 1
  },
  {
    "Time": "2024-08-02T16:00:39.000Z",
    "Temperature": 28.2,
    "Humidity": 39,
    "SensorID": 1
  }
]
```
