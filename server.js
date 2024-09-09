
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { PORT } from './config.js';
import adminRoutes from './routers/adminRoutes.js';
import authRoutes from './routers/authRoutes.js';
import driverRoutes from './routers/driverRoutes.js';
import historyRoutes from './routers/historyRoutes.js';
import taxiStandRoutes from './routers/taxiStandRoutes.js';
import userRoutes from './routers/userRoutes.js';
import contactRoutes from './routers/contactRoutes.js';
import ratingRoutes from './routers/ratingRoutes.js';
import linkRoutes from './routers/linkRoutes.js';
import http from 'http';
import { logger, logEvents } from './middleware/logger.js'; // Named imports for both functions
//import logger from './middleware/logger.js';
//import logEvents from './middleware/logger2.js';
//import dataRoutes from './routers/dataRoutes.js'; // New import
import errorHandler from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
//import corsOptions from './config/corsOptions.js';
import connectDB from './config/dbConn.js';

const app = express();
const corsOptions = {
    origin: ['http://localhost:3000', 'https://medix-frontend-i0pq.onrender.com'],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.) to be sent
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  
  app.use(cors(corsOptions));
app.use(express.json());
// Apply CORS with options here
app.use(cors(corsOptions));
// app.use(cors({ origin: 'http://localhost:5001' }));

app.use(cookieParser());
app.use(logger);
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    //console.log('Headers:', req.headers);
    next();
  });
  
console.log(process.env.NODE_ENV);

connectDB();

mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to DB'))
.catch(error => console.error('Connection to DB failed:', error));
  
// Define your routes
app.use('/auth', authRoutes);
app.use('/Admin', adminRoutes);
app.use('/Driver', driverRoutes);
app.use('/History', historyRoutes);
app.use('/TaxiStand', taxiStandRoutes);
app.use('/User', userRoutes);
app.use('/contacts', contactRoutes);
app.use('/rating', ratingRoutes);
app.use('/links', linkRoutes);

app.use(cookieParser());

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
});/*
axios.post('http://localhost:3000/auth', {
    email: 'example@example.com',
    password: 'yourPassword'
}, {
    withCredentials: true // This is required to send cookies
});*/
import User from './models/User.js'; // Make sure the path is correct

mongoose.connection.once('open', async () => {
    
    // Fetch all users and log them
    try {
        const allUsers = await User.find(); // Fetch all users from the 'Users' collection
        console.log('All Users:', allUsers); // Log all users
    } catch (error) {
        console.error('Error fetching users:', error);
    }
});
