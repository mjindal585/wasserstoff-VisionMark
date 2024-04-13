const config = {
    create: {
        id: {
            required: false,
            string: true,
            in: ['body'],
            custom: (value) => {
                console.log('Value', value);
                throw {
                    error: 'Error Occured',
                    message: 'Message'
                };
            }
        },
        name: {
            required: true,
            regex: '',
            in: ['body'],
            errorMessage: 'Name is required'
        },
        email: {
            required: true,
            regex: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
            in: ['body'],
            errorMessage: 'Email is required'
        },
        password: {
            required: true,
            string: true,
            in: ['body'],
            errorMessage: 'Password is required'
        }
    },

    delete: {
        id: {
            required: true,
            string: true,
            errorMessage: 'Id is required',
            in: ['params']
        }
    },

    get: {
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

    login: {
        email: {
            required: true,
            regex: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
            in: ['body'],
            errorMessage: 'Email is required'
        },
        password: {
            required: true,
            string: true,
            in: ['body'],
            errorMessage: 'Password is required'
        },
    }
};

export default config;
