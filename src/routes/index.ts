import { Router } from 'express';
import { IndexController } from '../controllers';
import { addUser, signIn, getUser, authenticate } from '../controllers/User';
import { addProduct, getProduct, updateProduct, deleteProduct, listProducts } from '../controllers/Product';

const router = Router();
const indexController = new IndexController();

export function setRoutes(app: any) {
    app.use('/', router);
    router.get('/test', (req, res)=> {res.send("test message")});
    router.get('/user', getUser);
    router.post('/user', addUser);
    router.post('/user/signin', signIn);

    router.use(authenticate); // Apply authentication middleware to all routes below
    router.post('/product', addProduct);
    router.get('/product/:productId', getProduct);
    router.put('/product/:productId', updateProduct);
    router.delete('/product/:productId', deleteProduct);
    router.get('/products', listProducts);
}