'use latest'

const { fromEvent } = require('graphcool-lib')

module.exports = event =>
  new Promise((resolve, reject) => {
    const BasketId = event.data.BasketId

    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')

    const query = `
      query getBasket($BasketId: ID!) {
        Basket(id: $BasketId) {
          id
          items {
            id
            quantity
            orderedItem {
              amount
            }
          }
        }
      }
    `

    const variables = {
      BasketId
    }

    const calculateSubTotal = items => {
      return items.reduce(
        (sum, item) => sum + item.orderedItem.amount * item.quantity,
        0
      )
    }

    return api
      .request(query, variables)
      .then(({ Basket }) => {
        if (!Basket) {
          throw new Error(`Invalid BasketId ${BasketId}`)
        }

        return Basket.items
      })
      .then(items => calculateSubTotal(items))
      .then(subTotal => {
        resolve({
          data: {
            subTotal
          }
        })
      })
      .catch(error => resolve({ error: error.message }))
  })
