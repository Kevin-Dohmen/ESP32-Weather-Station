import express, { Application } from 'express';
import v2webRoutes from './routes/webRoutes';
import v2sensorRoutes from './routes/sensorRoutes';
import sensorAuth from './middleware/sensorAuth';

const app: Application = express();

app.use(express.json());
// v1 routes

// v2 api routes
app.use('/web', v2webRoutes);
app.use('/sensor', sensorAuth, v2sensorRoutes);

app.use('/', (req, res) => {
    res.send('Welcome to the API');
});

export default app;