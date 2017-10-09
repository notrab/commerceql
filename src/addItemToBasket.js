'use latest'

const { fromEvent } = require('graphcool-lib')

module.exports = event =>
  new Promise((resolve, reject) => {
    const { BasketId, productId, quantity = 1 } = event.data

    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')

    const checkBasketItemExists = (BasketId, productId) => {
      return api.request(
        `
        query isItemInBasket($BasketId:ID!, $productId:ID!) {
          allBasketItems(filter:{
            Basket:{
              id: $BasketId
            },
            orderedItem:{
              id: $productId
            }
          }) {
            id
            quantity
          }
        }
      `,
        {
          BasketId,
          productId
        }
      )
    }

    const createBasketItem = (BasketId, productId, quantity) => {
      return api.request(
        `
        mutation createBasketItem($BasketId: ID!, $productId: ID!, $quantity: Int) {
          BasketItem: createBasketItem(BasketId: $BasketId, orderedItemId: $productId, quantity: $quantity) {
      			id
            quantity
          }
        }
      `,
        {
          BasketId,
          productId,
          quantity
        }
      )
    }

    const updateBasketItemQuantity = (id, quantity) => {
      return api.request(
        `
        mutation updateBasketItem($id: ID!, $quantity: Int!) {
          BasketItem: updateBasketItem(id: $id, quantity: $quantity) {
            id
            quantity
          }
        }
      `,
        {
          id,
          quantity
        }
      )
    }

    return checkBasketItemExists(BasketId, productId)
      .then(({ allBasketItems }) => {
        if (!allBasketItems) {
          return createBasketItem(BasketId, productId, quantity)
        } else {
          return updateBasketItemQuantity(
            allBasketItems[0].id,
            allBasketItems[0].quantity + quantity
          )
        }
      })
      .then(({ BasketItem: { id, quantity } }) => {
        resolve({
          data: {
            id,
            quantity
          }
        })
      })
      .catch(error => resolve({ error: error.message }))
  })
