import Twilio from 'twilio';

import 'dotenv/config';

// Extrai as chaves de autenticação do arquivo .env
const accessSid =
  'ACc355102c1fbc2a88207419d0c19e7d26' || process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Cria a instância do cliente Twilio
const twilioClient = Twilio(accessSid, authToken);

// Exporta o cliente Twilio para uso em outros módulos
export default twilioClient;
