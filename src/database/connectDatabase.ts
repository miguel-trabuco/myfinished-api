import mongoose from 'mongoose';

export async function connectDatabase(): Promise<void> {
	const DATABASE_URL = process.env.DATABASE_URL;
    
	if(!DATABASE_URL) throw new Error('Datbase url is undefined');

	try {
		await mongoose.connect(DATABASE_URL);
		console.log('Database connected');
	} catch (error) {
		console.error(error);
	}
}
