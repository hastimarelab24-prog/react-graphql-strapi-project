import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react/hooks";

export const GET_ALL_ORDERS = gql`
  query GetAllOrders {
    orders: adminOrders {
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

export const useAdminOrders = () => {
  const { data, loading, error, refetch } = useQuery(GET_ALL_ORDERS, {
    fetchPolicy: "network-only",
  });

  const orders = data?.orders || [];

  return {
    orders,
    loading,
    error,
    refetch,
  };
};

export default useAdminOrders;