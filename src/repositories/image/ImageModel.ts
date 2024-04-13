import * as mongoose from 'mongoose';
import IImageModel from './IImageModel';
import ImageSchema from './ImageSchema';

export const imageSchema = new ImageSchema({
    collection: 'image',
});

export const imageModel: mongoose.Model<IImageModel> = mongoose.model<IImageModel>(
    'Image',
    imageSchema,
    'Image',
    true,
);
