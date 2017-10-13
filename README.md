![commerceql-banner](https://i.imgur.com/XKzkoPt.png)

# CommerceQL Platform 🛍

CommerceQL is a minimalist serverless eCommerce template, designed to run on [Graphcool](https://graph.cool).

CommerceQL can be used to build a custom GraphQL backed online store, without the limitations of hosted solutions.

**⚠️ This project is a work in progress**

## Get Started

- Create or add to an existing [graphcool-cli](https://github.com/graphcool/graphcool) service.

  ```bash
  npm install -g graphcool@next
  mkdir my-online-store-platform && cd "$_"
  graphcool init # use this to create a new Graphcool service
  graphcool add-template commerceql/commerceql
  ```

## Configure

Uncomment lines in `graphcool.yml` and `types.graphql` to enable the platform.

The following **environment variables** are required:

* `STRIPE_KEY`: Your [Stripe](https://stripe.com) key
* `SENDGRID_API_KEY`: Your [SendGrid](https://sendgrid.com) API key.

_You can easily configure these by using a `.envrc` file and [direnv](https://direnv.net)._

## Integrate

_**This part is down to you.**_

You can extend the CommerceQL platform by adding additional functions, types and permissions, or you can use it "as is" and start selling 💰.

## Deploy

Once you're finished integrating CommerceQL with any additional functionality, it's time to deploy.

You will need to have the **environment variables** set during each deployment.

  ```bash
  graphcool deploy
  ```

## Typical Application Flow

CommerceQL provides a basic `Product`, `Basket`, `Order` & `Checkout` API, leaving the rest up to you. Every store is different and you shouldn't be forced to build your store around a complicated set of constraints.

CommerceQL ships with a CRUD API out of the box, so you're free to perform mutations like `createProduct` and `updateProduct`, etc 🙌.

When using the CommerceQL Platform template, we recommend the following flow inside your applications:

- #### `addItemToBasket(productId: ID!, basketId: ID, quantity: Int)`

  This mutation will add a product to the `Basket` as a `BasketItem`. If you do not provide a `basketId`, one will be assigned in the response. You can use this to add additional `BasketItem`'s.

- #### `getBasket(id: ID)`

  This query will provide you with details about the `Basket`, including `id`, `subTotal` and `items`. If you don't have a `basketId`, one will be assigned in the response.

- #### `Checkout(...)`

- #### `Pay(checkoutId: ID!, stripeToken: String!)`

# TODO: Cleanup
_Will clean this up later._

### 1. `createBasket`
  ```graphql
  mutation {
    createBasket {
      id
    }
  }
  ```

### 2. `addItemToBasket(productId: ID!, basketId: ID!, quantity: Int)`
  ```graphql
  mutation {
    addItemToBasket(productId: "cj8j26cweq8wb0166lp32ujz4", basketId: "cj8j27lkvx8rg0130m43s1w7n", quantity: 3) {
      id
    }
  }
  ```

### 3. `getBasket(id: ID!)`
  ```graphql
  mutation {
    getBasket(id: "cj8j27lkvx8rg0130m43s1w7n") {
      id
      items {
        id
        orderedItem {
          name
          sku
          amount
        }
        quantity
      }
    }
    }
  }
  ```

### 5. `Checkout(...)`
  ```graphql
  mutation {
    Checkout(
      stripeToken: "tok_visa_debit"
      basketId: "cj8j27lkvx8rg0130m43s1w7n"
      firstName: "..."
      lastName: "..."
      email: "..."
      billingName: "..."
      billingLine1: "..."
      billingLine2: ""
      billingCity: "..."
      billingState: "..."
      billingPostalCode: "..."
      billingCountry: "..."
      shippingName: "..."
      shippingLine1: "..."
      shippingLine2: ""
      shippingCity: "..."
      shippingState: "..."
      shippingPostalCode: "..."
      shippingCountry: "..."
      shippingInstructions: "Leave in porch"
      ) {
        id
        stripeCustomerId
        firstName
        lastName
        email
      }
  }
  ```
