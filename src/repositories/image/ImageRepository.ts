import * as mongoose from 'mongoose';
import IImageModel from './IImageModel';
import { imageModel } from './ImageModel';

import VersionableRepository from '../versionable/VersionableRepository';

export default class UserRepository extends VersionableRepository<IImageModel, mongoose.Model<IImageModel>> {

    constructor() {
        super(imageModel);
    }

    public async uploadImage(modelData) {
        return await super.createUser(modelData);
    }

    public async getImage(data) {
        return await super.getUser(data);
    }

    public async updateOne(query, data) {
        return await super.updateOne(query, data);
    }

    public async getAll(query, options, sortQuery) {
        return await super.getAll(query, options, sortQuery);
    }

    public async deleteData(deleteQuery, modelDelete) {
        return await super.delete(deleteQuery, modelDelete);
    }

    public async findone(data) {
        return await super.findOne(data);
    }

    public countData() {
        return super.count();
    }
}
