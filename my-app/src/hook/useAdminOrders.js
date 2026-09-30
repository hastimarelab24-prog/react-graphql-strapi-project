import { useQuery } from '@apollo/client/react'
import React from 'react'
import { GET_ALL_ORDERS } from '../gqloperation/adminQueries'

const useAdminOrders = () => {
    const {data,loading,error}=useQuery(GET_ALL_ORDERS);
    const orders=data?.orders || [];
    const totalOrders=orders.length;
    const pendingOrders=orders.filter((order)=>order.status?.toLowerCase()==="pending").length;
  
  const totalSales=orders.reduce((total,order)=>total+Number(order.totalAmount || 0),0)
    return {
        orders,loading,error,totalOrders,pendingOrders,totalSales,
    }
}

export default useAdminOrders