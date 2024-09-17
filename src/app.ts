import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';

//Import types
import { Application } from 'express';

const app: Application = express();

//App config
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const PORT: string = process.env.PORT as string;
app.listen(PORT, () => {
	console.log('Server on');
});
