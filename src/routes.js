import { Router } from 'express';

// Importando controllers
import HomeController from './controllers/HomeController.js';
import UserController from './controllers/UserController.js';
import SessionController from './controllers/SessionController.js';
import StoreController from './controllers/StoreController.js';
import ChatController from './controllers/Chatcontroller.js';
import TesteController from './controllers/TesteController.js';

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
routes.post('/incoming', (req, res) => ChatController.zapMessage(req, res));

// teste
routes.post('/teste', TesteController.testeDePesquisa);

export default routes;
