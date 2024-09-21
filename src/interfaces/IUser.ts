import { Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    id: string;
    password: string;
}
