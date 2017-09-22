'use latest';

const {fromEvent} = require('graphcool-lib');

module.exports = function(event) {
  return new Promise((resolve, reject) => {
    const cartId = event.data.cartId;

    const graphcool = fromEvent(event);
    const api = graphcool.api('simple/v1');

    const query = `
      query getCart($cartId: ID!) {
        Cart(id: $cartId) {
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
    `;

    const variables = {
      cartId
    };

    const calculateSubTotal = items => {
      return items.reduce((sum, item) => sum + item.orderedItem.amount * item.quantity, 0);
    };

    return api
      .request(query, variables)
      .then(({Cart}) => {
        if (!Cart) {
          throw new Error(`Invalid cartId ${cartId}`);
        }

        return Cart.items;
      })
      .then(items => calculateSubTotal(items))
      .then(subTotal => {
        resolve({
          data: {
            subTotal
          }
        });
      })
      .catch(error => resolve({error: error.message}));
  });
};
