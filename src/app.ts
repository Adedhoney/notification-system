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
import { consumeMail } from '@module/Queue/NotificationQueue';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = Router();
// assumes that the auths are working and the user is already authorized to use this endpoint
router.post(
    '/make-debit',
    async (req: Request, res: Response, next: NextFunction) => {
        MakeDebit(req.body.data);
    },
);

app.use('/api', router);
consumeMail();

app.use((req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError());
});

app.use(ErrorHandler);

export default app;
