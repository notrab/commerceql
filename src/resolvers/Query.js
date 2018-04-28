const Query = {
  order: (_, { id }, ctx, info) => {
    return ctx.db.query.order({ where: { id } }, info)
  },

  orders: (_, args, ctx, info) => {
    return ctx.db.query.orders({}, info)
  }
}

module.exports = { Query }
