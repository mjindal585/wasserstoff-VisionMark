import { NextFunction, Request, Response } from 'express';

export default ( config ) => ( req: Request, res: Response, next: NextFunction  ) => {
    const errorArray = [];
    const keys = Object.keys( config );
    keys.forEach((property) => {
        const obj = config[property];
        const values = obj.in.map( ( val ) => {
            return req[ val ][ property ];
        });

        if (obj.required ) {
            if (isNull(values[0])) {
                errorArray.push({
                    key: property,
                    location: obj.in,
                    errorMessage: `${property} is required`
                });
                return;
            }
        }

        if (!obj.required) {
            if (isNull(values[0])) {
                return;
            }
        }

        if (Object.keys( req[obj.in] ).length === 0 ) {
            errorArray.push({
                key: property,
                location: req[obj.in],
                errorMessage: `Values should be passed through ${obj.in}`
            });
        }

        if (obj.string) {
            if ( !( typeof ( values[0] ) === 'string' ) ) {
                errorArray.push({
                    key: property,
                    location: obj.in,
                    errorMessage: obj.errorMessage || `${property} Should be a String`
                });
            }
        }

        if (obj.boolean) {
            values[0] = Boolean(values[0]);
            if ( !( typeof ( values[0] ) === 'boolean' ) ) {
                errorArray.push({
                    key: property,
                    location: obj.in,
                    errorMessage: obj.errorMessage || `${property} Should be a Boolean`
                });
            }
        }

        if (obj.isObject)  {
            if ( ! ( typeof ( values ) === 'object' ) ) {
                errorArray.push({
                    key: property,
                    location: obj.in,
                    errorMessage: obj.errorMessage || `${property} Should be an object`
                });
            }
        }
        if (obj.regex) {
            const regex = obj.regex;
            if (!regex.test(values[0])) {
                errorArray.push({
                    key: property,
                    location: obj.in,
                    errorMessage: `${property} is not valid expression`
                });
            }
        }

        if (obj.default) {
            if (isNull(values[0])) {
                values[0] = obj.default;
            }
        }

        if (obj.number) {
            if (isNaN(values[0]) || values[0] === undefined) {
                errorArray.push({
                    key: property,
                    location: obj.in,
                    errorMessage: obj.errorMessage || `${property}  must be an number`
                });
            }
        }

    });
    if (errorArray.length > 0) {
        res.status(400).send(errorArray);
    }
    else {
        next();
    }
};

function isNull( obj ) {
    const a = ( obj === undefined || obj === null );
    return a;
}
