import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Response, NextFunction } from 'express';

import UserRepository from '../../repositories/user/UserRepository';
import { config } from '../../config';
import IRequest from '../../libs/routes/IRequest';
import VersionableRepository from '../../repositories/versionable/VersionableRepository';

class UserController {

    public async me(req: IRequest, res: Response, next: NextFunction) {
        const id = req.query._id;
        const user = new UserRepository();

        await user.getUser({ id, deletedAt: { $exists: false }, updatedAt: { $exists: false } })
            .then((data) => {
                res.status(200).send({
                    message: 'Me',
                    status: 'ok',
                    data
                });
            });
    }

    public async getAll(req: IRequest, res: Response, next: NextFunction) {

        let skipvVar: number;
        let limitVar: number;
        let sort: boolean;
        let search: string = '';

        if ('limit' in req.query) {
            limitVar = Number(req.query.limit);
        }
        else {
            limitVar = 10;
        }

        if ('skip' in req.query) {
            skipvVar = Number(req.query.skip);
        }
        else {
            skipvVar = 0;
        }

        if ('sort' in req.query) {
            if (req.query.sort === 'true') {
                sort = true;
            }
            else {
                sort = false;
            }
        }
        else {
            sort = false;
        }

        if ('search' in req.query) {
            search = req.query.search;
        }

        const query: any = {
            deletedAt: { $exists: false },
            updatedAt: { $exists: false },
            $or: [
                {
                    name: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    email: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ]
        };

        const options: any = {
            skip: skipvVar,
            limit: limitVar
        };

        let sortQuery: any;

        if (sort) {
            sortQuery = {
                name: 1,
                email: 1
            };
        }
        else {
            sortQuery = {
                createdAt: -1
            };
        }

        const user = new UserRepository();
        await user.getAll(query, options, sortQuery)
            .then((data) => {
                if (data.records === null) {
                    throw '';
                }
                res.status(200).send({
                    status: 'ok',
                    message: 'Fetched successfully',
                    Users: { data }
                });
            })
            .catch((err) => {
                res.send({
                    message: 'Unable to fetch User',
                    status: 404,
                    timestamp: new Date()
                });
            });
    }

    public async create(req: IRequest, res: Response, next: NextFunction) {
        const { id, email, name, password } = req.body;
        const creator = req.userData._id;
        try {
            const repository = new UserRepository();
            const dataId = await repository.getUser({ id, deletedAt: { $exists: false }, updatedAt: { $exists: false } });
            const dataEmail = await repository.getUser({ email, deletedAt: { $exists: false }, updatedAt: { $exists: false } });

            if (dataId !== null || dataEmail !== null) {
                throw '';
            }
            else {
                const user = new UserRepository();

                const mongoId = VersionableRepository.generateObjectId();

                const rawPassword = password;
                const saltRounds = 10;
                const salt = bcrypt.genSaltSync(saltRounds);
                const hashedPassword = await bcrypt.hashSync(rawPassword, salt);

                const modelData = {
                    id: id || mongoId,
                    name,
                    email,
                    password: hashedPassword,
                    originalId: mongoId,
                    createdBy: creator,
                    _id: mongoId
                };

                await user.createUser(modelData)
                    .then(() => {
                        res.send({
                            status: 'ok',
                            message: 'User Created Successfully',
                            data: {
                                'id': id,
                                'name': name,
                                'email': email,
                            },
                        });
                    });
            }

        } catch (err) {
            next({
                error: 'Already Exists',
                message: 'id/email Already Exists',
                code: 403
            });
        }
    }

    public async update(req: IRequest, res: Response, next: NextFunction) {
        const { id, dataToUpdate } = req.body;
        const updator = req.userData._id;

        if (Object.keys(dataToUpdate).length === 0) {
            next({
                error: 'Not Acceptable',
                message: 'No Data To Update Given',
                code: 406
            });
        }
        else if ('email' in dataToUpdate) {
            try {
                const user = new UserRepository();

                const getQuery = {
                    email: dataToUpdate.email,
                    updatedAt: {
                        $exists: false
                    },
                    deletedAt: {
                        $exists: false
                    }
                };


                const dbData = await user.getUser(getQuery);

                if (dbData !== null) {
                    throw '';
                }

            } catch (err) {
                next({
                    message: 'Eamil Already Taken',
                    code: 409
                });
            }
        }
        else if ((id === '') || (Object.values(dataToUpdate).indexOf('') > -1)) {
            next({
                message: 'Fields cannot be blank',
                code: 422
            });
        }
        else {

            if ('password' in dataToUpdate) {
                const rawPassword = dataToUpdate.password;
                const saltRounds = 10;
                const salt = bcrypt.genSaltSync(saltRounds);
                const hashedPassword = await bcrypt.hashSync(rawPassword, salt);
                dataToUpdate.password = hashedPassword;
            }

            try {
                const user = new UserRepository();

                const getQuery = {
                    id,
                    updatedAt: {
                        $exists: false
                    },
                    deletedAt: {
                        $exists: false
                    }
                };


                const dbData = await user.getUser(getQuery);


                if (dbData === null) {
                    throw '';
                }
                else {
                    const originalData = dbData;
                    const newId = VersionableRepository.generateObjectId();
                    const oldId = originalData._id;

                    const updateCriteria = {
                        updatedAt: Date.now(),
                        updatedBy: updator,
                        deletedAt: Date.now(),
                        deletedBy: updator
                    };

                    const newData = await Object.assign(JSON.parse(JSON.stringify(originalData)), dataToUpdate);

                    newData._id = newId;
                    newData.createdAt = Date.now();

                    const updateQuery = {
                        _id: oldId
                    };


                    await user.updateUser(updateQuery, updateCriteria, newData)
                        .then(() => {
                            res.status(200).send({
                                status: 'ok',
                                message: 'User Updated',
                                data: { id }
                            });
                        })
                        .catch((err) => {
                            res.status(404).send({
                                error: 'Not Found',
                                message: 'User Not Found',
                                status: 404,
                                timestamp: new Date()
                            });
                        });
                }

            } catch (err) {
                res.status(404).send({
                    error: 'Not Found',
                    message: 'Trainee Not Found',
                    status: 404,
                    timestamp: new Date()
                });
            }


        }
    }

    public async remove(req: IRequest, res: Response, next: NextFunction) {
        const id = req.params.id;
        const remover = req.userData._id;
        const user = new UserRepository();

        try {
            const dbData = await user.getUser({ id, deletedAt: { $exists: false } });

            if (dbData === null) {
                throw '';
            }
            else {
                const originalData = dbData;
                const oldId = originalData._id;

                const modelDelete = {
                    deletedAt: Date.now(),
                    deletedBy: remover,
                };

                const deleteQuery = {
                    _id: oldId
                };

                await user.deleteData(deleteQuery, modelDelete)
                    .then(() => {
                        res.status(200).send({
                            'status': 'ok',
                            'message': 'Trainee Deleted Successfully',
                            'data': { id }
                        });
                    })
                    .catch((err) => {
                        res.status(404).send({
                            message: 'Trainee Not Found',
                            status: 404,
                            timestamp: new Date()
                        });
                    });
            }
        } catch (err) {
            next({
                message: 'Trainee not Found',
                code: 404
            });
        }
    }

    public async login(req: IRequest, res: Response, next: NextFunction) {
        const { email } = req.body;

        const user = new UserRepository();

        await user.getUser({ email, updatedAt: null, deletedAt: null })
            .then((userData) => {
                if (userData === null) {
                    res.status(404).send({
                        error: 'Not Found',
                        message: 'User Not Found',
                        status: 404,
                        timestamp: new Date()
                    });
                    return;
                }

                const { password } = userData;

                if (!(bcrypt.compareSync(req.body.password, password))) {
                    res.status(401).send({
                        message: 'Invalid Password',
                        status: 401,
                        timestamp: new Date()
                    });
                    return;
                }

                const token = jwt.sign(userData.toJSON(), config.KEY, { expiresIn: '3600m' });
                res.status(200).send({
                    status: 'ok',
                    message: 'Authorization Token',
                    data: token
                });
                return;

            });
    }

}

export default new UserController();
