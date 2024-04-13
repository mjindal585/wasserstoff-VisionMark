import * as express from 'express';
import * as bodyparser from 'body-parser';
import * as cors from 'cors';

import { notFoundRouteHandler, errorHandler } from './libs/routes';
import mainRouter from './router';
import Database from './libs/Database';


class Server {
    app;
    constructor (private config) {
        this.app = express();
    }

    bootstrap () {
        this.initBodyParser();
        this.setupRoutes();
        return this;
    }

    setupRoutes () {
        const { app } = this;

        app.use(cors());

        app.use('/health-check' , (req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.send('I am OK');
        });

        app.use('/api', mainRouter);

        app.use(notFoundRouteHandler);

        app.use(errorHandler);

        return this;
    }

    initBodyParser () {
        const { app } = this;
        app.use(express.json());
        app.use(bodyparser.urlencoded({ extended: true }));
        app.use(bodyparser.json());
    }

    run () {
        const { app, config: { PORT, MONGO_URL } } = this;
        Database.open(MONGO_URL)
        .then((res) => {
            app.listen(PORT, (err) => {
                if (err) {
                    console.log(err);
                }
                console.log('Success! App is running on port : ', PORT);
            });
        })
        .catch(err => console.log(err));
    }
}

export default Server;
