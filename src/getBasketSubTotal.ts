import { fromEvent, FunctionEvent } from 'graphcool-lib'

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
    const { basketId } = event.data

    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')

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
        }
      }
    `

    const variables = {
      basketId,
    }

    const subTotal: number = await api
      .request(query, variables)
      .then(({ Basket }) => {
        if (!Basket) {
          return { error: `Invalid basketId ${basketId}` }
        }

        return Basket.items
      })
      .then(items => calculateSubTotal(items))

    return {
      data: {
        subTotal,
      },
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
    0,
  )
}
