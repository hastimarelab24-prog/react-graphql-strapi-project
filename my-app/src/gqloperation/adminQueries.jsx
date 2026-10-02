import { gql } from "@apollo/client";

export const GET_ALL_ORDERS = gql`
  query GetAllOrders {
    orders {
      documentId
      shippingAddress
      city
      state
      amount
      items
      pin
      orderId
      email
      paymentId
      paymentStatus
      orderStatus
      createdAt
      updatedAt
    }
  }
`;


export const GET_ALL_USERS = gql`
  query GetAllUsers {
    usersPermissionsUsers {
      documentId
      username
      email
      confirmed
      createdAt
    }
  }
`;
