import dotenv from 'dotenv';

dotenv.config();

const envs = [
    'RABBIT_MQ_URL',
    'PORT',
    'NODE_ENV',
    'SMTP_HOST',
    'AUTH_EMAIL',
    'AUTH_EMAIL_PASSWORD',
    'TWILIO_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE',
];

envs.forEach((value, index) => {
    if (!process.env[envs[index]]) {
        const message = 'Fatal Error: env ' + envs[index] + ' not define';

        throw new Error(message);
    }
});

export default {
    ENVIRONMENT: process.env.NODE_ENV,
    PORT: Number(process.env.PORT),
    SMTP: {
        HOST: process.env.SMTP_HOST as string,
        EMAIL: process.env.AUTH_EMAIL as string,
        PASSWORD: process.env.AUTH_EMAIL_PASSWORD as string,
    },
    TWILIO: {
        SID: process.env.TWILIO_SID as string,
        AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN as string,
        PHONE: process.env.TWILIO_PHONE as string,
    },
    RABBIT_MQ_URL: process.env.RABBIT_MQ_URL as string,
};
