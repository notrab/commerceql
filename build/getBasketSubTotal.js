"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphcool_lib_1 = require("graphcool-lib");
module.exports = event => new Promise((resolve, reject) => {
    const basketId = event.data.basketId;
    const graphcool = graphcool_lib_1.fromEvent(event);
    const api = graphcool.api('simple/v1');
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
    `;
    const variables = {
        basketId,
    };
    const calculateSubTotal = items => {
        return items.reduce((sum, item) => sum + item.orderedItem.amount * item.quantity, 0);
    };
    return api
        .request(query, variables)
        .then(({ Basket }) => {
        if (!Basket) {
            throw new Error(`Invalid basketId ${basketId}`);
        }
        return Basket.items;
    })
        .then(items => calculateSubTotal(items))
        .then(subTotal => {
        resolve({
            data: {
                subTotal,
            },
        });
    })
        .catch(error => resolve({ error: error.message }));
});
//# sourceMappingURL=getBasketSubTotal.js.map