import mongoose from 'mongoose';

import config from '../config';
import logger from '../library/logger';

const mongoConn = () => {
    mongoose.set('strictQuery', true);
    mongoose
        .connect(config.databaseURL, { retryWrites: true, w: 'majority' })
        .then(() => {
            logger.info('Connected to MongoDB.');
        })
        .catch((error) => {
            logger.error('Unable to connect to MongoDB');
            logger.error(error);
            process.exit();
        });
};

export default mongoConn;
