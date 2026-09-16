// Add to Cart
const addToCart = (e) => {
  e.stopPropagation();

  // Get old cart from localStorage
  const oldCart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if product already exists
  const productExist = oldCart.find(
    (item) => item.documentId === documentId
  );

  let updatedCart;

  if (productExist) {
    // Increase quantity if product already exists
    updatedCart = oldCart.map((item) =>
      item.documentId === documentId
        ? {
            ...item,
            qty: (Number(item.qty) || 1) + 1,
          }
        : item
    );

    setSuccessMessage("Product quantity increased in cart");
  } else {
    // Add new product
    const newProduct = {
      documentId: documentId,
      name: name,
      price: price,
      image: fullImageUrl,
      qty: 1,
    };

    updatedCart = [...oldCart, newProduct];

    setSuccessMessage("Product added to cart successfully");
  }

  // Save cart
  localStorage.setItem("cart", JSON.stringify(updatedCart));

  // Notify Navbar and Cart
  window.dispatchEvent(new Event("cartChange"));

  // Show modal
  setSuccessType("success");
  setSuccessModal(true);
};

const handleCheckout = () => {
  const jwt = localStorage.getItem("jwt");
  const user = localStorage.getItem("user");

  // User login નથી
  if (!jwt || !user) {
    navigate("/login", {
      state: {
        from: "/checkout",
      },
    });

    return;
  }

  // User login છે
  navigate("/checkout");
};  




if (data?.login) {
  // Save JWT
  localStorage.setItem("jwt", data.login.jwt);

  // Save user details
  localStorage.setItem(
    "user",
    JSON.stringify(data.login.user)
  );

  // Notify Navbar
  window.dispatchEvent(new Event("authChange"));

  // Redirect to checkout if user came from checkout
  navigate(location.state?.from || "/", {
    replace: true,
  });
}


import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    const user = localStorage.getItem("user");

    if (!jwt || !user) {
      navigate("/login", {
        state: {
          from: "/checkout",
        },
        replace: true,
      });
    }
  }, [navigate]);

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const user = JSON.parse(localStorage.getItem("user")) || null;

  return (
    <div>
      {/* Your existing CheckoutFrom component */}
      {/* <CheckoutFrom cart={cart} user={user} /> */}
    </div>
  );
}

export default Checkout;