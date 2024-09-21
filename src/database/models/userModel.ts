import mongoose from 'mongoose';
import type { IUser } from '../../interfaces/IUser';
const UserSchema: mongoose.Schema<IUser> = new mongoose.Schema({
	id: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true }
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
