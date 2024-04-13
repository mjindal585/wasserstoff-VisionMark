import { query } from 'express';
import * as mongoose from 'mongoose';

export default class VersionableRepository<D extends mongoose.Document, M extends mongoose.Model<D>> {
    private model: M;

    constructor(model) {
        this.model = model;
    }

    public static generateObjectId(): string {
        return String(mongoose.Types.ObjectId());
    }

    public async count() {
        return await this.model.countDocuments();
    }

    public async findOne(data: object) {
        return await this.model.findOne(data).lean();
    }

    public async createSeedUser(modelData): Promise<D> {
        return await this.model.create(modelData);
    }

    public async createUser(modelData): Promise<D> {
        return await this.model.create(modelData);
    }

    public async getUser(data: any) {
        return await this.model.findOne(data);
    }

    public async getAll(data: any, options: any, sortQuery: any) {

        const fetchedData = await this.model.find(data, {}, options)
            .sort(sortQuery);

        const length = await this.model.find(data)
            .sort(sortQuery)
            .countDocuments();

        const record = { count: length, records: fetchedData };

        return record;

    }

    public async createTrainee(data: any): Promise<D> {
        return await this.model.create(data);
    }

    public async imageRoutes(data: any) {
        return await this.model.findOne(data);
    }

    public async getAllTrainee(data: any, options: any, sortQuery: any) {
        const fetchedData = await this.model.find(data, {}, options)
            .sort(sortQuery);

        const length = await this.model.find(data)
            .sort(sortQuery)
            .countDocuments();

        const record = { count: length, records: fetchedData };

        return record;

    }

    public async updateTrainee(updateQuery, updateCriteria, newData) {
        await this.model.updateOne(updateQuery, updateCriteria);
        return await this.model.create(newData);
    }

    public async updateUser(updateQuery: any, updateCriteria: any, newData: any) {
        await this.model.updateOne(updateQuery, updateCriteria);
        await this.model.create(newData);
    }

    public async updateOne(updateQuery: any, updateCriteria: any) {
        await this.model.updateOne(updateQuery, updateCriteria);
    }

    public async deleteTrainee(deleteQuery, modelDelete) {
        await this.model.updateOne(deleteQuery, modelDelete);
    }

    public async delete(deleteQuery, modelDelete) {
        await this.model.updateOne(deleteQuery, modelDelete);
    }
}
