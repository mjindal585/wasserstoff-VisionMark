type access = {
    all: string[];
    read: string[];
    create?: string[];
    update?: string[];
    delete?: string[];
    upload?: string[];
    readToken?: string[];
    annotate?: string[];
    approve?: string[];
};

interface IPermissions {
    userRoutes: access;
    imageRoutes: access;
}

export { IPermissions };
