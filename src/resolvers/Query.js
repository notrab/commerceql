const Query = {
  order: (_, { id }, ctx, info) => {
    return ctx.db.query.order({ where: { id } }, info)
  },

  orders: (
    _,
    { where, orderBy, skip, after, before, first, last },
    ctx,
    info
  ) => {
    return ctx.db.query.orders(
      { where, orderBy, skip, after, before, first, last },
      info
    )
  }
}

module.exports = { Query }
