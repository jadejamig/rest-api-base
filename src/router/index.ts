import express from 'express'
import authentication from './authentication.router'
import users from './user.router'

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    users(router);

    return router;
}
