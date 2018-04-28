const isEmail = require('validator/lib/isEmail')
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const { calculateOrderTotal } = require('../utils')

const Mutation = {
  checkout: async (_, args, ctx, info) => {
    const { email, token, currency, items, ...rest } = args

    if (!isEmail(email)) {
      throw new Error(`${email} is not a valid email`)
    }

    const total = await calculateOrderTotal(items)

    const prismaOrder = await ctx.db.mutation.createOrder(
      {
        data: {
          items: { create: items },
          email,
          total,
          currency,
          ...rest
        }
      },
      info
    )

    try {
      const { id: reference, status } = await Stripe.charges.create({
        amount: total,
        currency,
        description: `Payment for order ${prismaOrder.id}`,
        source: token,
        receipt_email: email
      })

      await ctx.db.mutation.createPayment({
        data: {
          order: {
            connect: {
              id: prismaOrder.id
            }
          },
          status,
          reference,
          currency
        }
      })
    } catch (errors) {
      await ctx.db.mutation.createPayment({
        data: {
          order: {
            connect: {
              id: prismaOrder.id
            }
          },
          status: 'declined',
          reference: 'abc',
          currency
        }
      })

      return {
        errors
      }
    }

    return prismaOrder
  }
}

module.exports = { Mutation }
