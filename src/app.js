import express from 'express';
import mongoose from 'mongoose';
import routes from './routes.js';

import 'dotenv/config';

class App {
  constructor() {
    this.server = express();

    mongoose.connect(process.env.CONNECTIONSTING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.middleware();
    this.routes();
  }

  middleware() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
