import { Document } from 'mongoose';

export interface IItem extends Document {
    name: string;
    listID: string;
    status: string;
}
