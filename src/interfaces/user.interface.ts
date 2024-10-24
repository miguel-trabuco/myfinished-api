import { Document } from 'mongoose';

export interface User extends Document {
    userID: string;
    name: string;
    email: string;
    passwordHash: string;
}
