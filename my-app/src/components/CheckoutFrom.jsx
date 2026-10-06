// import React, { useEffect, useState } from "react";
// import {
//   Elements,
//   CardElement,
//   useElements,
//   useStripe,
// } from "@stripe/react-stripe-js";
// import { useLocation, useNavigate } from "react-router-dom";
// import { loadStripe } from "@stripe/stripe-js";

// const stripePromise = loadStripe(
//   "pk_test_51UBBuCHFs2FHrv0lW8hxfj2ZHIHvmDgBIWAoU0QxL4zs3JmXLr6RxC4XyhGDfT2PkkPzf5RADFHLIulbFw40PBbc00qDEr7kGf",
// );

// // checkout form
// const CheckoutForm = ({ cart, user }) => {
//   const navigate = useNavigate();
//   const stripe = useStripe();
//   const elements = useElements();
//   // from state
//   const [shippingAddress, setShippingAddress] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [pin, setPin] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   // calculate cart total
//   const totalAmount = cart.reduce((total, item) => {
//     return total + Number(item.price || 0) * Number(item.qty || 1);
//   }, 0);


//       // strapi amount
//       const stripeAmount = Math.round(Number(totalAmount) * 100);
//       console.log("Strapi Amount", totalAmount);
//       console.log("Strapi amount paise", stripeAmount);

//   // creayeOrders id
//   const createOrderId = () => {
//     return "ORD-" + Date.now();
//   };

//   // handle payment
//   const handlePayment = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     const jwt = localStorage.getItem("token");
//     const currentUser = JSON.parse(localStorage.getItem("user") || "null");
//     // login check
//     if (!jwt) {
//       navigate("/login", {
//         state: { from: "/checkout" },
//         replace: true,
//       });
//       return;
//     }

//     // straipe check
//     if (!stripe || !elements) {
//       setMessage("Stripe is not loaded yet.");
//       return;
//     }

//     if (cart.length === 0) {
//       setMessage("Your cart is empty.");
//       return;
//     }

//     if (!shippingAddress.trim()) {
//       setMessage("Please enter shipping address.");
//       return;
//     }

//     if (!city.trim()) {
//       setMessage("Please enter city.");
//       return;
//     }

//     if(!state.trim()){
//       setMessage("please enter state.")
//     }

//     if (!pin.trim()) {
//       setMessage("Please enter PIN code.");
//       return;
//     }

//     if (totalAmount <= 0) {
//       setMessage("Invalid order amount.");
//       return;
//     }

//     setLoading(true);

//     // get jwt
//     try {
//       const jwt = localStorage.getItem("token");

//       if (!jwt) {
//         throw new Error("Login session expired. Please login again.");
//       }

//       if (!Number.isInteger(stripeAmount) || stripeAmount <= 5000) {
//         throw new Error("Minumum order amount is 50.");
//       }

//       const paymentIntentResponse = await fetch(
//         "http://localhost:1337/api/orders/create-payment-intent",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${jwt}`,
//           },
//           body: JSON.stringify({
//             amount: stripeAmount,
//           }),
//         },
//       );

//       // read response
//       const paymentIntentData = await paymentIntentResponse.json();

//       console.log("Payment Intent:", paymentIntentData);

//       if (!paymentIntentResponse.ok) {
//         throw new Error(
//           paymentIntentData?.error?.message ||
//             paymentIntentData?.message ||
//             "Payment intent failed",
//         );
//       }

//       // get client secret

//       const clientSecret = paymentIntentData.clientSecret;

//       if (!clientSecret) {
//         throw new Error("Client secret not received from Strapi.");
//       }

//       const cardElement = elements.getElement(CardElement);

//       if (!cardElement) {
//         throw new Error("Card details not found.");
//       }

//       // confirm strapi payment
//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: cardElement,
//           billing_details: {
//             name: currentUser.name || currentUser.username || "Test User",
//             email: currentUser.email || "test@example.com",
//           },
//         },
//       });

//       console.log("Stripe Result:", result);

//       if (result.error) {
//         throw new Error(result.error.message);
//       }

//       const paymentIntent = result.paymentIntent;

//       if (!paymentIntent) {
//         throw new Error("Payment information not received.");
//       }

//       if (paymentIntent.status !== "succeeded") {
//         throw new Error("Payment was not successful.");
//       }

//       console.log("Payment Successful:", paymentIntent.id);

      

//     // create orders in strapi
// const orderResponse = await fetch(
//   "http://localhost:1337/api/orders/create-order",
//   {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${jwt}`,
//     },
//     body: JSON.stringify({
//       data: {
//         orderId: createOrderId(),
//         shippingAddress: shippingAddress.trim(),
//         city: city.trim(),
//         state: state.trim(),
//         pin: Number(pin),
//         amount: Number(totalAmount),
//         items: cart,
//         paymentId: paymentIntent.id,
//         paymentStatus: "paid",
//         orderStatus: "pending",
//       },
//     }),
//   }
// );

// // const orderResult = await orderResponse.json();

// // console.log("STRAPI ORDER RESPONSE:", orderResult);

// // if (!orderResponse.ok) {
// //   throw new Error(
// //     orderResult?.error?.message ||
// //       orderResult?.message ||
// //       "Order creation failed"
// //   );
// // }

// // Remove the second await orderResponse.json() call that was here!
//       // read orders resp

//       const orderData = await orderResponse.json();

//       console.log("Strapi Order:", orderData);

//       if (!orderResponse.ok) {
//         throw new Error(
//           orderData?.error?.message ||
//             orderData?.message ||
//             "Order creation failed",
//         );
//       }

//       setMessage("Payment successful! Order created successfully.");

//       localStorage.removeItem("cart");

//       setTimeout(() => {
//         navigate("/");
//       }, 2500);
//     } catch (error) {
//       console.error("Payment Error:", error);

//       setMessage(error.message || "Something went wrong during payment.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         maxWidth: "500px",
//         margin: "90px auto",
//         padding: "25px",
//         border: "1px solid #ddd",
//         borderRadius: "12px",
//         background: "#fff",
//       }}
//     >
//       <button
//         type="button"
//         onClick={() => navigate("/cart")}
//         style={{
//           marginBottom: "20px",
//           padding: "10px 16px",
//           border: "1px solid #ddd",
//           borderRadius: "8px",
//           background: "#fff",
//           cursor: "pointer",
//           fontWeight: "600",
//         }}
//       >
//         ← Back to Cart
//       </button>

//       <h2>Checkout</h2>

//       <div style={{ marginBottom: "20px" }}>
//         <h3>Total: ₹{totalAmount.toFixed(2)}</h3>
//       </div>

//       <form onSubmit={handlePayment}>
//         <label>Shipping Address</label>

//         <textarea
//           value={shippingAddress}
//           onChange={(e) => setShippingAddress(e.target.value)}
//           placeholder="Enter your full address"
//           rows="3"
//           required
//           style={{
//             width: "100%",
//             padding: "12px",
//             marginTop: "6px",
//             marginBottom: "15px",
//             border: "1px solid #ccc",
//             borderRadius: "8px",
//             boxSizing: "border-box",
//           }}
//         />

//         <label>City</label>

//         <input
//           type="text"
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//           placeholder="Enter city"
//           required
//           style={{
//             width: "100%",
//             padding: "12px",
//             marginTop: "6px",
//             marginBottom: "15px",
//             border: "1px solid #ccc",
//             borderRadius: "8px",
//             boxSizing: "border-box",
//           }}
//         />

//         <label>State</label>

//         <input
//           type="text"
//           value={state}
//           onChange={(e) => setState(e.target.value)}
//           placeholder="Enter state"
//           required
//           style={{
//             width: "100%",
//             padding: "12px",
//             marginTop: "6px",
//             marginBottom: "15px",
//             border: "1px solid #ccc",
//             borderRadius: "8px",
//             boxSizing: "border-box",
//           }}
//         />

//         <label>PIN Code</label>

//         <input
//           type="number"
//           value={pin}
//           onChange={(e) => setPin(e.target.value)}
//           placeholder="Enter PIN code"
//           required
//           style={{
//             width: "100%",
//             padding: "12px",
//             marginTop: "6px",
//             marginBottom: "20px",
//             border: "1px solid #ccc",
//             borderRadius: "8px",
//             boxSizing: "border-box",
//           }}
//         />

//         <label>Card Details</label>

//         <div
//           style={{
//             border: "1px solid #ccc",
//             padding: "15px",
//             borderRadius: "8px",
//             marginTop: "6px",
//             marginBottom: "20px",
//           }}
//         >
//           <CardElement
//             options={{
//               style: {
//                 base: {
//                   fontSize: "16px",
//                   color: "#32325d",
//                   "::placeholder": {
//                     color: "#aab7c4",
//                   },
//                 },
//                 invalid: {
//                   color: "#fa755a",
//                 },
//               },
//             }}
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={!stripe || loading}
//           style={{
//             width: "100%",
//             padding: "14px",
//             border: "none",
//             borderRadius: "8px",
//             background: "#111",
//             color: "#fff",
//             fontSize: "16px",
//             cursor: "pointer",
//           }}
//         >
//           {loading ? "Processing..." : `Pay ₹${totalAmount.toFixed(2)}`}
//         </button>
//       </form>

//       {message && (
//         <div
//           style={{
//             marginTop: "20px",
//             padding: "12px",
//             borderRadius: "8px",
//             background: message.toLowerCase().includes("successful")
//               ? "#e8f5e9"
//               : "#ffebee",
//             color: message.toLowerCase().includes("successful")
//               ? "green"
//               : "red",
//           }}
//         >
//           {message}
//         </div>
//       )}
//     </div>
//   );
// };

// const Checkout = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user") || "null");
//   const cart = JSON.parse(localStorage.getItem("cart") || "[]");

//   useEffect(() => {
//     if (!token || !user) {
//       navigate("/login", {
//         state: {
//           from: location.pathname,
//         },
//         replace: true,
//       });
//     }
//   }, [token, user, navigate, location.pathname]);

//   if (!token || !user) {
//     return null;
//   }

//   return (
//     <Elements stripe={stripePromise}>
//       <CheckoutForm cart={cart} user={user} />
//     </Elements>
//   );
// };

// export default Checkout;








import React, { useEffect, useState } from "react";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51UBBuCHFs2FHrv0lW8hxfj2ZHIHvmDgBIWAoU0QxL4zs3JmXLr6RxC4XyhGDfT2PkkPzf5RADFHLIulbFw40PBbc00qDEr7kGf"
);

const API_URL = "http://localhost:1337";

const CheckoutForm = ({ cart, user }) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // --------------------------------------------------
  // CART TOTAL
  // --------------------------------------------------

  const totalAmount = cart.reduce((total, item) => {
    return (
      total +
      Number(item.price || 0) * Number(item.qty || 1)
    );
  }, 0);

  // Stripe requires paise
  const stripeAmount = Math.round(Number(totalAmount) * 100);

  console.log("Strapi Amount:", totalAmount);
  console.log("Strapi amount paise:", stripeAmount);

  // --------------------------------------------------
  // CREATE ORDER ID
  // --------------------------------------------------

  const createOrderId = () => {
    return "ORD-" + Date.now();
  };

  // --------------------------------------------------
  // HANDLE PAYMENT
  // --------------------------------------------------

  const handlePayment = async (e) => {
    e.preventDefault();

    setMessage("");

    // --------------------------------------------------
    // GET CURRENT LOGIN DATA
    // --------------------------------------------------

    const jwt = localStorage.getItem("token");

    let currentUser = null;

    try {
      currentUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch (error) {
      console.error("User JSON parse error:", error);
    }

    console.log("JWT exists:", !!jwt);
    console.log("Current user:", currentUser);

    // --------------------------------------------------
    // LOGIN CHECK
    // --------------------------------------------------

    if (!jwt || !currentUser) {
      navigate("/login", {
        state: {
          from: "/checkout",
        },
        replace: true,
      });

      return;
    }

    // --------------------------------------------------
    // STRIPE CHECK
    // --------------------------------------------------

    if (!stripe || !elements) {
      setMessage("Stripe is not loaded yet.");
      return;
    }

    // --------------------------------------------------
    // CART CHECK
    // --------------------------------------------------

    if (!cart || cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    // --------------------------------------------------
    // SHIPPING VALIDATION
    // --------------------------------------------------

    if (!shippingAddress.trim()) {
      setMessage("Please enter shipping address.");
      return;
    }

    if (!city.trim()) {
      setMessage("Please enter city.");
      return;
    }

    if (!state.trim()) {
      setMessage("Please enter state.");
      return;
    }

    if (!pin.trim()) {
      setMessage("Please enter PIN code.");
      return;
    }

    // --------------------------------------------------
    // AMOUNT VALIDATION
    // --------------------------------------------------

    if (!Number.isFinite(Number(totalAmount)) || totalAmount <= 0) {
      setMessage("Invalid order amount.");
      return;
    }

    // Minimum ₹50
    if (!Number.isInteger(stripeAmount) || stripeAmount < 5000) {
      setMessage("Minimum order amount is ₹50.");
      return;
    }

    setLoading(true);

    try {
      // ==================================================
      // STEP 1: CHECK JWT WITH STRAPI
      // ==================================================

      const meResponse = await fetch(
        `${API_URL}/api/users/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      const meData = await meResponse.json();

      console.log("CURRENT USER STATUS:", meResponse.status);
      console.log("CURRENT USER:", meData);

      if (!meResponse.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        throw new Error(
          "Login session expired. Please login again."
        );
      }

      // ==================================================
      // STEP 2: CREATE STRIPE PAYMENT INTENT
      // ==================================================

      console.log(
        "Creating Payment Intent:",
        stripeAmount,
        "paise"
      );

      const paymentIntentResponse = await fetch(
        `${API_URL}/api/orders/create-payment-intent`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },

          body: JSON.stringify({
            amount: stripeAmount,
          }),
        }
      );

      const paymentIntentData =
        await paymentIntentResponse.json();

      console.log(
        "Payment Intent STATUS:",
        paymentIntentResponse.status
      );

      console.log(
        "Payment Intent RESPONSE:",
        paymentIntentData
      );

      if (!paymentIntentResponse.ok) {
        if (paymentIntentResponse.status === 401) {
          throw new Error(
            "Authentication failed for payment. Please login again."
          );
        }

        throw new Error(
          paymentIntentData?.error?.message ||
            paymentIntentData?.message ||
            "Payment intent failed."
        );
      }

      // ==================================================
      // CLIENT SECRET
      // ==================================================

      const clientSecret =
        paymentIntentData?.clientSecret;

      if (!clientSecret) {
        throw new Error(
          "Client secret not received from Strapi."
        );
      }

      // ==================================================
      // GET CARD ELEMENT
      // ==================================================

      const cardElement =
        elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error("Card details not found.");
      }

      // ==================================================
      // STEP 3: CONFIRM STRIPE PAYMENT
      // ==================================================

      const result =
        await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: cardElement,

              billing_details: {
                name:
                  currentUser?.name ||
                  currentUser?.username ||
                  "Test User",

                email:
                  currentUser?.email ||
                  "test@example.com",
              },
            },
          }
        );

      console.log("Stripe Result:", result);

      if (result.error) {
        throw new Error(result.error.message);
      }

      const paymentIntent =
        result.paymentIntent;

      if (!paymentIntent) {
        throw new Error(
          "Payment information not received."
        );
      }

      if (paymentIntent.status !== "succeeded") {
        throw new Error(
          "Payment was not successful."
        );
      }

      console.log(
        "Payment Successful:",
        paymentIntent.id
      );

      // ==================================================
      // STEP 4: CREATE ORDER IN STRAPI
      // ==================================================

      const orderId = createOrderId();

      console.log("Creating Order:", {
        orderId,
        amount: totalAmount,
        paymentId: paymentIntent.id,
      });

      const orderResponse = await fetch(
        `${API_URL}/api/orders/create-order`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },

          body: JSON.stringify({
            data: {
              orderId,

              shippingAddress:
                shippingAddress.trim(),

              city: city.trim(),

              state: state.trim(),

              pin: Number(pin),

              // IMPORTANT:
              // Strapi order amount is rupees
              amount: Number(totalAmount),

              items: cart,

              paymentId: paymentIntent.id,

              paymentStatus: "paid",

              orderStatus: "pending",
            },
          }),
        }
      );

      const orderData =
        await orderResponse.json();

      console.log(
        "Order STATUS:",
        orderResponse.status
      );

      console.log(
        "Strapi Order Response:",
        orderData
      );

      if (!orderResponse.ok) {
        if (orderResponse.status === 401) {
          throw new Error(
            "Authentication failed while creating order."
          );
        }

        throw new Error(
          orderData?.error?.message ||
            orderData?.message ||
            "Order creation failed."
        );
      }

      // ==================================================
      // SUCCESS
      // ==================================================

      console.log(
        "ORDER CREATED SUCCESSFULLY:",
        orderData
      );

      setMessage(
        "Payment successful! Order created successfully."
      );

      // Clear cart
      localStorage.removeItem("cart");

      // Redirect home
      setTimeout(() => {
        navigate("/");
      }, 2500);

    } catch (error) {
      console.error(
        "Payment Error:",
        error
      );

      setMessage(
        error?.message ||
          "Something went wrong during payment."
      );

    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "90px auto",
        padding: "25px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        background: "#fff",
      }}
    >
      <button
        type="button"
        onClick={() => navigate("/cart")}
        style={{
          marginBottom: "20px",
          padding: "10px 16px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          background: "#fff",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        ← Back to Cart
      </button>

      <h2>Checkout</h2>

      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <h3>
          Total: ₹{totalAmount.toFixed(2)}
        </h3>
      </div>

      <form onSubmit={handlePayment}>

        {/* ADDRESS */}

        <label>Shipping Address</label>

        <textarea
          value={shippingAddress}
          onChange={(e) =>
            setShippingAddress(e.target.value)
          }
          placeholder="Enter your full address"
          rows="3"
          required
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "6px",
            marginBottom: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxSizing: "border-box",
          }}
        />

        {/* CITY */}

        <label>City</label>

        <input
          type="text"
          value={city}
          onChange={(e) =>
            setCity(e.target.value)
          }
          placeholder="Enter city"
          required
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "6px",
            marginBottom: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxSizing: "border-box",
          }}
        />

        {/* STATE */}

        <label>State</label>

        <input
          type="text"
          value={state}
          onChange={(e) =>
            setState(e.target.value)
          }
          placeholder="Enter state"
          required
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "6px",
            marginBottom: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxSizing: "border-box",
          }}
        />

        {/* PIN */}

        <label>PIN Code</label>

        <input
          type="number"
          value={pin}
          onChange={(e) =>
            setPin(e.target.value)
          }
          placeholder="Enter PIN code"
          required
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "6px",
            marginBottom: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxSizing: "border-box",
          }}
        />

        {/* CARD */}

        <label>Card Details</label>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "8px",
            marginTop: "6px",
            marginBottom: "20px",
          }}
        >
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#32325d",

                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },

                invalid: {
                  color: "#fa755a",
                },
              },
            }}
          />
        </div>

        {/* PAY */}

        <button
          type="submit"
          disabled={!stripe || loading}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "8px",
            background: "#111",
            color: "#fff",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {loading
            ? "Processing..."
            : `Pay ₹${totalAmount.toFixed(2)}`}
        </button>
      </form>

      {message && (
        <div
          style={{
            marginTop: "20px",
            padding: "12px",
            borderRadius: "8px",

            background: message
              .toLowerCase()
              .includes("successful")
              ? "#e8f5e9"
              : "#ffebee",

            color: message
              .toLowerCase()
              .includes("successful")
              ? "green"
              : "red",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

// ======================================================
// CHECKOUT PAGE
// ======================================================

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token =
    localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const cart = JSON.parse(
    localStorage.getItem("cart") || "[]"
  );

  useEffect(() => {
    if (!token || !user) {
      navigate("/login", {
        state: {
          from: location.pathname,
        },
        replace: true,
      });
    }
  }, [
    token,
    user,
    navigate,
    location.pathname,
  ]);

  if (!token || !user) {
    return null;
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        cart={cart}
        user={user}
      />
    </Elements>
  );
};

export default Checkout;