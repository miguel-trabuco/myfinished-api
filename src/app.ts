import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/userRouter';
import { Application } from 'express';

const app: Application = express();

//App config
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//Config routes
app.get('/', (request: express.Request, response: express.Response) => {
	return response.status(200).json({ message: 'Server working' });
});

app.use('/user', userRouter);

export default app;
