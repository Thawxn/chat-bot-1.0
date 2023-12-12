import { Router } from 'express';

// Importando controllers
import HomeController from './controllers/HomeController.js';
import UserController from './controllers/UserController.js';
import SessionController from './controllers/SessionController.js';
import StoreController from './controllers/StoreController.js';
import ChatController from './controllers/Chatcontroller.js';

// importando middleware
import middleware from './middlewares/middleware.js';

const routes = new Router();

// Homer
routes.get('/', HomeController.index);

// User
routes.post('/user/register', UserController.register); // registrando usuário
routes.put('/user/edit', middleware.authUser, UserController.edit); // editando usuário

// session
routes.post('/session', SessionController.session); // logando na aplicação

// store
routes.post('/store/register', middleware.authUser, StoreController.register);

// chat
routes.post('/incoming', ChatController.zapMessege);

export default routes;
