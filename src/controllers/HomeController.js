import twilioClient from '../config/twilio.js';

class HomeController {
  index(req, res) {
    try {
      console.log(req.body.Body);

      let messageToSend = '';

      if (req.body === 'Hi') {
        messageToSend = 'Hello Word';
      } else {
        // eslint-disable-next-line prefer-template
        messageToSend = 'hello ' + req.body;
      }

      twilioClient.messages
        .create({
          body: messageToSend,
          from: 'whatsapp:+14155238886',
          to: `whatsapp:+553388942425`,
        })
        .then(messege => {
          console.log(messege.sid);
          console.log(messege.body);
        });
    } catch (err) {
      console.log(err);
    }
  }
}

export default new HomeController();
