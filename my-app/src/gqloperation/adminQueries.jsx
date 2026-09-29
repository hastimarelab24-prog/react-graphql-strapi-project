import { gql } from "@apollo/client";

export const GET_ALL_ORDERS = gql`
  query GetAllOrders {
    orders {
      documentId
      orderId
      amount
      state
      shippingAddress
      city
      pin
      email
      paymentId
      paymentStatus
      createdAt
    }
  }
`;
