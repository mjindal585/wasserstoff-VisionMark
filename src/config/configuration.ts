import { config } from 'dotenv';

config();

const envVars = process.env;

const configuration: IConfig = Object.freeze({
    PORT: envVars.PORT,
    NODE_ENV: envVars.NODE_ENV,
    MONGO_URL: envVars.MONGO_URL,
    KEY: envVars.KEY,
    PASSWORD: envVars.PASSWORD
});

export default configuration;
