import { gql } from "@apollo/client";

export const GET_ALL_ORDERS = gql`
  query GetAllOrders {
    orders {
      documentId
      orderId
      amount
      paymentStatus
      paymentId
      orderStatus
      shippingAddress
      city
      state
      pin
      items
      createdAt
    }
  }
`;

export const GET_ADMIN_USERS = gql`
  query GetAdminUsers {
    usersPermissionsUsers {
      username
      email
      confirmed
      blocked
      createdAt
    }
  }
`;

export const GET_ALL_CUSTOMER = gql`
  query GetAllCustomer {
    usersPermissionsUsers {
      data {
        id
        username
        email
      }
    }
  }
`;