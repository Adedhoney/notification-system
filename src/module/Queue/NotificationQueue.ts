import { email, sms } from '@infrastructure/Notification/Notification';
import { Queue } from '@infrastructure/Queue';
import { ConsumeMessage } from 'amqplib';
import config from 'config';

const queue = new Queue(config.RABBIT_MQ_URL);

interface mailInfo {
    email: string;
    firstName: string;
    amount: number;
    date: string;
    trials: number;
}

interface smsInfo {
    phone: string;
    firstName: string;
    amount: number;
    date: string;
    trials: number;
}

export const publishMail = async (data: mailInfo) => {
    await queue.publish('insufficient_email', data);
};

export const publishSMS = async (data: smsInfo) => {
    await queue.publish('insufficient_sms', data);
};

export const consumeMail = async () => {
    try {
        await queue.consume(
            'insufficient_email',
            async (msg: ConsumeMessage | null) => {
                if (msg?.content) {
                    const data = JSON.parse(msg.content.toString()) as mailInfo;
                    try {
                        const html = getHTML(
                            data.firstName,
                            data.date,
                            data.amount,
                        );
                        const message = `Your Debit of ${data.amount} failed due to insufficient balance in your wallet`;
                        const subject = 'Failed Debit';
                        await email({
                            to: data.email,
                            message,
                            subject,
                            text: '',
                            html,
                        });
                        console.log('Consumed mail notification');
                    } catch (error) {
                        console.log('published again');
                        if (data.trials < 2) {
                            publishMail({ ...data, trials: data.trials + 1 });
                            return;
                        }
                        throw new Error('Mail send failed');
                    }
                }
            },
            true,
        );
    } catch (error) {
        console.log(error);
    }
};
export const consumeSms = async () => {
    try {
        await queue.consume(
            'insufficient_sms',
            async (msg: ConsumeMessage | null) => {
                if (msg?.content) {
                    const data = JSON.parse(msg.content.toString()) as smsInfo;
                    try {
                        const message = getSMS(
                            data.firstName,
                            data.date,
                            data.amount,
                        );
                        await sms({ to: data.phone, message });
                        console.log('Consumed mobile notification');
                    } catch (error) {
                        if (data.trials < 2) {
                            publishSMS({ ...data, trials: data.trials + 1 });
                            return;
                        }
                        throw new Error('SMS send failed');
                    }
                }
            },
            true,
        );
    } catch (error) {
        console.log('failed');
    }
};

const getSMS = (name: string, date: string, amount: number) => {
    return `Debit Failed!
    Dear ${name}, your recent debit of ${amount} on ${date} failed due to insufficient balance in your wallet. Please add funds and try again. For assistance, contact StackIvy Support.`;
};

const getHTML = (name: string, date: string, amount: number) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Debit Failure Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            line-height: 1.6;
        }
        .container {
            width: 80%;
            margin: auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #0073e6;
            color: #fff;
            padding: 10px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            color: #fff;
            background-color: #0073e6;
            text-align: center;
            border-radius: 5px;
            text-decoration: none;
        }
        .footer {
            text-align: center;
            padding: 10px;
            color: #777;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Debit Failed</h1>
        </div>
        <div class="content">
            <p>Dear ${name},</p>
            <p>We regret to inform you that your recent debit transaction on ${date} for the amount of ${amount} has failed due to insufficient balance in your wallet.</p>
            <p>To ensure uninterrupted service, please add sufficient funds to your wallet and attempt the transaction again.</p>
            <p>If you have any questions or need assistance, please do not hesitate to contact our support team.</p>
            <p>Thank you for your understanding.</p>
            <p>Best regards,</p>
            <p>StackIvy</p>
            <a href="[Support Link]" class="button">Contact Support</a>
        </div>
        <div class="footer">
            <p>&copy; 2024 StackIvy. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};
