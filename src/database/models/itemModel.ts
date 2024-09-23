import mongoose from 'mongoose';
import type { IItem } from '../../interfaces/IItem';

const ItemSchema: mongoose.Schema<IItem> = new mongoose.Schema({
	name: { type: String, required: true },
	listID: { type: String, required: true },
	status: { type: String, required: true }
});

const ItemModel = mongoose.model<IItem>('Item', ItemSchema);

export default ItemModel;
