const Subscription = {
  ordersSubscription: {
    subscribe: async (_, args, ctx, info) => {
      return ctx.db.subscription.orders({}, info)
    }
  }
}

module.exports = { Subscription }
