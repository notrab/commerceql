"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = require("@sendgrid/mail");
const graphcool_lib_1 = require("graphcool-lib");
module.exports = event => new Promise((resolve, reject) => {
    if (!process.env.SENDGRID_API_KEY) {
        console.log('Please provide a valid SENDGRID_API_KEY');
        return { error: 'CommerceQL is not configured to work with SendGrid.' };
    }
    const graphcool = graphcool_lib_1.fromEvent(event);
    const api = graphcool.api('simple/v1');
    mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
    const { node } = event.data.Order;
    if (node.fulfillmentStatus === 'FULFILLED') {
        sendEmail(node)
            .then(() => resolve())
            .catch(error => resolve({ error: error.message }));
    }
});
const sendEmail = order => {
    const { email, billingName } = order;
    const message = {
        to: email,
        from: `${process.env.STORE_NAME} <${process.env.STORE_EMAIL}>`,
        subject: `Your order has been dispatched!`,
        text: `Hi ${billingName}. Your order has been dispatched!`,
        html: `
      <p>Hi ${billingName}</p>
      <p>Your order has been dispatched!</p>
    `,
    };
    return new Promise((resolve, reject) => {
        mail_1.default
            .send(message)
            .then(() => {
            return resolve({ data: { success: true } });
        })
            .catch(error => {
            console.log('Email could not be sent because an error occured:');
            console.log(error);
            return reject({ error: error.message });
        });
    });
};
//# sourceMappingURL=sendShippingEmail.js.map