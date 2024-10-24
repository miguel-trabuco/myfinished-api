import mongoose from 'mongoose';
import type { Item } from '../../interfaces/index';

const ItemSchema: mongoose.Schema<Item> = new mongoose.Schema({
	name: { type: String, required: true },
	listID: { type: String, required: true },
	status: { type: String, required: true }
});

export const ItemModel = mongoose.model<Item>('Item', ItemSchema);
