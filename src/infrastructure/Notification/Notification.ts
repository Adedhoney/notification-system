import config from 'config';
import { Transporter, createTransport } from 'nodemailer';
import axios from 'axios';

export const sms = async (params: SmsParams): Promise<void> => {
    await axios.post(config.TERMII.ENDPOINT, {
        api_key: config.TERMII.KEY,
        to: params.to,
        from: 'StackIvy',
        sms: params.message,
        type: 'plain',
        channel: 'generic',
    });
};
export const email = async (params: MailParams): Promise<void> => {
    const mail = new MailService();
    const options = {
        from: 'From MyResumeAI',
        to: params.to,
        subject: params.subject as string,
        text: params.text,
        html: params.html as string,
    };

    await mail.sendMail(options);
};

export type MailParams = {
    to: string;
    message: string;
    subject?: string;
    text?: string;
    html?: string;
};
export type SmsParams = {
    to: string;
    message: string;
};

type MailInterface = {
    from: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    text?: string;
    html: string;
};

class MailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = createTransport({
            host: config.SMTP.HOST,
            auth: {
                user: config.SMTP.EMAIL,
                pass: config.SMTP.PASSWORD,
            },
        });
    }

    async sendMail(options: MailInterface): Promise<void> {
        try {
            const send = await this.transporter.sendMail(options);
            console.log('Mail sent successfully!!');
            console.log(
                `[Mail response=] ${send.response} [MessageId=] ${send.messageId}`,
            );
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }
}
