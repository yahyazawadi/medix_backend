require('dotenv').config()
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { PORT } from './config.js';
import adminRoutes from './routers/adminRoutes.js';
import driverRoutes from './routers/driverRoutes.js';
import historyRoutes from './routers/historyRoutes.js';
import taxiStandRoutes from './routers/taxiStandRoutes.js';
import userRoutes from './routers/userRoutes.js';
import contactRoutes from './routers/ContactRoutes.js';
import ratingRoutes from './routers/ratingRoutes.js';
import linkRoutes from './routers/linkRoutes.js'; // Ensure this is correctly imported
import http from 'http';
require('dotenv').config()

const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500
const app = express();

app.use(express.json());
app.use(cors());

console.log(process.env.NODE_ENV)

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))
mongoose.connect('mongodb+srv://saifalaa099:aZ9FVwl38JHHi6jd@taxigo.fz7h5jg.mongodb.net/?retryWrites=true&w=majority&appName=taxigo', {
  useNewUrlParser: true, // These options can be omitted if you're using the latest version of mongoose
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB'))
.catch(error => console.error('Connection to DB failed:', error));

app.use('/Admin', adminRoutes);
app.use('/Driver', driverRoutes);
app.use('/History', historyRoutes);
app.use('/TaxiStand', taxiStandRoutes);
app.use('/User', userRoutes);
app.use('/contacts', contactRoutes); 
app.use('/rating', ratingRoutes);
app.use('/links', linkRoutes); // Add this line to use linkRoutes

app.get('/', (req, res) => {
  console.log(req);
  return res.status(200).send('Welcome To TaxiGo');
});

const server = http.createServer(app);


server.listen(PORT, () => {
  console.log(`App is listening on port: ${PORT}`);
});
app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
