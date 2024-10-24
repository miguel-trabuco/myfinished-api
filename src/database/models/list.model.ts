import mongoose from 'mongoose';
import type { List } from '../../interfaces/index';

const ListSchema: mongoose.Schema<List> = new mongoose.Schema({
	name: { type: String, required: true },
	userID: { type: String, required: true },
	itemsAmount: { type: Number, required: true }
});

export const ListModel = mongoose.model<List>('List', ListSchema);
