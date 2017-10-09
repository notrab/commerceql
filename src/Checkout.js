'use latest'

const stripe = require('stripe')(process.env.STRIPE_KEY)
const { fromEvent } = require('graphcool-lib')

module.exports = event =>
  new Promise((resolve, reject) => {
    let { cartId } = event.data

    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')

    const getCart = cartId => {
      const query = `query getCartById($cartId: ID!) {
        Cart(id: $cartId) {
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
        cartId
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

    const chargeStripeCustomer = (amount, description, stripeCustomerId) =>
      new Promise((resolve, reject) => {
        return stripe.charges.create(
          {
            amount,
            description,
            currency: 'gbp',
            customer: stripeCustomerId
          },
          (err, charge) => {
            if (err) {
              reject(err)
            } else {
              resolve(stripeCustomerId)
            }
          }
        )
      })

    const convertCartToOrder = variables => {
      const mutation = `mutation createOrder(
        $stripeCustomerId: String!
        $cartId: String!
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
          cartId: $cartId
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
          cartId
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

    return getCart(cartId)
      .then(({ Cart }) => {
        if (!Cart) {
          throw new Error(`Invalid cartId ${cartId}`)
        }

        const { items } = Cart

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
            convertCartToOrder(
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
