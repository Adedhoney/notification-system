// These will mimmick the get user and user Information services

export interface IUser {
    userId: string;
    firstName: string;
    lastname: string;
    email: string;
    phone: string;
}

export interface IWallet {
    userId: string;
    walletId: string;
    walletBalance: number;
}

const testUserId = '123-sjdfjd9-s6762g3-676536y6w';

export const getUser = async (userId: string): Promise<IUser> => {
    try {
        if (testUserId !== userId) {
            // error
        }
        return {
            userId: '123-sjdfjd9-s6762g3-676536y6w',
            firstName: 'Adedoyin',
            lastname: 'Adeyemi',
            email: 'doyinadeyemi2000@gmail.com',
            phone: '+2347054685448',
        } as IUser;
    } catch (error) {
        throw error;
    }
};

export const getUserWallet = async (userId: string): Promise<IWallet> => {
    try {
        if (testUserId !== userId) {
            // error
        }
        return {
            userId: '123-sjdfjd9-s6762g3-676536y6w',
            walletId: 'thisis-just456-a-test-i166',
            walletBalance: 500,
        } as IWallet;
    } catch (error) {
        throw error;
    }
};
