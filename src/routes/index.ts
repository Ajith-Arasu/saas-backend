import { Router } from 'express';
import { IndexController } from '../controllers';
import { addUser, signIn } from '../controllers/User';

const router = Router();
const indexController = new IndexController();

export function setRoutes(app: any) {
    app.use('/', router);
    router.post('/user', addUser);
    router.post('/user/signin', signIn);
}