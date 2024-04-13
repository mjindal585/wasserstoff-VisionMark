import * as bcrypt from 'bcrypt';
import axios from 'axios';

import { Response, NextFunction } from 'express';

import ImageRepository from '../../repositories/image/ImageRepository';
import IRequest from '../../libs/routes/IRequest';
import VersionableRepository from '../../repositories/versionable/VersionableRepository';

class ImageController {
    public async getAll(req: IRequest, res: Response, next: NextFunction) {

        let skipvVar: number;
        let limitVar: number;
        let sort: boolean;
        let search: string = '';
        let status: string = '';

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

        if ('status' in req.query) {
            status = req.query.status;
        }
        const query: any = {
            deletedAt: { $exists: false },
            updatedAt: { $exists: false },
            ...status && { status },
            $or: [
                {
                    fileName: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    rawPath: {
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

        const image = new ImageRepository();
        await image.getAll(query, options, sortQuery)
            .then((data) => {
                if (data.records === null) {
                    throw '';
                }
                res.status(200).send({
                    status: 'ok',
                    message: 'Fetched successfully',
                    Images: { data }
                });
            })
            .catch((err) => {
                res.send({
                    message: 'Unable to fetch Images',
                    status: 404,
                    timestamp: new Date()
                });
            });
    }

    public async get(req: IRequest, res: Response, next: NextFunction) {
        const id = req.query.id;
        const image = new ImageRepository();

        await image.getImage({ id, deletedAt: { $exists: false }, updatedAt: { $exists: false } })
            .then((data) => {
                res.status(200).send({
                    message: 'Image',
                    status: 'ok',
                    data
                });
            });
    }

    public async upload(req: IRequest, res: Response, next: NextFunction) {
        if (!req.file) {
            next({
                error: 'No file Added',
                message: 'Please upload a file',
                code: 406
            });
        }
        if (req.fileValidationError) {
            next({
                error: 'Not Acceptable',
                message: req.fileValidationError,
                code: 406
            });
        }
        try {
            const mongoId = VersionableRepository.generateObjectId();
            const image = new ImageRepository();

            const { originalname, mimetype, filename, size, path } = req.file;
            const creator = req.userData._id;
            const modelData = {
                id: mongoId,
                originalname,
                mimetype,
                filename,
                size,
                rawPath: path,
                originalId: mongoId,
                createdBy: creator,
                _id: mongoId
            };
            await image.uploadImage(modelData)
            .then(() => {
                res.status(200).send({
                    status: 'ok',
                    message: 'Image Uploaded Successfully',
                    data: {
                        id: mongoId, filename, path,
                    },
                });
            });
        } catch (err) {
            next({
                error: 'Upload Error',
                message: 'Upload Error',
                code: 500
            });
        }
    }

    public async annotate(req: IRequest, res: Response, next: NextFunction) {
        try {

            const { id } = req.body;
            const authUser = req.userData._id;
            const image = new ImageRepository();

            const getQuery = {
                id,
                createdBy: authUser,
                status: 'PENDING',
                annotatedPath: {
                    $exists: false
                },
                deletedAt: {
                    $exists: false
                }
            };
            let dbData;
            try {
                dbData = await image.getUser(getQuery);

                if (!dbData) {
                    throw '';
                }
            } catch (err) {
                next({
                    message: 'Image not found/ already annotated',
                    code: 404
                });
            }
            const { rawPath } = dbData;
            axios({
                method: 'post',
                url: 'http://127.0.0.1:8000/detect',
                data: {
                    file_path: rawPath,
                }
            })
            .then(async ({ data }) => {
                const { annotated_image_path, annotations } = data;
                const updateQuery = {
                    id
                };
                const updateCriteria = {
                    annotations,
                    annotatedPath: annotated_image_path,
                    updatedAt: Date.now(),
                    updatedBy: authUser,
                };
                await image.updateOne(updateQuery, updateCriteria)
                        .then(() => {
                            res.status(200).send({
                                status: 'ok',
                                message: 'Image Annotations Updated',
                                data: { id, annotatedPath: annotated_image_path, annotations }
                            });
                        })
                        .catch((err) => {
                            res.status(404).send({
                                error: 'Not Found',
                                message: 'Image Not Found',
                                status: 404,
                                timestamp: new Date()
                            });
                        });
            });
        } catch (err) {
            next({
                error: 'Annotation Error',
                message: 'Unable to annotate',
                code: 500
            });
        }
    }

    public async approve(req: IRequest, res: Response, next: NextFunction) {
        try {
            const { id, status } = req.body;
            if (!['REJECTED', 'APPROVED'].includes(status)) {
                next({
                    error: 'Not Acceptable',
                    message: 'Status shold be one of REJECTED / APPROVED',
                    code: 406
                });
            }
            const authUser = req.userData._id;
            const image = new ImageRepository();

            const getQuery = {
                id,
                status: 'PENDING',
                deletedAt: {
                    $exists: false
                }
            };
            let dbData;
            try {
                dbData = await image.getUser(getQuery);

                if (!dbData) {
                    throw '';
                } else {
                    if (['REJECTED', 'APPROVED'].includes(dbData.status)) {
                        throw '';
                    }
                }
            } catch (err) {
                next({
                    message: 'Image not found / already approved / rejected',
                    code: 404
                });
            }
            const updateQuery = {
                id,
            };
            const updateCriteria = {
                status,
                updatedAt: Date.now(),
                updatedBy: authUser,
            };
            await image.updateOne(updateQuery, updateCriteria)
                    .then(() => {
                        res.status(200).send({
                            status: 'ok',
                            message: `Image Annotations ${status}`,
                            data: { id, status }
                        });
                    })
                    .catch((err) => {
                        res.status(404).send({
                            error: 'Not Found',
                            message: 'Image Not Found',
                            status: 404,
                            timestamp: new Date()
                        });
                    });
        } catch (err) {
            next({
                error: 'Annotation Error',
                message: 'Unable to annotate',
                code: 500
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
                const image = new ImageRepository();

                const getQuery = {
                    email: dataToUpdate.email,
                    updatedAt: {
                        $exists: false
                    },
                    deletedAt: {
                        $exists: false
                    }
                };


                const dbData = await image.getUser(getQuery);

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
                const image = new ImageRepository();

                const getQuery = {
                    id,
                    updatedAt: {
                        $exists: false
                    },
                    deletedAt: {
                        $exists: false
                    }
                };


                const dbData = await image.getUser(getQuery);


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


                    await image.updateUser(updateQuery, updateCriteria, newData)
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

}

export default new ImageController();
