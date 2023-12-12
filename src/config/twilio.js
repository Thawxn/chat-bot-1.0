import Twilio from 'twilio';

import 'dotenv/config';

const accessSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = Twilio(accessSid, authToken);

export default twilioClient;
