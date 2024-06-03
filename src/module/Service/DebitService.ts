import { getUser, getUserWallet } from '@infrastructure/ExternalService/user';
import { CustomError } from '@module/Error';
import { publishMail, publishSMS } from '@module/Queue/NotificationQueue';

interface DebitDTO {
    userId: string;
    amount: number;
    notificationType: string;
}
enum NotificationType {
    EMAIL = 'EMAIL',
    MOBILE = 'MOBILE',
}

export const MakeDebit = async (data: DebitDTO): Promise<void> => {
    const user = await getUser(data.userId);

    if (!user) {
        throw new CustomError('User not found', 404);
    }

    const userWallet = await getUserWallet(data.userId);
    const date = new Date().toLocaleDateString();

    if (data.amount <= userWallet.walletBalance) {
        // makes debit and returns
        return;
    }

    // if it reaches here, then the wallet didn't have enough balance to cover the debit
    if (data.notificationType === NotificationType.EMAIL) {
        await publishMail({
            email: user.email,
            firstName: user.firstName,
            amount: data.amount,
            date,
            trials: 0,
        });
    } else if (data.notificationType === NotificationType.MOBILE) {
        await publishSMS({
            phone: user.phone,
            firstName: user.firstName,
            amount: data.amount,
            date,
            trials: 0,
        });
    }
    throw new CustomError('Debit failed due to insufficient balace', 200);
};
