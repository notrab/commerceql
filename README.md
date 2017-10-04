![commerceql-banner](https://i.imgur.com/XKzkoPt.png)

# CommerceQL Platform Module 🛍

⚠️ WIP

CommerceQL is a minimalist serverless eCommerce module, designed to run on [Graphcool](https://graph.cool).

CommerceQL can be used to build a custom GraphQL backed online store, without the limitations of hosted solutions.

## Typical Application Flow

You're free to implement the provided functions how you like, but typically we recommend the following flow inside your applications:

1. `createCart`
2. `addItemToCart(productId: "...", cartId: "...", quantity: 3)`
3. `getCart(id: "...")`
5. `Checkout(...)`

## Get Started

- Create or open an existing [graphcool-cli@beta](https://github.com/graphcool/graphcool-cli) project.

  ```bash
  graphcool init # for new projects
  graphcool module add commerceql/platform
  ```

## Configuration

## Build

## Deploy
