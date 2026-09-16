import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiShoppingCart, FiHeart, FiArrowLeft } from "react-icons/fi";
import CartSuccessModal from "../components/CartSuccessModal";

function Wishlist() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  // success model
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");



  // Load wishlist items from localStorage on mount
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistItems(savedWishlist);
  }, []);

  // Remove single item from wishlist
  const handleRemove = (documentId) => {
    const updatedWishlist = wishlistItems.filter(
      (item) => item.documentId !== documentId,
    );
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("wishlistChange"));
  };

  // Clear all wishlist items
  const handleClearAll = () => {
    setWishlistItems([]);
    localStorage.removeItem("wishlist");
    window.dispatchEvent(new Event("wishlistChange"));
  };

  // ADD TO CART FUNCTION (Matching Card component logic)
  const handleAddToCart = (e, item) => {
    e.stopPropagation();

    // Check login state (using "token" as defined in your Card component)
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      navigate("/login");
      return;
    }

    // get old cart
    const oldCart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if product is already in the cart
    const productExist = oldCart.find(
      (cartItem) => cartItem.documentId === item.documentId,
    );

    if (productExist) {
      setSuccessMessage("Product already added to cart");
      setSuccessModal(true);
      return;
    }

    // create new cart products new products
    const newProduct = {
      documentId: item.documentId,
      name: item.name,
      price: item.price,
      image: item.image || item.imageUrl || "",
      qty: 1,
    };

    //  update cart save
    const updatedCart = [...oldCart, newProduct];
    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Notify other components (like Navbar/Header) of cart updates
    window.dispatchEvent(new Event("cartChange"));

    // open sucess modal
    setSuccessMessage("Addedto cart Successfully!");
    setSuccessModal(true);
    // alert(`${item.name} added to cart!`);
  };


  return (
    <div className=" mt-16 min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* success popup */}
      <CartSuccessModal
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        message={successMessage}
      />
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              <FiHeart className="fill-rose-500 text-rose-500" />
              <h1>My Wishlist</h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {wishlistItems.length}{" "}
              {wishlistItems.length === 1 ? "item" : "items"} saved for later
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="self-start text-sm font-semibold text-rose-600 transition hover:text-rose-700 hover:underline sm:self-auto"
            >
              Clear All Items
            </button>
          )}
        </div>

        {/* Wishlist Items Grid */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishlistItems.map((item) => {
              const imageUrl = item.image || item.imageUrl || "";

              return (
                <div
                  key={item.documentId}
                  onClick={() => navigate(`/products/${item.documentId}`)}
                  className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item.documentId);
                    }}
                    title="Remove from wishlist"
                    className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                  >
                    <FiTrash2 className="text-base" />
                  </button>

                  <div>
                    {/* Image Container */}
                    <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-slate-50">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.name}
                          className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-slate-400">
                          No Image Available
                        </div>
                      )}
                    </div>

                    {/* Product Name */}
                    <h2
                      title={item.name}
                      className="line-clamp-2 min-h-[48px] text-base font-semibold leading-6 text-slate-800 transition-colors group-hover:text-indigo-600"
                    >
                      {item.name}
                    </h2>

                    {/* Price */}
                    <p className="mt-2 text-lg font-bold text-slate-900">
                      ₹{item.price ?? 0}
                    </p>
                  </div>

                  {/* Add to Cart Action */}
                  <div className="mt-5 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, item)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
                    >
                      <FiShoppingCart />
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <FiHeart className="text-4xl" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Your wishlist is empty
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate-500">
              Explore our shop and save your favorite electronics to find them
              easily anytime.
            </p>
            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
            >
              <FiArrowLeft /> Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
