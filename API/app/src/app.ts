import express, { Application } from 'express';
import { SensorAuth } from './middleware/sensorAuth';
import v2Routes from './routes/v2Routes';

const app: Application = express();

app.use(express.json());
// v1 routes

// v2 api routes
app.use('/v2', v2Routes);

app.use('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #121212;
                    }
                    .container {
                        text-align: center;
                        padding: 20px;
                        border: 2px solid #BB86FC;
                        border-radius: 10px;
                        background-color: #1E1E1E;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    }
                    h1 {
                        color: #BB86FC;
                    }
                    p {
                        color: #E0E0E0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Welcome to the API</h1>
                    <p>Your gateway to awesome data!</p>
                </div>
            </body>
        </html>
    `);
});

export default app;