const Subscription = {
  orders: {
    subscribe: async (_, args, ctx, info) => {
      return ctx.db.subscription.order({}, info)
    }
  },

  payments: {
    subscribe: async (_, args, ctx, info) => {
      return ctx.db.subscription.payment({}, info)
    }
  }
}

module.exports = { Subscription }
