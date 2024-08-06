import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
    const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`;

    try {
        if (!fs.existsSync(path.join(path.resolve(), 'logs'))) {
            await fsPromises.mkdir(path.join(path.resolve(), 'logs'));
        }
        await fsPromises.appendFile(path.join(path.resolve(), 'logs', logFileName), logItem);
    } catch (err) {
        console.log(err);
    }
};

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log');
    console.log(`${req.method} ${req.path}`);
    next();
};

export default logger;
