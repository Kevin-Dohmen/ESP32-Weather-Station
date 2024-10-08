# Commands:
## WebInterface
### ```GET /getHistoricalData/:id/:days```
Get historical data for a specific sensor
#### Parameters:
* ```id``` is the sensor id  
* ```days``` is the amount of days to get data from

### ```GET /getSensorData/:id```
Get the latest sensor data for a specific sensor
#### Parameters:
* ```id``` is the sensor id

### ```GET /getSensors```
Get all sensors

### ```GET /getCurrentSensorData/:id```
Get the current sensor data for a specific sensor
#### Parameters:
* ```id``` is the sensor id

### ```GET /logs```
Get all logs

## Sensor
### ```GET /config/:apikey```
Get the configuration for a specific sensor
#### Parameters:
* ```apikey``` is the sensor apikey

### ```POST /status``` (heartbeat)
Update the status of a specific sensor
#### Parameters: (sent via json)
* ```apikey``` is the sensor apikey
* ```status``` is the status
    * 0 = Online
    * 1 = Unknown
    * 2 = Sensor Error

### ```POST /data```
Update the data of a specific sensor
#### Parameters: (sent via json)
* ```apikey``` is the sensor apikey
* ```temperature``` is the current temperature
* ```humidity``` is the current humidity