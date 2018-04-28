const isEmail = require('validator/lib/isEmail')
const isInt = require('validator/lib/isInt')

function isNegativeInt(int) {
  return !isInt(int.toString(), { gt: -1 })
}

function calculateOrderTotal(items) {
  items.reduce((sum, item) => {
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

module.exports = {
  isNegativeInt,
  calculateOrderTotal
}
