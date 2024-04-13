const config = {
    getAll: {
        skip: {
            required: false,
            default: 0,
            number: true,
            in: ['query'],
            errorMessage: 'Skip is invalid'
        },
        limit: {
            required: false,
            default: 10,
            number: true,
            in: ['query'],
            errorMessage: 'Limit is invalid'
        },
        sort: {
            required: false,
            boolean: true,
            in: ['query'],
            errorMessage: 'Sort is invalid'
        },
        search: {
            required: false,
            string: true,
            in: ['query'],
            errorMessage: 'Search is invalid'
        }
    },
    get: {
        id: {
            required: true,
            string: true,
            in: ['query'],
            errorMessage: 'id is invalid'
        }
    },

    annotate: {
        id: {
            required: true,
            string: true,
            in: ['body']
        },
    },

    approve: {
        id: {
            required: true,
            string: true,
            in: ['body']
        },
        status: {
            required: true,
            string: true,
            in: ['body']
        },
    },

    update: {
        id: {
            required: true,
            string: true,
            in: ['body']
        },
        dataToUpdate: {
            in: ['body'],
            required: true,
            isObject: true,
            custom: (dataToUpdate) => { return; }
        }
    },
};

export default config;
