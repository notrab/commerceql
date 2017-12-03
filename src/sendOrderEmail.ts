'use latest'

const sgMail = require('@sendgrid/mail')

module.exports = event => {
  if (!process.env['SENDGRID_API_KEY']) {
    console.log('Please provide a valid SENDGRID_API_KEY')
    return { error: 'CommerceQL is not configured to work with SendGrid.' }
  }

  sgMail.setApiKey(process.env['SENDGRID_API_KEY'])

  const { node } = event.data.Order

  const message = {
    to: node.email,
    from: `${process.env['STORE_NAME']} <${process.env['STORE_EMAIL']}>`,
    subject: `We've got your order!`,
    text: `Hi ${node.billingName}. Your order has been received!`,
    html: `
      <p>Hi ${node.billingName}</p>
      <p>Your order has been received!</p>
    `,
  }

  return new Promise((resolve, reject) => {
    sgMail
      .send(message)
      .then(() => {
        return resolve()
      })
      .catch(error => {
        console.log('Email could not be sent because an error occured:')
        console.log(error)

        return resolve({ error: error.message })
      })
  })
}
