import { fromEvent, FunctionEvent } from 'graphcool-lib'
import { GraphQLClient } from 'graphql-request'

interface BasketItem {
  id: string
  quantity: number
}

interface AllBasketItems {
  id: string
  quantity: number
}

export default async (event: FunctionEvent<{}>) => {
  console.log(event)

  try {
    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')

    const { basketId, productId, quantity = 1 } = event.data

    const allBasketItems: AllBasketItems = await checkBasketItemExists(
      api,
      basketId,
      productId,
    ).then(r => r.allBasketItems)

    if (!allBasketItems) {
      const basketItem: BasketItem = await createBasketItem(
        api,
        basketId,
        productId,
        quantity,
      )
      return basketItem
    }

    const updatedBasketItem: BasketItem = await updatedBasketItem(
      api,
      allBasketItems[0].id,
      allBasketItems[0].quantity + quantity,
    ).then(r => r.data)

    return updatedBasketItem

    // return checkBasketItemExists(api, basketId, productId)
    //   .then(({ allBasketItems }) => {
    //     if (!allBasketItems) {
    //     return createBasketItem(api, basketId, productId, quantity).then(r => r.data)
    //     } else {
    //       return updateBasketItemQuantity(
    //         api,
    //         allBasketItems[0].id,
    //         allBasketItems[0].quantity + quantity
    //       )
    //     }
    //   })
    //   .then(data => {
    //     console.log(data)
    //
    //     // const {BasketItem: {id, quantity}} = data
    //
    //     const id = 'abc'
    //     const quantity = 1
    //
    //     resolve({
    //       data: {
    //         id,
    //         quantity,
    //       },
    //     })
    //   })
    //   .catch(error => resolve({ error: error.message }))
  } catch (e) {
    console.log(e)
    return { error: 'An unexpected error occuring adding Item to Basket' }
  }
}

const checkBasketItemExists = async (
  api: GraphQLClient,
  basketId: string,
  productId: string,
): Promise<{ BasketItem }> => {
  const query = `
      query isItemInBasket($basketId:ID!, $productId:ID!) {
        allBasketItems(filter: {
          basket: {
            id: $basketId
          },
          orderedItem: {
            id: $productId
          }
        }) {
          id
          quantity
        }
      }
    `

  const variables = {
    basketId,
    productId,
  }

  return api.request<{ BasketItem }>(query, variables)
}

const createBasketItem = async (
  api: GraphQLClient,
  basketId: string,
  productId: string,
  quantity: number,
): Promise<{ BasketItem }> => {
  const mutation = `
      mutation createBasketItem($basketId: ID!, $productId: ID!, $quantity: Int) {
        BasketItem: createBasketItem(basketId: $basketId, orderedItemId: $productId, quantity: $quantity) {
          id
          quantity
        }
      }
    `

  const variables = {
    basketId,
    productId,
    quantity,
  }

  return api.request<{ BasketItem }>(mutation, variables)
}

const updateBasketItemQuantity = async (
  api: GraphQLClient,
  id: string,
  quantity: number,
): Promise<{ BasketItem }> => {
  const mutation = `
      mutation updateBasketItem($id: ID!, $quantity: Int!) {
        BasketItem: updateBasketItem(id: $id, quantity: $quantity) {
          id
          quantity
        }
      }
    `

  const variables = {
    id,
    quantity,
  }

  return api.request<{ BasketItem }>(mutation, variables)
}
