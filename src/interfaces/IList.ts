import { Document } from 'mongoose';

export interface IList extends Document {
    id: string;
    name: string;
    userID: string;
    itemsAmount: number;
}
