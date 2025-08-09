import { Router } from 'express';
import { IndexController } from '../controllers';
import { addUser, signIn, getUser } from '../controllers/User';
import { get } from 'http';

const router = Router();
const indexController = new IndexController();

export function setRoutes(app: any) {
    app.use('/', router);
    router.get('/user', getUser);
    router.post('/user', addUser);
    router.post('/user/signin', signIn);
}