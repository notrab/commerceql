'use latest'

const stripe = require('stripe')(process.env.STRIPE_KEY)
const { fromEvent } = require('graphcool-lib')

module.exports = event =>
  new Promise((resolve, reject) => {
    let { BasketId } = event.data

    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')

    const getBasket = BasketId => {
      const query = `query getBasketById($BasketId: ID!) {
        Basket(id: $BasketId) {
          id
          items {
            id
            quantity
            orderedItem {
              id
              name
              sku
              amount
            }
          }
        }
      }`

      const variables = {
        BasketId
      }

      return api.request(query, variables)
    }

    const getOrCreateStripeCustomer = (user, stripeToken) => {
      if (user.stripeCustomerId) {
        return Promise.resolve(user.stripeCustomerId)
      }

      const { email, firstName, lastName } = user

      return new Promise((resolve, reject) => {
        stripe.customers.create(
          {
            email,
            description: `${firstName} ${lastName}`,
            source: stripeToken
          },
          (err, customer) => {
            if (err) {
              reject(err)
            } else {
              resolve(customer.id)
            }
          }
        )
      })
    }

    // clean up
    // sanitize
    // pass in data object as arg instead of relying on event.data
    const chargeStripeCustomer = (amount, description, stripeCustomerId) =>
      new Promise((resolve, reject) => {
        let charge = {
          amount,
          description,
          currency: event.data.currency || 'gbp',
          customer: stripeCustomerId,
          receipt_email: event.data.email,
          shipping: {
            address: {
              city: event.data.shippingCity,
              country: event.data.shippingCountry,
              line1: event.data.shippingLine1,
              line2: event.data.shippingLine2,
              postal_code: event.data.shippingPostalCode,
              state: event.data.shippingState
            },
            name: `${event.data.firstName} ${event.data.lastName}`
          },
          metadata: {
            shipping_instructions: event.data.shippingInstructions
          }
        }

        if (event.data.phone) {
          let charge = Object.assign({}, charge, {
            receipt_phone: event.data.phone
          })
        }

        return stripe.charges.create(charge, (err, charge) => {
          if (err) {
            // handle declined transaction
            // update Basket as payment failed
            reject(err)
          } else {
            resolve(stripeCustomerId)
          }
        })
      })

    const convertBasketToOrder = variables => {
      const mutation = `mutation createOrder(
        $stripeCustomerId: String!
        $BasketId: String!
        $email: String!
        $billingName: String!
        $billingLine1: String!
        $billingLine2: String
        $billingCity: String
        $billingState: String!
        $billingPostalCode: String!
        $billingCountry: String!
        $shippingName: String!
        $shippingLine1: String!
        $shippingLine2: String
        $shippingCity: String
        $shippingState: String!
        $shippingPostalCode: String!
        $shippingCountry: String!
        $shippingInstructions: String
        $orderTotal: Int!
      ) {
        createOrder(
          stripeCustomerId: $stripeCustomerId
          BasketId: $BasketId
          email: $email
          billingName: $billingName
          billingLine1: $billingLine1
          billingLine2: $billingLine2
          billingCity: $billingCity
          billingState: $billingState
          billingPostalCode: $billingPostalCode
          billingCountry: $billingCountry
          shippingName: $shippingName
          shippingLine1: $shippingLine1
          shippingLine2: $shippingLine2
          shippingCity: $shippingCity
          shippingState: $shippingState
          shippingPostalCode: $shippingPostalCode
          shippingCountry: $shippingCountry
          shippingInstructions: $shippingInstructions
          orderTotal: $orderTotal
        ) {
          id
          stripeCustomerId
          BasketId
          email
          billingName
          billingLine1
          billingLine2
          billingCity
          billingState
          billingPostalCode
          billingCountry
          shippingName
          shippingLine1
          shippingLine2
          shippingCity
          shippingState
          shippingPostalCode
          shippingCountry
          shippingInstructions
          orderTotal
        }
      }`

      return api.request(mutation, variables)
    }

    return getBasket(BasketId)
      .then(({ Basket }) => {
        if (!Basket) {
          throw new Error(`Invalid BasketId ${BasketId}`)
        }

        const { items } = Basket

        const { data } = event
        const {
          stripeToken,
          firstName,
          lastName,
          email,
          stripeCustomerId
        } = data

        // cleanup
        const user = !!stripeCustomerId
          ? { firstName, lastName, email }
          : { firstName, lastName, email, stripeCustomerId }

        // cleanup
        const orderTotal = getOrderTotal(items)
        const description = getDescription(items)

        // Convert to async/await
        return getOrCreateStripeCustomer(user, stripeToken)
          .then(stripeCustomerId =>
            chargeStripeCustomer(orderTotal, description, stripeCustomerId)
          )
          .then(stripeCustomerId =>
            convertBasketToOrder(
              Object.assign({}, data, {
                stripeCustomerId,
                orderTotal
              })
            )
          )
          .then(({ createOrder }) => {
            return resolve(
              Object.assign(
                {},
                {
                  data: createOrder
                },
                user
              )
            )
          })
      })
      .catch(error => resolve({ error: error.message }))
  })

const getOrderTotal = items =>
  items.reduce((sum, item) => sum + item.orderedItem.amount * item.quantity, 0)

const getDescription = items =>
  items
    .map(item => `${item.quantity}x ${item.orderedItem.name}: $${item.amount}`)
    .join(', ')
