import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { PORT } from './config.js';
import adminRoutes from './routers/adminRoutes.js';
import driverRoutes from './routers/driverRoutes.js';
import historyRoutes from './routers/historyRoutes.js';
import taxiStandRoutes from './routers/taxiStandRoutes.js';
import userRoutes from './routers/userRoutes.js';
import contactRoutes from './routers/contactRoutes.js';
import ratingRoutes from './routers/ratingRoutes.js';
import linkRoutes from './routers/linkRoutes.js';
import http from 'http';
import logger from './middleware/logger.js';

import errorHandler from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import corsOptions from './config/corsOptions.js';
import connectDB from './config/dbConn.js';
import logEvents from './middleware/logger2.js';

const app = express();

app.use(express.json());
// Apply CORS with options here
app.use(cors(corsOptions));
// app.use(cors({ origin: 'https://medix-backend-k0q1.onrender.com' }));
app.use(cookieParser());
app.use(logger);

console.log(process.env.NODE_ENV);

connectDB();

mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to DB'))
.catch(error => console.error('Connection to DB failed:', error));

// Define your routes
app.use('/Admin', adminRoutes);
app.use('/Driver', driverRoutes);
app.use('/History', historyRoutes);
app.use('/TaxiStand', taxiStandRoutes);
app.use('/User', userRoutes);
app.use('/contacts', contactRoutes);
app.use('/rating', ratingRoutes);
app.use('/links', linkRoutes);

// Add the /data route here
app.get('/data', (req, res) => {
    console.log('Data endpoint hit');
    res.json({ message: 'Data fetched successfully', data: [] });
});

app.get('/', (req, res) => {
    console.log(req);
    return res.status(200).send('Welcome To MedixPlus');
});

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`App is listening on port: ${PORT}`);
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
});
