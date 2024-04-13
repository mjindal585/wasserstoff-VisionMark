import * as mongoose from 'mongoose';

export default interface IVersionableDocument extends mongoose.Document {
    createdAt: Date;
    deletedAt: Date;
    updatedAt: Date;
    updatedBy: string;
    createdBy: string;
    deletedBy: string;
    originalId: string;
}
