import app from './app';
import connectDatabase from './database/connectDatabase';
import 'dotenv/config';

connectDatabase();

const PORT: string = process.env.PORT || '3000';

app.listen(PORT, () => {
	console.log('Server on');
});
