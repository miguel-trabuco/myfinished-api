//Import Libs
import express, { request } from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';

//Import Components
import connectDatabase from './database/connectDatabase';
import userRouter from './routes/userRouter';

//Import types
import { Application } from 'express';

const app: Application = express();

//App config
app.use(express.json());
app.use(cors());
app.use(cookieParser());

connectDatabase();

//Config routes
app.get('/', (request: express.Request, response: express.Response) => {
	return response.status(200).json({ message: 'Server working' });
});

app.use('/user', userRouter);

const PORT: string | undefined = process.env.PORT;

if (PORT === undefined) {
	throw new Error('Port is undefined');
}

app.listen(PORT, () => {
	console.log('Server on');
});
