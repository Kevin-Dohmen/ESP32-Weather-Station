// this script will be used to handle all the data requests from server to the sensors
// it does this by sending a get request to the sensor server and then sending the data back to the client
// multiple sensors may be connected to the server and the server will be able to handle all the requests from the sensors in the database

const axios = require('axios');
const mysql = require('mysql');
const fs = require('fs');
const { get } = require('http');

let startTime = new Date().getTime();

let x = false;

// read the config.json file
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// get the host from the config
const dbconf = config.db;

// initialize the database connection
const db = mysql.createConnection({
    host: dbconf.host,
    port: dbconf.port,
    user: dbconf.user,
    password: dbconf.password,
    database: dbconf.database
});

// connect to the database
// db.connect((err) => {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }
//     console.log('connected as id ' + db.threadId);
// });


dbConnectionChecker();

// function to save the data to the database
function saveDataToDB(sensorID, data) {
    db.query('INSERT INTO TempHumData (SensorID, Temperature, Humidity) VALUES (?, ?, ?)', [sensorID, data.temperature, data.humidity], (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Data saved to database');
        console.log(results);
    });
}

// function to get the sensor data
function getSensorData(sensor) {
    let host = sensor.host;
    console.log('http://' + host + '/getSensor');
    axios.get('http://' + host + '/getSensor') // Add a forward slash before 'getSensor'
        .then(response => {
            // handle the response here
            // you can access the data from the response using response.data
            // for example, you can log the data to the console
            console.log(response.data);
            // save the data to the database
            saveDataToDB(sensor.id, response.data);
        })
        .catch(error => {
            // handle any errors that occur during the request
            console.error(error);
        });
}

function sensorManager(sensors) {
    sensors.forEach(sensor => {
        // get the sensor data for each sensor
        getSensorData(sensor);
        // set an interval to get the sensor data every sensor.interval milliseconds
        setInterval(() => {
            getSensorData(sensor);
        }, sensor.interval * 1000);
    });

    // check state of every sensor every 5 seconds

    setInterval(() => {
        sensors.forEach(sensor => {
            let host = sensor.host;
            axios.get('http://' + host + '/status', { timeout: 1000 })
                .then(response => {
                    // handle the response here
                    // codes: 200 - OK, 200 - USB connected, 500 - Sensor error
                    // console.log(response.data);

                    // save the data to the database
                    if (response.data == 500) {
                        console.log("Sensor error");
                        db.query('UPDATE Sensor SET Status = ? WHERE ID = ?', ["Sensor error", sensor.id], (err, results) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            console.log('Sensor error on sensor ' + sensor.id);
                            console.log(results);
                        });
                    } else {
                        db.query('UPDATE Sensor SET Status = ? WHERE ID = ?', ["Online", sensor.id], (err, results) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            // console.log('Sensor success on sensor ' + sensor.id);
                        });
                    }
                })
                .catch(error => {
                    // handle any errors that occur during the request
                    console.error(error);
                    // save the data to the database

                    if (error.response && error.response.status) {
                        if (error.response.status == 500) {
                            console.log("Sensor error");
                            db.query('UPDATE Sensor SET Status = ? WHERE ID = ?', ["Sensor error", sensor.id], (err, results) => {
                                if (err) {
                                    console.error(err);
                                    return;
                                }
                                console.log('Sensor error on sensor ' + sensor.id);
                                console.log(results);
                            });
                        }
                    } else {
                        db.query('UPDATE Sensor SET Status = ? WHERE ID = ?', ["Offline", sensor.id], (err, results) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            console.log('Sensor ' + sensor.id + ' is offline');
                            console.log(results);
                        });
                    }
                });
        });
    }, 5000);
}

// function to get all the sensors, their hosts and intervals from the database
function getSensors() {
    db.query('SELECT * FROM Sensor', (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        // loop through the results and call the getSensor function for each sensor
        sensors = []
        results.forEach(sensor => {
            let tmpObj = {
                id: sensor.ID,
                host: sensor.Host,
                interval: sensor.Interval,
                lastSuccess: sensor.LastSuccess
            }
            sensors.push(tmpObj);
        });
        console.log(sensors);

        sensorManager(sensors);
    });
}

function dbConnectionChecker() {
    // checks if the connection to the database is still alive
    // if not, reconnect
    function checkConnect() {
        db.query('SELECT 1', (err, results) => {
            if (err) {
                console.error(err);
                db.connect((err) => {
                    if (err) {
                        console.error('error connecting: ' + err.stack);
                        return;
                    }
                    console.log('connected as id ' + db.threadId);
                });
            }
        });
    }

    checkConnect();

    setInterval(() => {
        checkConnect();
    }, 60000);
}

console.log("Starting stuff");
// call the getSensors function to get the sensor data
getSensors();
