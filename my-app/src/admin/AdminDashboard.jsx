import { useQuery } from '@apollo/client/react'
import React, { use } from 'react'
import { GET_ALL_ORDERS } from '../gqloperation/adminQueries'

function AdminDashboard() {
    const {data, loading, error} =useQuery(GET_ALL_ORDERS);
    if(loading) return <p>Loading....</p>
    if(error) {
        return <p> Error: {error.message}</p>
    }
    const orders = data?.orders || [];
    const totalOrders =orders.length;
    const totalSales = orders.filter((orders.paymentStatus
        
    ))
  return (
    <div className='min-h-screen bg-gray-100 p-6'>
        <h1 className='mb-6 text-3xl font-bold'>
            Amin Dashboard
        </h1>

        <div>
            {/* total orders */}
            <div>
                <h2>
                    Total Orders
                    <p>
                        {totalOrders}
                    </p>
                </h2>
            </div>
        </div>
    </div>
  )
}

export default AdminDashboard