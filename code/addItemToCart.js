'use latest';

const {fromEvent} = require('graphcool-lib');

module.exports = event => {
  return new Promise((resolve, reject) => {
    const {cartId, productId, quantity} = event.data;

    const graphcool = fromEvent(event);
    const api = graphcool.api('simple/v1');

    const checkCartItemExists = (cartId, productId) => {
      return api.request(
        `
        query isItemInCart($cartId:ID!, $productId:ID!) {
          allCartItems(filter:{
            cart:{
              id: $cartId
            },
            orderedItem:{
              id: $productId
            }
          }) {
            id
            quantity
          }
        }
      `,
        {
          cartId,
          productId
        }
      );
    };

    const createCartItem = (cartId, productId, quantity) => {
      return api.request(
        `
        mutation createCartItem($cartId: ID!, $productId: ID!, $quantity: Int) {
          CartItem: createCartItem(cartId: $cartId, orderedItemId: $productId, quantity: $quantity) {
      			id
            quantity
          }
        }
      `,
        {
          cartId,
          productId,
          quantity
        }
      );
    };

    const updateCartItemQuantity = (id, quantity) => {
      return api.request(
        `
        mutation updateCartItem($id: ID!, $quantity: Int!) {
          CartItem: updateCartItem(id: $id, quantity: $quantity) {
            id
            quantity
          }
        }
      `,
        {
          id,
          quantity
        }
      );
    };

    return checkCartItemExists(cartId, productId)
      .then(({allCartItems}) => {
        if (!allCartItems) {
          return createCartItem(cartId, productId, quantity);
        } else {
          // refactor
          return updateCartItemQuantity(allCartItems[0].id, allCartItems[0].quantity + 1);
        }
      })
      .then(({CartItem: {id, quantity}}) => {
        resolve({
          data: {
            id,
            quantity
          }
        });
      })
      .catch(error => resolve({error: error.message}));
  });
};
