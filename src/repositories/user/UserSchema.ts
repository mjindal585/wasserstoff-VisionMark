import VersionableSchema from '../versionable/VersionableSchema';

export default class UserSchema extends VersionableSchema {
    constructor(option: any) {
        const Schema = {
            _id: String,
            id: String,
            name: String,
            email: String,
            role: {
                type: String,
                default: 'user',
            },
            password: String
        };
        super(Schema, option);
    }
}
