import cache from 'memory-cache';
import Store from '../models/Store.js';
import twilioClient from '../config/twilio.js';
import Car from '../models/Car.js';
import Oil from '../models/Oil.js';
import OilFilter from '../models/OilFilter.js';

class ChatController {
  // Função principal para processar mensagens do WhatsApp
  async zapMessage(req, res) {
    console.log(req.body);
    const { From, Body } = req.body;

    try {
      const lowerCaseBody = Body.toLowerCase();

      // Verifica se a mensagem de boas-vindas já foi enviada
      const hasInteracted = cache.get(`${From}_hasInteracted`);

      if (!hasInteracted) {
        // Se ainda não interagiu, envia a mensagem de boas-vindas
        await this.sendWelcomeMessage(From);
        cache.put(`${From}_hasInteracted`, true, 3600000);
      } else {
        // Se já interagiu, processa o corpo da mensagem
        const parts = lowerCaseBody.split(/ ' ' | ' ' /);

        const tasks = parts
          .map(part => {
            if (this.isLocationRequest(part)) {
              return this.handleLocationRequest(From);
            }
            if (this.isNameRequest(part)) {
              return this.handleNameRequest(From);
            }
            if (this.isOpeHoursRequest(part)) {
              return this.handleOpenHoursRequest(From);
            }
            if (this.isBudgetFiatRequest(part)) {
              return this.processFiatMessage(From, part);
            }
            return null;
          })
          .filter(task => task !== null);

        await Promise.all(tasks);
      }

      return res
        .status(200)
        .json({ success: true, message: 'Mensagem processada com sucesso.' });
    } catch (err) {
      console.error(`Erro ao processar mensagem: ${err}`);
      return res
        .status(500)
        .json({ success: false, error: 'Erro ao processar mensagem.' });
    }
  }

  async sendWelcomeMessage(to) {
    await this.sendMessage(
      to,
      'Olá! Sou o ChatBot e estou aqui para atender você, caso precise de um orçamento por favor nos informe\n\n "montadora do veículo ou nome do veículo" \n\n também consigo fornecer informação básica sobre a loja como localização e horário de funcionamento.',
    );

    console.log('Resposta enviada: Mensagem de Boas-Vindas');
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
    return (
      body.includes('fiat') ||
      body.includes('uno') ||
      body.includes('mobi') ||
      body.includes('argo') ||
      body.includes('cronos') ||
      body.includes('strada') ||
      body.includes('doblo') ||
      body.includes('fiorino') ||
      body.includes('palio') ||
      body.includes('siena') ||
      body.includes('500') ||
      body.includes('linea') ||
      body.includes('bravo')
    );
  }

  async processFiatMessage(to, body) {
    const carSpecs = await this.checkCarSpecification(body);

    if (carSpecs) {
      await this.quoteFiatCar(carSpecs, to);
    } else {
      await this.handleFiatBudgetStep1(to);
    }
  }

  // Enviar uma resposta para uma solicitação de orçamento Fiat
  async handleFiatBudgetStep1(to) {
    await this.sendMessage(
      to,
      'Para um orçamento preciso, precisamos de algumas informações sobre seu veículo Fiat.\n\n1 - Informe o modelo do carro\n2 - Informe o nome do motor (Fire, FireFly, Evo, E-Torq)\n3 - Cilindradas (1.0, 1.3, etc.)\n4 - Ano do veículo\n\n No formato: "Nome do veiculo, Nome do Motor, Cilindradas, Ano".\n\n Esses detalhes são essenciais para identificar o filtro de óleo correto e determinar a quantidade e viscosidade recomendada. Por exemplo, o nome do motor ajuda na seleção do filtro, enquanto ano e potência são cruciais para definir a quantidade e viscosidade do óleo.',
    );
    console.log('Resposta enviada: Solicitação de Informações do Veículo Fiat');
  }

  async checkCarSpecification(body) {
    console.log(body);
    const lowerCaseMessage = body.toLowerCase();
    const words = lowerCaseMessage.match(/\b[^\s]+\b/g) || [];

    const engineCarname = words.find(word =>
      ['evo', 'e-torq', 'firefly', 'fire'].some(term => word.includes(term)),
    );
    const engineCar = words.find(word =>
      ['1.0', '1.3', '1.6', '1.4', '1.8'].includes(word),
    );
    const yearCar = words.find(word => /\b\d{4}\b/.test(word));

    const inforCar = await Car.findOne({
      engine_name: engineCarname,
      engine: engineCar,
      $and: [{ year_init: { $lte: yearCar } }, { year_end: { $gte: yearCar } }],
    });

    console.log(lowerCaseMessage);
    console.log(words);
    return inforCar;
  }

  async quoteFiatCar(result, to) {
    const documentOil = await Oil.findById(result.oil);
    const documentOilFilter = await OilFilter.findById(result.oilFilter);

    const oilValue =
      parseFloat(documentOil.price) * parseFloat(result.oil_quantity);
    const exchangeValue = oilValue + parseFloat(documentOilFilter.price);

    if (!result) {
      await this.sendMessage(
        to,
        'Desculpe, não consegui achar nada com as informação que você deu. Dá uma conferida se colocou direitinho o nome do motor, modelo e ano, tudo numa linha só, por favor? \n\n Ex: (fire 1.0 2010)',
      );
    }

    await this.sendMessage(
      to,
      `Seu carro com o motor ${result.engine_name} ${result.engine}, requer exatamente ${result.exact_quantity} litros de óleo, e, como cada litro de óleo corresponde a 1 litro, a quatidade que vai ser usada será de ${result.oil_quantity} litros. \n\nA troca completa com o óleo promocional ${documentOil.name} ${documentOil.viscosity} viscosidade recomendada e filtro ${documentOilFilter.name}, ficará em R$${exchangeValue},00 `,
    );
  }

  // Função auxiliar para enviar mensagens usando o cliente Twilio
  async sendMessage(to, message) {
    await twilioClient.messages.create({
      body: message,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:+553388942425`,
    });
  }
}

export default new ChatController();
