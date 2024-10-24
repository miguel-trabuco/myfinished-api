import { Document } from 'mongoose';

export interface List extends Document {
    name: string;
    userID: string;
    listID: string;
    itemsAmount: number;
}
