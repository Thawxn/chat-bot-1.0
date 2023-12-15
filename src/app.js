import express from 'express';
import mongoose from 'mongoose';
import routes from './routes.js';

import 'dotenv/config';

class App {
  constructor() {
    // Inicializa a instância do servidor Express
    this.server = express();

    // Conecta-se ao MongoDB usando a string de conexão do ambiente
    mongoose.connect(process.env.CONNECTIONSTING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Configuração dos middleware
    this.middleware();

    // Configuração das rotas
    this.routes();
  }

  // Configuração dos middleware
  middleware() {
    // Habilita o uso do middleware para parse de JSON nas requisições
    this.server.use(express.json());
  }

  // Configuração das rotas
  routes() {
    // Inclui as rotas definidas no arquivo routes.js
    this.server.use(routes);
  }
}

// Exporta a instância do servidor para uso em outros arquivos
export default new App().server;
