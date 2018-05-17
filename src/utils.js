const isInt = require('validator/lib/isInt')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

function isNegativeInt(int) {
  return !isInt(int.toString(), { gt: -1 })
}

function calculateOrderTotal(items) {
  return items.reduce((sum, item) => {
    const { amount = 0, quantity = 1 } = item

    if (isNegativeInt(amount)) {
      throw new Error(`The amount ${amount} must be a positive integer`)
    }

    if (isNegativeInt(quantity)) {
      throw new Error(`The quantity ${quantity} must be a positive integer`)
    }

    return sum + amount * quantity
  }, 0)
}

function stripeCharge(charge) {
  return stripe.charges.create(charge)
}

module.exports = {
  isNegativeInt,
  calculateOrderTotal,
  stripeCharge
}
