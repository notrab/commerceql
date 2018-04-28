<p align="center"><a href="https://www.commerceql.com"><img src="https://i.imgur.com/zPKLBwG.png" title="Serverless GraphQL eCommerce platform" alt="CommerceQL" width="381"></a></p>

CommerceQL is a minimalist eCommerce [GraphQL](https://prismagraphql.com) boilerplate.

## Contents

* [Setup](#setup)
* [Configure](#config)
* [Development](#dev)
* [Deploy](#deploy)
* [Usage](#usage)
* [Sponsors](#sponors)

## <a name="setup"></a>Setup

You will need to be running the latest version of `graphql-cli`, `prisma` and have a [Prisma](https://prismagraphql.com) account too.

```bash
npm install -g graphql-cli prisma
graphql create my-commerce-app --boilerplate commerceql/commerceql
cd my-commerce-app
yarn dev
```

## <a name="config"></a>Configure

The setup above should take care of configuring your `ENV` with your Prisma endpoint. You'll want to configure Stripe so you can begin to take payments using the `checkout` mutation.

Go ahead and add your `STRIPE_SECRET_KEY` inside `.env`.

⚠️ Note: This boilerplate doesn't handle auth. You'll want to protect the `order/s` queries.

## <a name="dev"></a>Development

CommerceQL can be used to build a custom GraphQL backed online store, without the limitations of hosted solutions.

You can extend the CommerceQL platform by adding additional functions, types and permissions, or you can use it "as is" and start selling 💰.

## <a name="deploy"></a>Deploy

You can immediately deploy "as is" to [Zeit Now](https://now.sh) using the preconfigured `now.json`. You'll want to add your `alias` to this file for easier deployment.

If you make any changes to the schema or resolvers, you'll want to run `prisma deploy` to update your prisma sandbox.

## Usage

Once you're up and running, locally with `yarn dev` or deployed to `now` you can start to run the provided queries, mutations and subscriptions.


### Mutations

#### Place an order
```graphql
mutation {
  checkout(
    email: "hi@jamiebarton.co.uk",
    token: "tok_visa",
    currency:GBP,
    items: [{
      description: "T-Shirt",
      amount: 1250,
      quantity: 1,
      metadata: {
        size: "Large",
        sex: "M",
        colour: "Red"
      }
    }, {
      description: "Trainers",
      amount: 7500,
      quantity: 1,
      metadata: {
        brand: "Nike",
        size: 11,
        range: "Samba"
      }
    }],
    metadata: {
      shipping_address: {
        line_1: "123 Commerce Road",
        country: "United Kingdom"
      }
    }
  ) {
    id
    total
    createdAt
  }
}
```

### Queries

#### Get all orders
```graphql
{
  order(id: "someID") {
    id
    email
    total
    currency
    metadata
    createdAt
    items {
      id
      description
      quantity
      amount
      metadata
    }
    payments {
      id
      status
      reference
      currency
      createdAt
    }
  }
}
```

#### Get an Order by ID
```graphql
{
  order(id: "someID") {
    id
    email
    total
     # ...
  }
}
```

### Subscriptions

#### Subscribe to new orders
```graphql
subscription {
  ordersSubscription {
    node {
      id
      email
      total
    }
    updatedFields
    previousValues {
      id
      email
      total
    }
  }
}
```

## <a name="sponsors"></a>Sponsors

❤️ This project is sponsored by [Moltin](https://moltin.com).