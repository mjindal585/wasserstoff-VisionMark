import { IPermissions } from './IPermissions';

const permissions: IPermissions = {
    'userRoutes': {
        all: ['admin'],
        read: [],
        create: [],
        update: [],
        delete: [],
        readToken: ['user']
    },
    'imageRoutes': {
        all: ['admin'],
        read: ['user'],
        annotate: ['user'],
        approve: [],
        upload: ['user'],
        update: ['user'],
    }
};

export { permissions };
