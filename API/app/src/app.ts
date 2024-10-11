import express, { Application } from 'express';
import v2dataRoutes from './routes/dataRoutes';
import v2sensorRoutes from './routes/sensorRoutes';

const app: Application = express();

app.use(express.json());
// v1 routes

// v2 api routes
app.use('/data', v2dataRoutes);
app.use('/sensor', v2sensorRoutes);

app.use('/', (req, res) => {
    res.send('Welcome to the API');
});

export default app;