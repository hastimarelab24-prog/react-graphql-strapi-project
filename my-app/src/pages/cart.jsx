import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutFrom from "../components/CheckoutFrom";
function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || [],
  );

// checkout function 
const handlecheckout=()=>{
  const jwt=localStorage.getItem("jwt");
  const user=localStorage.getItem("user");

  // userlogin not 
  if(!jwt || !user){
    navigate("/login",{
      state:{
        from:"/checkout",
      }
    });
    return;
  }
  // user login 
  navigate("/checkout")
}

  // REMOVE PRODUCT
  const removeFromCart = (documentId) => {
    const newCart = cart.filter((item) => item.documentId !== documentId);

    setCart(newCart);

    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // INCREASE QUANTITY

  const increaseQty = (documentId) => {
    const newCart = cart.map((item) => {
      if (item.documentId === documentId) {
        return {
          ...item,
          qty: item.qty + 1,
        };
      }

      return item;
    });

    setCart(newCart);

    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // DECREASE QUANTITY

  const decreaseQty = (documentId) => {
    const newCart = cart.map((item) => {
      if (item.documentId === documentId) {
        return {
          ...item,
          qty: item.qty > 1 ? item.qty - 1 : 1,
        };
      }

      return item;
    });

    setCart(newCart);

    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // TOTAL QUANTITY
  const totalQty = cart.reduce((total, item) => total + item.qty, 0);

  // TOTAL PRICE
  const totalprice = cart.reduce(
    (total, item) => total + Number(item.price) * item.qty,
    0,
  );

  // CHECKOUT
  // const [checkout, setCheckout] = useState(false);

  // if (checkout) {
  //   return (
  //     <div>
  //       <h4>Payment Page</h4>
  //       <CheckoutFrom />
  //       <button onClick={() => setCheckout(true)}>Cancel</button>
  //     </div>
  //   );
  // }
  //   const checkout = () => {
  //     // first check login
  //     const jwt=localStorage.getItem("jwt");
  //     if(!jwt){
  //         alert("please login first to checkout");
  //         navigate("/login")
  //         return;
  //     }

  //     // then check cart
  //     if (cart.length === 0) {
  //       alert("Your cart is empty");
  //       return;
  //     }
  // // checkout
  //     alert(
  //       `Checkout successfully!\n\nTotal Items: ${totalQty}\nTotal Price: $${totalprice}`
  //     );

  //     // Clear cart after checkout
  //     localStorage.removeItem("cart");
  //     setCart([]);
  //   };

  // EMPTY CART

  if (cart.length === 0) {
    return (
      <div className=" mt-16 min-h-screen bg-stone-100 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-stone-800 sm:text-4xl">
              Shopping Cart
            </h1>

            <p className="mt-2 text-stone-500">Review your selected products</p>
          </div>

          {/* Empty Cart */}
          <div className="rounded-3xl border border-stone-200 bg-white px-6 py-16 text-center shadow-md">
            {/* Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-stone-100">
              <span className="text-4xl">🛒</span>
            </div>

            <h2 className="mt-6 text-2xl font-bold text-stone-800">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-stone-500">
              You haven't added any products to your cart yet. Start shopping
              and add your favorite products.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // MAIN CART

  return (
    <div className=" mt-16 min-h-screen bg-stone-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* PAGE HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800 sm:text-4xl">
            Shopping Cart
          </h1>

          <p className="mt-2 text-stone-500">
            {totalQty} {totalQty === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {/* CART LAYOUT */}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* PRODUCTS */}

          <div className="space-y-5 lg:col-span-2">
            {cart.map((item) => (
              <div
                key={item.documentId}
                className="
                  group
                  rounded-2xl
                  border
                  border-stone-200
                  bg-white
                  p-4
                  shadow-md
                  transition-all
                  duration-300
                  hover:shadow-lg
                  sm:p-5
                "
              >
                <div className="flex flex-col gap-5 sm:flex-row">
                  {/* Product Image */}
                  <div className="h-52 w-full overflow-hidden rounded-xl bg-stone-100 sm:h-40 sm:w-40 sm:shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-stone-400">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Product Information */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex-1">
                      {/* Product Name */}
                      <h2 className="text-xl font-semibold text-stone-800">
                        {item.name}
                      </h2>

                      {/* Price */}
                      <p className="mt-2 text-lg font-bold text-indigo-600">
                        ${item.price}
                      </p>
                    </div>

                    {/* Quantity + Remove */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                      {/* Quantity */}
                      <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50">
                        <button
                          onClick={() => decreaseQty(item.documentId)}
                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            text-xl
                            font-semibold
                            text-stone-600
                            transition
                            hover:bg-stone-200
                            hover:text-indigo-600
                          "
                        >
                          −
                        </button>

                        <span className="flex h-10 min-w-[50px] items-center justify-center border-x border-stone-200 bg-white px-3 font-semibold text-stone-800">
                          {item.qty}
                        </span>

                        <button
                          onClick={() => increaseQty(item.documentId)}
                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            text-xl
                            font-semibold
                            text-stone-600
                            transition
                            hover:bg-stone-200
                            hover:text-indigo-600
                          "
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-xs text-stone-400">Item Total</p>

                        <p className="text-lg font-bold text-stone-800">
                          ${(Number(item.price) * item.qty).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.documentId)}
                      className="
                        mt-4
                        w-fit
                        text-sm
                        font-medium
                        text-red-500
                        transition
                        hover:text-red-700
                        hover:underline
                      "
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ORDER SUMMARY */}

          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-md">
              <h2 className="text-2xl font-bold text-stone-800">
                Order Summary
              </h2>

              {/* Divider */}
              <div className="my-5 border-t border-stone-200" />

              {/* Total Items */}
              <div className="flex items-center justify-between py-2">
                <span className="text-stone-500">Total Items</span>

                <span className="font-semibold text-stone-800">{totalQty}</span>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between py-2">
                <span className="text-stone-500">Subtotal</span>

                <span className="font-semibold text-stone-800">
                  ${totalprice.toFixed(2)}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex items-center justify-between py-2">
                <span className="text-stone-500">Shipping</span>

                <span className="font-semibold text-green-600">FREE</span>
              </div>

              {/* Divider */}
              <div className="my-5 border-t border-stone-200" />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-stone-800">Total</span>
                <span className="text-2xl font-bold text-indigo-600">
                  ${totalprice.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                // onClick={checkout}
              onClick={handlecheckout}
                 className="  mt-6  w-full
                  rounded-xl
                  bg-indigo-600
                  px-6
                  py-4
                  font-semibold
                  text-white
                  shadow-md
                  transition-all
                  duration-300
                  hover:bg-indigo-700
                  hover:shadow-lg
                  hover:shadow-indigo-500/30
                  active:scale-95
                ">
                Checkout
              </button>

              {/* Security Message */}
              <div className="mt-5 rounded-xl bg-stone-50 p-4 text-center">
                <p className="text-sm font-medium text-stone-700">
                  🔒 Secure Checkout
                </p>

                <p className="mt-1 text-xs text-stone-400">
                  Your shopping experience is safe and secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
