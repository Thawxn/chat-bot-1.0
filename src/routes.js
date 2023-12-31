import express from 'express';

// Importando controllers
// import HomeController from './controllers/HomeController.js';
import UserController from './controllers/UserController.js';
import SessionController from './controllers/SessionController.js';
import StoreController from './controllers/StoreController.js';
import CarController from './controllers/CarController.js';
import OilController from './controllers/OilController.js';
import OilFilterController from './controllers/OilFilterController.js';
import ChatController from './controllers/Chatcontroller.js';

// importando middleware
import middleware from './middlewares/middleware.js';

const routes = new express.Router();

// Homer
// routes.post('/teste', express.json(), HomeController.index);

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

// Car
routes.get('/car', middleware.authUser, CarController.index); // listagem de todos os carros
routes.get(
  '/car/:automaker/:engine',
  middleware.authUser,
  CarController.indexOne,
); // listagem de carro por montadora e motor
routes.get('/car/:id', middleware.authUser, CarController.indexValue);
routes.post('/car/register', middleware.authUser, CarController.register); // registro de carro
routes.put('/car/edit/:id', middleware.authUser, CarController.edit); // editando informações de carro
routes.delete('/car/delete/:id', middleware.authUser, CarController.delete); // deletendo informação de carro

// Oil
routes.get('/oil', middleware.authUser, OilController.index); // Listagem de óleos
routes.get(
  '/oil/:name/:viscosity',
  middleware.authUser,
  OilController.indexOne,
); // Listagem de óleo por nome e viscosidade
routes.post('/oil/register', middleware.authUser, OilController.register); // registro de óleo
routes.put('/oil/edit/:id', middleware.authUser, OilController.edit); // editando informações de óleo
routes.delete('/oil/delete/:id', middleware.authUser, OilController.delete); // deletando óleo

// Oil Filter
routes.get('/oilFilter', middleware.authUser, OilFilterController.index); // listagem de filtro de óleo
routes.get(
  '/oilFilter/:name',
  middleware.authUser,
  OilFilterController.indexOne,
); // listagem de filtro de óleo por nome
routes.post(
  '/oilFilter/register',
  middleware.authUser,
  OilFilterController.register,
); // registro de filtro de óleo
routes.put(
  '/oilFilter/edit/:id',
  middleware.authUser,
  OilFilterController.edit,
); // editando informação de filtro de óleo
routes.delete(
  '/oilFilter/delete/:id',
  middleware.authUser,
  OilFilterController.delete,
); // deletando filtro de óleo

// chat
routes.post('/incoming', express.json(), (req, res) =>
  ChatController.zapMessage(req, res),
); // rota de envio de mensagem 'Chatbot'

export default routes;
