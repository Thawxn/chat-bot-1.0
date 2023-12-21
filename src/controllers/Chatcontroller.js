/* eslint-disable prefer-destructuring */
import Store from '../models/Store.js';
import twilioClient from '../config/twilio.js';
import Car from '../models/Car.js';
import Oil from '../models/Oil.js';
import OilFilter from '../models/OilFilter.js';

class ChatController {
  // Função principal para processar mensagens do WhatsApp
  async zapMessage(req, res) {
    // Extração de dados da requisição
    const { From, Body } = req.body;

    try {
      // Transforma o corpo da mensagem para minúsculas para facilitar a comparação
      const lowerCaseBody = Body.toLowerCase();

      // Divide a mensagem em partes com base no uso de 'e' ou 'e'
      const parts = lowerCaseBody.split(/ e | e/);

      // Array para armazenar as tarefas assíncronas
      const tasks = [];

      // Processa cada parte da mensagem
      // eslint-disable-next-line no-restricted-syntax
      for (const part of parts) {
        // Verifica se a mensagem é uma saudação
        if (this.isGreeting(part)) {
          tasks.push(this.handleGreeting(From));
        } else if (this.isLocationRequest(part)) {
          tasks.push(this.handleLocationRequest(From));
        } else if (this.isNameRequest(part)) {
          tasks.push(this.handleNameRequest(From));
        } else if (this.isOpeHoursRequest(part)) {
          tasks.push(this.handleOpenHoursRequest(From));
        } else if (this.isBudgetFiatRequest(part)) {
          tasks.push(this.handleFiatBudgetStep1(From));
        } else if (this.checkCarSpecification(part, From)) {
          console.log('sim');
        }
      }

      // Espera que todas as tarefas assíncronas sejam concluídas antes de continuar
      await Promise.all(tasks);

      // Responde com sucesso
      return res
        .status(200)
        .json({ success: true, message: 'Mensagem processada com sucesso.' });
    } catch (err) {
      // Trata erros e retorna uma resposta de erro
      console.error(`Erro ao processar mensagem: ${err.message}`);
      return res
        .status(500)
        .json({ success: false, error: 'Erro ao processar mensagem.' });
    }
  }

  // Verifica se a mensagem é uma saudação
  isGreeting(body) {
    return (
      body.includes('olá') ||
      body.includes('oi') ||
      body.includes('e aí') ||
      body.includes('tudo bem') ||
      body.includes('opa') ||
      body.includes('alô') ||
      body.includes('ei') ||
      body.includes('bom dia') ||
      body.includes('boa tarde') ||
      body.includes('boa noite') ||
      body.includes('ola') ||
      body.includes('eai') ||
      body.includes('e ai')
    );
  }

  // Envia uma resposta para uma saudação
  async handleGreeting(to) {
    await this.sendMessage(
      to,
      'Olá! Sou o ChatBot e estou aqui para atender você, caso precise de um orçamento por favor digite as informações do seu veículo dessa forma "montadora do veículo, nome do veículo", também consigo fornecer informação básica sobre a loja como localização e horário de funcionamento.',
    );
    console.log('Resposta enviada: Saudação');
  }

  // Verifica se a mensagem é um pedido de informação da localização da loja
  isLocationRequest(body) {
    return (
      body.includes('localização') ||
      body.includes('local') ||
      body.includes('localizacaum') ||
      body.includes('lokal') ||
      body.includes('localzção') ||
      body.includes('loqlizaçao') ||
      body.includes('loclz') ||
      body.includes('localizacao')
    );
  }

  // Envia uma resposta para uma solicitação de informação de localização
  async handleLocationRequest(to) {
    const storeLocation = await Store.find().select({ location: 1 }).lean();

    if (storeLocation.length > 0) {
      // Se encontrou localização da loja, envia a resposta
      await this.sendMessage(
        to,
        `A Localização da nossa loja é ${storeLocation[0].location}`,
      );
      console.log('Resposta enviada: Informações da Loja');
    } else {
      // Se não encontrou informações da loja, envia uma resposta padrão
      await this.sendMessage(
        to,
        'Desculpe, não encontramos informações para a palavra-chave fornecida.',
      );
      console.log('Resposta enviada: Informações não encontradas');
    }
  }

  // Verificar se a mensagem é um pedido de informação sobre o nome da loja
  isNameRequest(body) {
    return (
      body.includes('nome') ||
      body.includes('nm') ||
      body.includes('nme') ||
      body.includes('noome') ||
      body.includes('nomi') ||
      body.includes('noimi')
    );
  }

  // Envia uma resposta para uma solicitação de informação do nome da loja
  async handleNameRequest(to) {
    const storeNome = await Store.find().select({ name: 1 }).lean();

    if (storeNome.length > 0) {
      // Se encontrou nome da loja, envia a resposta
      await this.sendMessage(to, `O Nome da nossa loja é ${storeNome[0].name}`);
      console.log('Resposta enviada: Informações da Loja');
    } else {
      // Se não encontrou informações do nome da loja, envia uma resposta padrão
      await this.sendMessage(
        to,
        'Desculpe, não encontramos informações para a palavra-chave fornecida.',
      );
      console.log('Resposta enviada: Informações não encontradas');
    }
  }

  // Verificar se a mensagem é um pedido de informação sobre o horário de funcionamento
  isOpeHoursRequest(body) {
    return (
      body.includes('horas') ||
      body.includes('hr') ||
      body.includes('hrs') ||
      body.includes('oras') ||
      body.includes('hras') ||
      body.includes('funciona') ||
      body.includes('funcna') ||
      body.includes('func') ||
      body.includes('funcionamento') ||
      body.includes('funiona') ||
      body.includes('aberto') ||
      body.includes('abertu') ||
      body.includes('abert') ||
      body.includes('abrt') ||
      body.includes('abre')
    );
  }

  // Envia uma resposta para uma solicitação de informação de horário de funcionamento
  async handleOpenHoursRequest(to) {
    const storeOpenhours = await Store.find()
      .select({ openingHours: 1 })
      .lean();

    if (storeOpenhours.length > 0) {
      // Se encontrou o horário de funcionamento da loja, envia a resposta
      await this.sendMessage(
        to,
        `O Horário de funcionamento é de ${storeOpenhours[0].openingHours}`,
      );
      console.log('Resposta enviada: Informações da Loja');
    } else {
      // Se não encontrou informações do horário de funcionamento, envia uma resposta padrão
      await this.sendMessage(
        to,
        'Desculpe, não encontramos informações para a palavra-chave fornecida.',
      );
      console.log('Resposta enviada: Informações não encontradas');
    }
  }

  // Verificar montadora do carro para passar orçamento
  isBudgetFiatRequest(body) {
    return body.includes('fiat');
  }

  // Enviar uma resposta para uma solicitação de orçamento Fiat
  async handleFiatBudgetStep1(to) {
    await this.sendMessage(
      to,
      'Para fornecer um orçamento preciso, precisamos de algumas informações sobre o seu veículo Fiat.\n\nPor favor, informe o nome do motor (por exemplo, Fire, FireFly, Evo, E-Torq), as cilindradas (1.0, 1.3, etc.) e o ano do veículo. Digite as informações no seguinte formato: "Nome do Motor, Cilindradas, Ano".',
    );
    console.log('Resposta enviada: Solicitação de Informações do Veículo Fiat');
  }

  async checkCarSpecification(body, to) {
    const lowerCaseMessage = body.toLowerCase();
    const tokens = lowerCaseMessage.split(' ');

    const engineCarname = tokens.find(token =>
      ['firefly', 'evo', 'e-torq', 'fire'].includes(token),
    );
    const engineCar = tokens.find(token =>
      ['1.0', '1.3', '1.6', '1.4'].includes(token),
    );
    const yearCar = tokens.find(token => /\b\d{4}\b/.test(token));

    const inforCar = await Car.findOne({
      engine_name: engineCarname,
      engine: engineCar,
      $and: [{ year_init: { $lte: yearCar } }, { year_end: { $gte: yearCar } }],
    });

    const documentOil = await Oil.findById(inforCar.oil);
    const documentOilFilter = await OilFilter.findById(inforCar.oilFilter);

    const oilValue =
      parseFloat(documentOil.price) * parseFloat(inforCar.oil_quantity);
    const exchangeValue = oilValue + parseFloat(documentOilFilter.price);

    if (!inforCar) {
      await this.sendMessage(
        to,
        'Desculpe, não consegui achar nada com as informação que você deu. Dá uma conferida se colocou direitinho o nome do motor, modelo e ano, tudo numa linha só, por favor? \n\n Ex: (fire 1.0 2010)',
      );
    }

    await this.sendMessage(
      to,
      `Seu carro como o motor ${engineCarname} ${engineCar}, requer exatamente ${inforCar.exact_quantity} litros de óleo, e, como cada litro de óleo corresponde a 1 litro, a quatidade que vai ser usada será de ${inforCar.oil_quantity} litros. \n\nA troca completa com o óleo promocional ${documentOil.name} ${documentOil.viscosity} viscosidade recomendada, ficará em R$${exchangeValue},00 `,
    );
  }

  // Função auxiliar para enviar mensagens usando o cliente Twilio
  async sendMessage(to, message) {
    await twilioClient.messages.create({
      body: message,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${to}`,
    });
  }
}

export default new ChatController();
