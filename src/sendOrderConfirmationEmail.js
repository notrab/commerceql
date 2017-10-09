'use latest'

const sgMail = require('@sendgrid/mail')
const { fromEvent } = require('graphcool-lib')

module.exports = event =>
  new Promise((resolve, reject) => {
    if (!process.env.SENDGRID_API_KEY) {
      console.log('Please provide a valid SENDGRID_API_KEY')
      resolve({ error: 'CommerceQL is not configured to work with SendGrid.' })
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const { node } = event.data.Order

    const message = {
      to: node.email,
      from: `${process.env.STORE_NAME} <${process.env.STORE_EMAIL}>`,
      subject: `We've got your order!`,
      text: `Hi ${node.firstName}. Your order has been received!`,
      html: `
        <p>${node.firstName}</p>
        <p>Just to let you know, your order has been received!</p>
      `
    }

    sgMail
      .send(message)
      .then(() => {
        return { data: { success: true } }
      })
      .catch(error => {
        console.log('Email could not be sent because an error occured:')
        console.log(error)

        return { data: { success: false } }
      })
  })()
