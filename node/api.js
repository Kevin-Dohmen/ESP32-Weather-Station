const fs = require('fs');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// endpoints:
    // webInterface:
    // GET /getHistoricalData/:id/:days
    // GET /getSensorData/:id
    // GET /getSensors
    // GET /getCurrentSensorData/:id
    // 
    // Sensor:
    // POST /status
    // POST /data
    // GET /config/:apikey

// read the config.json file
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// get the database config
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
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');

    // check database connection periodically
    setInterval(() => {
        db.ping((err) => {
            if (err) {
                console.error('Lost connection to database:', err);
                db.connect((err) => {
                    if (err) {
                        console.error('Error reconnecting to database:', err);
                        return;
                    }
                    console.log('Reconnected to database');
                });
            }
        });
    }, 5000); // check every 5 seconds
});

// initialize the express app
const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
// app.use(bodyParser.json());


// function to fetch the sensor data from the database
app.get('/getHistoricalData/:id/:days', (req, res) => {
    const id = req.params.id;
    const days = req.params.days;
    if (days > 0 && days <= 30) {
        const timeFrame = new Date();
        timeFrame.setDate(timeFrame.getDate() - days);

        db.query('SELECT * FROM Data WHERE SensorID = ? AND Time >= ? ORDER BY Time ASC', [id, timeFrame], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error fetching data');
                return;
            }
            res.send(results);
        });
    } else {
        res.status(400).send('Invalid days parameter');
    }
});

// function to fetch the latest sensor data from the database
app.get('/getSensorData/:id', (req, res) => {
    const id = req.params.id;

    db.query('SELECT * FROM Data WHERE SensorID = ? ORDER BY Time DESC LIMIT 1', [id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching data');
            return;
        }
        res.send(results);
    });
});

// function to fetch all sensors from the database
app.get('/getSensors', (req, res) => {
    db.query('SELECT * FROM Sensor', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching data');
            return;
        }
        res.send(results);
    });
});

// function to fetch the latest sensor data from the database
app.get('/getCurrentSensorData/:id', (req, res) => {
    const id = req.params.id;

    db.query('SELECT * FROM Data WHERE SensorID = ? ORDER BY Time DESC LIMIT 1', [id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching data');
            return;
        }
        res.send(results);
    });
});

// function to fetch the config for the API
app.get('/config/:apikey', (req, res) => {
    const apikey = req.params.apikey;

    db.query('SELECT * FROM Sensor WHERE APIKey = ?', [apikey], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching data');
            return;
        }
        if (!results || results.length === 0) {
            res.status(404).send('API key not found');
            return;
        }
        db.query('SELECT * FROM SensorConfig WHERE SensorID = ?', [results[0].ID], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error fetching data');
                return;
            }
            res.send(results[0]);
        });
    });
});

// function to handle sensor status updates
app.post('/status', express.json(), (req, res) => {
    console.log(req.body);
    data = req.body;
    
    let apikey = data.api_key;
    console.log('API Key:', apikey);
    let rawstatus = data.status;
    console.log('Status:', rawstatus);

    let status = '';
    switch (rawstatus) {
        case 0:
            status = "Online";
            break;
        case 1:
            status = "Unknown Error";
            break;
        case 2:
            status = "Sensor Error";
            break;
    }

    // set status and update time in the database
    db.query('UPDATE Sensor SET Status = ?, LastStatus = NOW() WHERE APIKey = ?', [status, apikey], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating status');
            return;
        }
    });

    res.send('ok');
});

// function to handle sensor data updates
app.post('/data', express.json(), (req, res) => {
    let data = req.body;
    if (data.length === 0) {
        res.status(400).send('No data received');
        return;
    }
    let temp = data.temperature/1000;
    let hum = data.humidity/1000;
    console.log('Temperature:', temp, '°C');
    console.log('Humidity:', hum, '%');
    let apikey = data.api_key;
    console.log('API Key:', apikey);

    // get the sensor ID from the API key
    db.query('SELECT ID FROM Sensor WHERE APIKey = ?', [apikey], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching data');
            return;
        }
        if (!results || results.length === 0) {
            res.status(404).send('API key not found');
            return;
        }
        let sensorID = results[0].ID;

        // insert the data into the database
        db.query('INSERT INTO Data (SensorID, Temperature, Humidity) VALUES (?, ?, ?)', [sensorID, temp, hum], (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error inserting data');
                return;
            }
            res.send('ok');
        });
    });
});

// function to handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});
  
// start the express app
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

// sensor status check (every 60 seconds)
setInterval(() => {
    console.log('Checking sensor status');
    db.query('SELECT * FROM Sensor WHERE LastStatus < DATE_SUB(NOW(), INTERVAL 60 SECOND)', (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        results.forEach((sensor) => {
            console.log('Sensor', sensor.ID, 'is offline');
            db.query('UPDATE Sensor SET Status = ?, LastStatus = NOW() WHERE ID = ?', ['Offline', sensor.ID], (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        });
    });
}
, 60000); // check every 60 seconds
