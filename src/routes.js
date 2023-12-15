import { Router } from 'express';

// Importando controllers
import HomeController from './controllers/HomeController.js';
import UserController from './controllers/UserController.js';
import SessionController from './controllers/SessionController.js';
import StoreController from './controllers/StoreController.js';
import OilController from './controllers/OilController.js';
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
routes.get('/store', middleware.authUser, StoreController.index); // listagem de todas as lojas
routes.post('/store/register', middleware.authUser, StoreController.register); // registro de informação da loja
routes.put('/store/edit/:id', middleware.authUser, StoreController.edit); // editando informações da loja
routes.delete('/store/delete/:id', middleware.authUser, StoreController.delete); // deletando informação da loja

// Oil
routes.get('/oil', middleware.authUser, OilController.index);
routes.get(
  '/oil/:name/:viscosity',
  middleware.authUser,
  OilController.indexOne,
);
routes.post('/oil/register', middleware.authUser, OilController.register);
routes.put('/oil/edit/:id', middleware.authUser, OilController.edit);
routes.delete('/oil/delete/:id', middleware.authUser, OilController.delete);

// chat
routes.post('/incoming', (req, res) => ChatController.zapMessage(req, res)); // rota de envio de mensagem 'Chatbot'

export default routes;
