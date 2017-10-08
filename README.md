![commerceql-banner](https://i.imgur.com/XKzkoPt.png)

# CommerceQL Platform Module 🛍

⚠️ WIP

CommerceQL is a minimalist serverless eCommerce module, designed to run on [Graphcool](https://graph.cool).

CommerceQL can be used to build a custom GraphQL backed online store, without the limitations of hosted solutions.

## Typical Application Flow

You're free to implement the provided functions how you like. A CRUD API comes fully baked, so you're free to perform mutations like `createProduct` and `updateProduct`, etc.

When using the CommerceQL Platform module, we recommend the following flow inside your applications:

### 1. `createCart`
  ```graphql
  mutation {
    createCart {
      id
    }
  }
  ```

### 2. `addItemToCart(productId: ID!, cartId: ID!, quantity: Int)`
  ```graphql
  mutation {
    addItemToCart(productId: "cj8j26cweq8wb0166lp32ujz4", cartId: "cj8j27lkvx8rg0130m43s1w7n", quantity: 3) {
      id
    }
  }
  ```

### 3. `getCart(id: ID!)`
  ```graphql
  mutation {
    getCart(id: "cj8j27lkvx8rg0130m43s1w7n") {
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
      cartId: "cj8j27lkvx8rg0130m43s1w7n"
      firstName: "..."
      lastName: "..."
      email: "..."
      billingName: "..."
      billingLine1: "..."
      billingLine2: ""
      billingCity: "..."
      billingState: "..."
      billingCountry: "..."
      billingPostalCode: "..."
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

## Get Started

- Create or open an existing [graphcool-cli](https://github.com/graphcool) project.

  ```bash
  graphcool init # for new projects
  graphcool modules add commerceql/platform
  ```

## Configuration

## Build

## Deploy
