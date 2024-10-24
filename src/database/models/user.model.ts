import mongoose from 'mongoose';
import type { User } from '../../interfaces/index';

const UserSchema: mongoose.Schema<User> = new mongoose.Schema({
	userID: { type: String, required: true },
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	passwordHash: { type: String, required: true }
});

export const UserModel = mongoose.model<User>('User', UserSchema);
