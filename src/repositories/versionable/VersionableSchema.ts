import * as mongoose from 'mongoose';

export default class VersionableSchema extends mongoose.Schema {
  constructor(option: any, collection: any) {
    const versionable = Object.assign({
      ...option,
      createdAt: {
        default: Date.now,
        required: true,
        type: Date,
      },
      deletedAt: {
        required: false,
        type: Date,
      },
      originalId: {
        required: true,
        type: String,
      },
      updatedAt: {
        required: false,
        type: Date,
      },
      updatedBy: {
        required: false,
        type: String,
      },
      createdBy: {
        required: false,
        type: String,
      },
      deletedBy: {
        required: false,
        type: String,
      },
    });
    super(versionable, collection);
  }
}
