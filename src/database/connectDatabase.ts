import mongoose from 'mongoose';

export default async function connectDatabase(): Promise<void> {
	const DATABASE_URL: string | undefined = process.env.DATABASE_URL;
    
	if(DATABASE_URL === undefined) {
		throw new Error('Datbase url is undefined');
	}

	try {
		mongoose.connect(DATABASE_URL);
		console.log('Database connected');
	} catch (error) {
		console.error(error);
	}
}
