import React, { useState } from "react";

import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";


// 
// STRIPE TEST PUBLISHABLE KEY
// 

const stripePromise = loadStripe(
  "pk_test_51UBBuCHFs2FHrv0lW8hxfj2ZHIHvmDgBIWAoU0QxL4zs3JmXLr6RxC4XyhGDfT2PkkPzf5RADFHLIulbFw40PBbc00qDEr7kGf"
);


// 
// CHECKOUT FORM
// 

const CheckoutForm = ({
  cart = [],
  user,
}) => {

  const stripe = useStripe();

  const elements = useElements();


  // 
  // STATE
  // 

  const [shippingAddress, setShippingAddress] =
    useState("");

  const [city, setCity] =
    useState("");

  const [state, setState] =
    useState("");

  const [pin, setPin] =
    useState("");


  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");


  // 
  // TOTAL AMOUNT
  // 

  const totalAmount = cart.reduce(
    (total, item) => {

      return (
        total +
        Number(item.price || 0) *
          Number(item.qty || 1)
      );

    },
    0
  );


  // 
  // CREATE ORDER ID
  // 

  const createOrderId = () => {

    return (
      "ORD-" +
      Date.now()
    );

  };


  // 
  // PAYMENT
  // 

  const handlePayment = async (e) => {

    e.preventDefault();

    setMessage("");


    // 
    // STRIPE CHECK
    // 

    if (!stripe || !elements) {

      setMessage(
        "Stripe is not loaded yet."
      );

      return;
    }


    
    // LOGIN CHECK
    

    if (!user) {

      setMessage(
        "Please login before checkout."
      );

      return;
    }


    // 
    // CART CHECK
    // 

    if (cart.length === 0) {

      setMessage(
        "Your cart is empty."
      );

      return;
    }


    // 
    // SHIPPING ADDRESS CHECK
    // 

    if (!shippingAddress.trim()) {

      setMessage(
        "Please enter shipping address."
      );

      return;
    }


    // 
    // CITY CHECK
    // 

    if (!city.trim()) {

      setMessage(
        "Please enter city."
      );

      return;
    }


    // 
    // PIN CHECK
    // 

    if (!pin.trim()) {

      setMessage(
        "Please enter PIN code."
      );

      return;
    }


    // 
    // AMOUNT CHECK
    // 

    if (totalAmount <= 0) {

      setMessage(
        "Invalid order amount."
      );

      return;
    }


    setLoading(true);


    try {


      // =
      // STEP 1
      // CREATE STRIPE PAYMENT INTENT
      // =

      const paymentIntentResponse =
        await fetch(
          "http://localhost:1337/api/orders/create-payment-intent",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              amount:
                totalAmount,

            }),

          }
        );


      const paymentIntentData =
        await paymentIntentResponse.json();


      console.log(
        "Payment Intent:",
        paymentIntentData
      );


      if (
        !paymentIntentResponse.ok
      ) {

        throw new Error(

          paymentIntentData?.error
            ?.message ||

          paymentIntentData?.message ||

          "Payment intent failed"

        );
      }


      const clientSecret =
        paymentIntentData.clientSecret;


      if (!clientSecret) {

        throw new Error(
          "Client secret not received from Strapi."
        );
      }


      // =
      // STEP 2
      // GET CARD ELEMENT
      // =

      const cardElement =
        elements.getElement(
          CardElement
        );


      if (!cardElement) {

        throw new Error(
          "Card details not found."
        );
      }


 
      // STEP 3
      // CONFIRM STRIPE PAYMENT
    

      const result =
        await stripe.confirmCardPayment(
          clientSecret,
          {

            payment_method: {

              card:
                cardElement,

              billing_details: {

                name:
                  user.name ||
                  user.username ||
                  "Test User",

                email:
                  user.email ||
                  "test@example.com",

              },

            },

          }
        );


      console.log(
        "Stripe Result:",
        result
      );


      // =
      // STRIPE ERROR
      // =

      if (result.error) {

        throw new Error(
          result.error.message
        );
      }


      // =
      // PAYMENT INTENT
      // =

      const paymentIntent =
        result.paymentIntent;


      if (!paymentIntent) {

        throw new Error(
          "Payment information not received."
        );
      }


      // =
      // SUCCESS CHECK
      // =

      if (
        paymentIntent.status !==
        "succeeded"
      ) {

        throw new Error(
          "Payment was not successful."
        );
      }


      console.log(
        "Payment Successful:",
        paymentIntent.id
      );


      // =
      // USER ID
      // =

      const userId =
        user.id ||
        user.documentId ||
        user.username ||
        user.email;


      // =
      // STEP 4
      // CREATE ORDER IN STRAPI
      // =

      const orderResponse =
        await fetch(
          "http://localhost:1337/api/orders/create-order",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

            },

            body: JSON.stringify({

              data: {

                // ------------------------------
                // ORDER ID
                // ------------------------------

                orderId:
                  createOrderId(),


                // ------------------------------
                // SHIPPING ADDRESS
                // ------------------------------

                shippingAddress:
                  shippingAddress.trim(),


                // ------------------------------
                // CITY
                // ------------------------------

                city:
                  city.trim(),


                // ------------------------------
                // STATE
                // ------------------------------

                state:
                  state.trim(),


                // ------------------------------
                // PIN
                // ------------------------------

                pin:
                  Number(pin),


                // ------------------------------
                // AMOUNT
                // ------------------------------

                amount:
                  totalAmount,


                // ------------------------------
                // CART ITEMS
                // ------------------------------

                items:
                  cart,


                // ------------------------------
                // USER
                // ------------------------------

                user:
                  String(userId),


                // ------------------------------
                // EMAIL
                // ------------------------------

                email:
                  user.email ||
                  "test@example.com",


                // ------------------------------
                // STRIPE PAYMENT ID
                // ------------------------------

                paymentId:
                  paymentIntent.id,


                // ------------------------------
                // PAYMENT STATUS
                // ------------------------------

                paymentStatus:
                  "paid",

              },

            }),

          }
        );


      const orderData =
        await orderResponse.json();


      console.log(
        "Strapi Order:",
        orderData
      );


      // =
      // ORDER ERROR
      // =

      if (!orderResponse.ok) {

        throw new Error(

          orderData?.error
            ?.message ||

          orderData?.message ||

          "Order creation failed"

        );
      }


      // =
      // SUCCESS
      // =

      setMessage(
        "Payment successful! Order created successfully."
      );


      // =
      // CLEAR CART
      // =

      localStorage.removeItem(
        "cart"
      );


      // =
      // REDIRECT
      // =

      setTimeout(() => {

        window.location.href = "/";

      }, 2500);

 } catch (error) {

      console.error(
        "Payment Error:",
        error
      );


      setMessage(
        error.message ||
        "Something went wrong during payment."
      );


    } finally {

      setLoading(false);

    }

  };


  // 
  // UI
  // 

  return (

    <div
      style={{

        maxWidth: "500px",

        margin: "30px auto",

        padding: "25px",

        border:
          "1px solid #ddd",

        borderRadius:
          "12px",

        background:
          "#fff",

      }}
    >


      <h2>
        Checkout
      </h2>


      {/* 
          TOTAL
       */}

      <div
        style={{
          marginBottom: "20px",
        }}
      >

        <h3>
          Total: ₹
          {totalAmount.toFixed(2)}
        </h3>

      </div>


      <form
        onSubmit={
          handlePayment
        }
      >


        {/* ==============================================
            SHIPPING ADDRESS
        ============================================== */}

        <label>
          Shipping Address
        </label>

        <textarea
          value={
            shippingAddress
          }

          onChange={(e) =>
            setShippingAddress(
              e.target.value
            )
          }

          placeholder="Enter your full address"

          rows="3"

          required

          style={{
            width: "100%",
            padding: "12px",
            marginTop: "6px",
            marginBottom: "15px",
            border:
              "1px solid #ccc",
            borderRadius: "8px",
            boxSizing:
              "border-box",
          }}
        />


        {/* ==============================================
            CITY
        ============================================== */}

        <label>
          City
        </label>

        <input
          type="text"

          value={city}

          onChange={(e) =>
            setCity(
              e.target.value
            )
          }

          placeholder="Enter city"

          required

          style={{
            width: "100%",
            padding: "12px",
            marginTop: "6px",
            marginBottom: "15px",
            border:
              "1px solid #ccc",
            borderRadius: "8px",
            boxSizing:
              "border-box",
          }}
        />


        {/* ==============================================
            STATE
        ============================================== */}

        <label>
          State
        </label>

        <input
          type="text"

          value={state}

          onChange={(e) =>
            setState(
              e.target.value
            )
          }

          placeholder="Enter state"

          style={{
            width: "100%",
            padding: "12px",
            marginTop: "6px",
            marginBottom: "15px",
            border:
              "1px solid #ccc",
            borderRadius: "8px",
            boxSizing:
              "border-box",
          }}
        />


        {/* ==============================================
            PIN
        ============================================== */}

        <label>
          PIN Code
        </label>

        <input
          type="number"

          value={pin}

          onChange={(e) =>
            setPin(
              e.target.value
            )
          }

          placeholder="Enter PIN code"

          required

          style={{
            width: "100%",
            padding: "12px",
            marginTop: "6px",
            marginBottom: "20px",
            border:
              "1px solid #ccc",
            borderRadius: "8px",
            boxSizing:
              "border-box",
          }}
        />


        {/* ==============================================
            CARD
        ============================================== */}

        <label>
          Card Details
        </label>

        <div
          style={{

            border:
              "1px solid #ccc",

            padding:
              "15px",

            borderRadius:
              "8px",

            marginTop:
              "6px",

            marginBottom:
              "20px",

          }}
        >

          <CardElement

            options={{

              style: {

                base: {

                  fontSize:
                    "16px",

                  color:
                    "#32325d",

                  "::placeholder":
                    {
                      color:
                        "#aab7c4",
                    },

                },

                invalid: {

                  color:
                    "#fa755a",

                },

              },

            }}

          />

        </div>


        {/* ==============================================
            PAY BUTTON
        ============================================== */}

        <button

          type="submit"

          disabled={
            !stripe ||
            loading
          }

          style={{

            width:
              "100%",

            padding:
              "14px",

            border:
              "none",

            borderRadius:
              "8px",

            background:
              "#111",

            color:
              "#fff",

            fontSize:
              "16px",

            cursor:
              "pointer",

          }}

        >

          {loading

            ? "Processing..."

            : `Pay ₹${totalAmount.toFixed(2)}`

          }

        </button>


      </form>


      {/* 
          MESSAGE
       */}

      {message && (

        <div

          style={{

            marginTop:
              "20px",

            padding:
              "12px",

            borderRadius:
              "8px",

            background:
              message
                .toLowerCase()
                .includes(
                  "successful"
                )

                ? "#e8f5e9"

                : "#ffebee",

            color:
              message
                .toLowerCase()
                .includes(
                  "successful"
                )

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


// 
// CHECKOUT PAGE
// 

const Checkout = () => {


  // ====
  // GET CART
  // ====

  const cart =
    JSON.parse(
      localStorage.getItem(
        "cart"
      )
    ) || [];


  // ====
  // GET LOGGED-IN USER
  // 

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    ) || null;


  // 
  // LOGIN CHECK
  // 

  if (!user) {

    return (

      <div
        style={{

          textAlign:
            "center",

          marginTop:
            "50px",

        }}
      >

        <h2>
          Please Login First
        </h2>

        <p>
          You must login before
          completing checkout.
        </p>

      </div>

    );

  }


  // 
  // STRIPE
  // 

  return (

    <Elements
      stripe={
        stripePromise
      }
    >

      <CheckoutForm

        cart={cart}

        user={user}

      />

    </Elements>

  );

};


export default Checkout;