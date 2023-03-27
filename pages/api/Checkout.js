import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from 'next/router';

import { useStateContext } from '../../context/StateContext';
import { CLIENT_ID } from '../../config/config';

const Checkout = () => {
  const { cartItems, totalPrice } = useStateContext();
  const router = useRouter()

  const options = {
    "client-id": CLIENT_ID,
    currency: "USD"
  }

  return (
    <PayPalScriptProvider options={options}>
      <PayPalButtons
        style={{ color: 'blue' }}
        className='payment-card'
        createOrder={(data, actions) => {
          let newOrder = {
            amount: {
              currency_code: 'USD',
              value: totalPrice,
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: totalPrice
                }
              }
            },
            items: []
          }

          cartItems.map(item => {
            newOrder.items.push(
              {
                name: item.name,
                description: item.description,
                unit_amount: {
                  currency_code: "USD",
                  value: item.price
                },
                quantity: item.quantity
              }
            );
          });

          return actions.order.create({ purchase_units: [newOrder] });
        }}

        onCancel={(data, actions) => {
          // Nothing happens
        }}

        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            router.push('/success');
          });
        }}

        onError={(data, actions) => {
          return actions.order.capture().then((details) => {
            // router.push('/error');
          });
        }}
      />
    </PayPalScriptProvider>
  );
}

export default Checkout;