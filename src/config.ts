import dotenv from 'dotenv';

dotenv.config();

const envs = [
    'RABBIT_MQ_URL',
    'PORT',
    'NODE_ENV',
    'SMTP_HOST',
    'AUTH_EMAIL',
    'AUTH_EMAIL_PASSWORD',
    'TERMII_SMS_ENDPOINT',
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
    TERMII: {
        ENDPOINT: process.env.TERMII_SMS_ENDPOINT as string,
        KEY: process.env.TERMII_API_KEY,
    },
    RABBIT_MQ_URL: process.env.RABBIT_MQ_URL as string,
};
