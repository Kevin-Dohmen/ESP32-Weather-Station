const fs = require('fs');
const express = require('express');
const mysql = require('mysql');
const axios = require('axios');

// endpoints:
// GET /getHistoricalData/:id/:days
// GET /getSensorData/:id
// GET /getSensors
// GET /getCurrentSensorData/:id


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
// db.connect((err) => {
//   if (err) {
//       console.error('error connecting: ' + err.stack);
//       return;
//   }
//   console.log('connected as id ' + db.threadId);
// });

dbConnectionChecker();

// initialize the express app
const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// funciton to fetch the sensor data from the database
app.get('/getHistoricalData/:id/:days', (req, res) => {
  const id = req.params.id;
  const days = req.params.days;
  if (days > 0 && days <= 30) {
    const timeFrame = new Date();
    timeFrame.setDate(timeFrame.getDate() - days);

    db.query('SELECT * FROM TempHumData WHERE SensorID = ? AND Time >= ? ORDER BY Time ASC', [id, timeFrame], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error fetching data');
        return;
      }
      res.send(results);
    });
  } else {
    res.status(400).send('Invalid time frame');
  }
});

// function to fetch the latest sensor data from the database
app.get('/getSensorData/:id', (req, res) => {
  const id = req.params.id;

  db.query('SELECT * FROM temphumdata WHERE SensorID = ? ORDER BY Time DESC LIMIT 1', [id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.send(results);
  });
});

// function to fetch the sensors from the database
app.get('/getSensors', (req, res) => {
  db.query('SELECT ID, Name, `Interval`, Status FROM Sensor', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.send(results);
  });
});

// function to get the current data from a sensor
app.get('/getCurrentSensorData/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM Sensor WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching data');
      return;
    }
    if (!results || results.length === 0) {
      res.status(404).send('Sensor not found');
      return;
    }
    const sensor = results[0];
    
    axios.get('http://' + sensor.Host + '/getSensor')
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error fetching data');
    });
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// start the express app
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

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

// while (true) {
//     setInterval(async () => {
//         try {
//             const response = await axios.get('http://192.168.3.6/getSensor');
//             console.log(response);
//         } catch (error) {
//             console.error(error);
//         }
//     }, 1000);
// }
