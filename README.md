![commerceql-banner](https://i.imgur.com/XKzkoPt.png)

<h1 align="center">CommerceQL Platform 🛍</h1>

<p align="center">[Website](https://commerceql.com) • [Demo Store](https://demo.commerceql.com) • [Watch the video demo](https://commerceql.com/#video)</p>

<p align="center">CommerceQL is a minimalist serverless eCommerce template, designed to run on [Graphcool](https://graph.cool).</p>

## Contents

* [Setup](#setup)
* [Configure](#configure)
* [Integrate](#integrate)
* [Deploy](#deploy)
* [Typical Application Flow](#typical-application-flow)

## <a name="setup"></a>Setup

CommerceQL is designed to be used with the [Graphcool Framework](https://github.com/graphcool/graphcool).

You will need to be running the latest version of the Graphcool CLI to get started with CommerceQL.

  ```bash
  npm install -g graphcool@next
  mkdir my-online-store-platform && cd "$_"
  graphcool init # use this to create a new Graphcool service
  graphcool add-template commerceql/commerceql
  ```

## <a name="configure"></a>Configure

Once setup, you will need to uncomment lines in `graphcool.yml` and `types.graphql` to enable the platform inside your Graphcool service.

The following **environment variables** are required:

* `STRIPE_KEY`: Your [Stripe](https://stripe.com) key
* `SENDGRID_API_KEY`: Your [SendGrid](https://sendgrid.com) API key
* `STORE_NAME`: The name of your store, used for system emails
* `STORE_EMAIL`: The main email where people can reach you, used for system emails

_You can easily configure these by using a `.envrc` file and [direnv](https://direnv.net)._

```bash
export STRIPE_KEY=
export SENDGRID_API_KEY=
export STORE_NAME=
export STORE_EMAIL=
```

## <a name="integrate"></a>Integrate

CommerceQL can be used to build a custom GraphQL backed online store, without the limitations of hosted solutions.

You can extend the CommerceQL platform by adding additional functions, types and permissions, or you can use it "as is" and start selling 💰.

## <a name="deploy"></a>Deploy

Once you're finished integrating CommerceQL with any additional functionality, it's time to deploy.

You will need to have the **environment variables** set during each deployment.

  ```bash
  graphcool deploy
  ```

You can deploy locally, to your own server or use Graphcool to host your service/database. See the [Graphcool CLI](https://github.com/graphcool/graphcool#deployment) for more details.

## <a name="typical-application-flow"></a>Typical Application Flow

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
