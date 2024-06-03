import express, {
    Express,
    NextFunction,
    Request,
    Response,
    Router,
} from 'express';
import cors from 'cors';
import { ErrorHandler, NotFoundError } from '@module/Error';
import { MakeDebit } from '@module/Service/DebitService';
import { consumeMail, consumeSms } from '@module/Queue/NotificationQueue';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = Router();

// assumes that the auths are working and the user is already authorized to use this endpoint
router.post(
    '/make-debit',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await MakeDebit(req.body.data);
            res.send({ success: true, message: 'Debit successful' });
        } catch (error) {
            next(error);
        }
    },
);

app.use('/api', router);
consumeMail();
consumeSms();

app.use((req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError());
});

app.use(ErrorHandler);

export default app;
