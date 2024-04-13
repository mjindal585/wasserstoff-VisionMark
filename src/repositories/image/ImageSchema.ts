import VersionableSchema from '../versionable/VersionableSchema';

export default class ImageSchema extends VersionableSchema {
    constructor(option: any) {
        const Schema = {
            _id: String,
            id: String,
            fileName: String,
            originalname: String,
            mimetype: String,
            size: String,
            rawPath: String,
            annotatedPath: String,
            status: {
                type: String,
                default: "PENDING",
            },
            annotations: Array,
        };
        super(Schema, option);
    }
}
