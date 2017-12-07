import { fromEvent, FunctionEvent } from 'graphcool-lib'
import { GraphQLClient } from 'graphql-request'

interface EventData {
  basketId: string
}

interface Basket {
  id: string
  items: [Item]
}

interface Product {
  amount: number
}

interface Item {
  id: string
  quantity: number
  orderedItem: Product
}

export default async (event: FunctionEvent<EventData>) => {
  console.log(event)

  try {
    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')

    const { basketId } = event.data

    const { Basket } = await getBasket(api, basketId)

    if (!Basket) {
      return { error: `Invalid basketId ${basketId}` }
    }

    const subTotal = calculateSubTotal(Basket.items)
    const totalItems = Basket._itemsMeta.count
    const uniqueItems = Basket.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    )

    return {
      data: {
        subTotal,
        totalItems,
        uniqueItems
      }
    }
  } catch (e) {
    console.log(e)

    return { error: 'Basket sub total could not be calculated' }
  }
}

const calculateSubTotal = (items: [Item]): number => {
  if (items.length === 0) {
    return 0
  }

  return items.reduce(
    (sum, item) => sum + item.orderedItem.amount * item.quantity,
    0
  )
}

const getBasket = async (
  api: GraphQLClient,
  basketId: string
): Promise<any> => {
  const query = `
  query getBasket($basketId: ID!) {
    Basket(id: $basketId) {
      id
      items {
        id
        quantity
        orderedItem {
          amount
        }
      }
      _itemsMeta {
        count
      }
    }
  }
  `

  const variables = {
    basketId
  }

  return api.request(query, variables)
}
