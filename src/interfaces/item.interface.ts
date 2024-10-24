import { Document } from 'mongoose';

export interface Item extends Document {
    name: string;
    listID: string;
    status: string;
}
