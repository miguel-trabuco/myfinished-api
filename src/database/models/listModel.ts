import mongoose from 'mongoose';
import type { IList } from '../../interfaces/IList';

const ListSchema: mongoose.Schema<IList> = new mongoose.Schema({
	name: { type: String, required: true },
	userID: { type: String, required: true },
	itemsAmount: { type: Number, required: true }
});

const ListModel = mongoose.model<IList>('List', ListSchema);

export default ListModel;
