import { gql } from "@apollo/client";

export const GET_ALL_ORDERS = gql`
  query GetallOrders {
    orders(pagination: { limit: 100 }) {
      documentId
      orderId
      customerName
      email
      amount
      paymentStatus
      orderStatus
      paymentMethod
    }
  }
`;

export const GET_ALL_CUSTOMER = gql`
  query GetAllCustomer {
    usersPermissionUsers(pagination: { limit: 100 }) {
      data {
        id
        username
        email
      }
    }
  }
`;
