import * as mongoose from 'mongoose';
import IUserModel from './IUserModel';
import { userModel } from './UserModel';

import VersionableRepository from '../versionable/VersionableRepository';

export default class UserRepository extends VersionableRepository<IUserModel, mongoose.Model<IUserModel>> {

    constructor() {
        super(userModel);
    }

    public async createUser(modelData) {
        return await super.createUser(modelData);
    }

    public async updateUser(updateQuery, updateCriteria, newData) {
        return await super.updateUser(updateQuery, updateCriteria, newData);
    }

    public async getUser(data) {
        return await super.getUser(data);
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
