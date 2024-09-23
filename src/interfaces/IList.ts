import { Document } from 'mongoose';

export interface IList extends Document {
    name: string;
    userID: string;
    itemsAmount: number;
}
