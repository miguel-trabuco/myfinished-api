//Import Libs
import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';

//Import Components
import connectDatabase from './database/connectDatabase';

//Import types
import { Application } from 'express';

const app: Application = express();

//App config
app.use(express.json());
app.use(cors());
app.use(cookieParser());

connectDatabase();

const PORT: string | undefined = process.env.PORT;

if(PORT === undefined) {
	throw new Error('Port is undefined');
}

app.listen(PORT, () => {
	console.log('Server on');
});
