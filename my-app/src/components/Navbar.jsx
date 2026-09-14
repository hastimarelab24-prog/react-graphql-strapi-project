import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";

import { GrLogout } from "react-icons/gr";
import { RiShoppingBagLine } from "react-icons/ri";
import { FiSearch, FiHeart } from "react-icons/fi";

import Card from "./Card";
import { GET_ALL_PRODUCTS } from "../gqloperation/queries";

const Navbar = () => {
  const { loading, error, data } = useQuery(GET_ALL_PRODUCTS);
  const navigate = useNavigate();

  // Check login using the same "jwt" key everywhere
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("jwt"));

  // Logout
  const logout = () => {
    localStorage.removeItem("jwt");

    // Notify other components
    window.dispatchEvent(new Event("authChange"));

    navigate("/login");
  };

  // Check authentication changes
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("jwt"));
    };

    checkAuth();

    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  return (
    <nav className="border-b border-gray-200 bg-white text-gray-800 shadow-sm">
      <div className="container mx-auto flex min-h-[76px] items-center justify-between px-4">
        {/* LOGO */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-blue-100 bg-blue-50 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKlok0F-ptePIrFilbjwvAWr3RUUxtEF9XZJF2300AWA&s=10"
              alt="ElectroHub Logo"
              className="h-full w-full object-cover transition-all duration-300 group-hover:brightness-110"
            />
          </div>

          <div>
            <h3 className="text-xl font-extrabold tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
              ElectroHub
            </h3>

            <p className="text-[10px] font-semibold tracking-[0.2em] text-blue-500">
              SMART LIVING
            </p>
          </div>
        </Link>

        {/* NAVIGATION */}
        <ul className="flex items-center gap-6">
          {/* HOME */}
          <li>
            <Link
              to="/"
              className="font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600"
            >
              Home
            </Link>
          </li>

          {/* PRODUCTS DROPDOWN */}
          <li className="group relative">
            <Link
              to="/shop"
              className="font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600"
            >
              Products
            </Link>

            {/* dropdown */}
            <div className="invisible fixed left-1/2 top-[80px] z-50 mt-4 w-[1250px] -translate-x-1/2 translate-y-2 rounded-xl border border-gray-200 bg-white p-5 opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="grid grid-cols-4 gap-8">
                {data?.products?.slice(0, 4).map((product) => (
                  <Card
                    key={product.documentId}
                    documentId={product.documentId}
                    name={product.name}
                    price={product.price}
                    imageUrl={product.images?.[0]?.url}
                  />
                ))}
              </div>
            </div>
          </li>

          {/* SHOP DROPDOWN */}
          <li className="group relative">
            <Link
              to="/shop"
              className="font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600"
            >
              Shop
            </Link>

            {/* Mega Dropdown */}
            <div className="invisible fixed left-1/2 top-[80px] z-50 mt-4 w-[1250px] -translate-x-1/2 translate-y-2 rounded-xl border border-gray-200 bg-white p-5 opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="grid grid-cols-4 gap-8">
                {/* PRODUCTS TYPE */}
                <div>
                  <h3 className="mb-3 border-b border-gray-200 pb-3 text-lg font-bold text-gray-900">
                    Products Type
                  </h3>

                  <ul className="space-y-1">
                    <li>
                      <Link
                        to="/shop?type=simple"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        Simple Product
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop?type=grouped"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        Grouped Product
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop?type=variable"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        Variable Product
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop?type=sale"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        Sale Product
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop?type=upsell"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        Upsell Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop?type=cross-sell"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        Cross-Sell Product
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* WOOCOMMERCE PAGES */}
                <div>
                  <h3 className="mb-3 border-b border-gray-200 pb-3 text-lg font-bold text-gray-900">
                    WooCommerce Pages
                  </h3>

                  <ul className="space-y-1">
                    <li>
                      <Link
                        to="/shop"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        Shop Page
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/cart"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        Cart Page
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/checkout"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        Checkout Page
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/account"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        My Account
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/wishlist"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        Wishlist Page
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* BEST SELLER BANNER */}
                <div>
                  <h3 className="mb-3 border-b border-gray-200 pb-3 text-lg font-bold text-gray-900">
                    Featured Item
                  </h3>
                  <div className="flex items-center gap-4 pt-2">
                    <img
                      className="h-[90px] w-[90px] flex-shrink-0 rounded-md object-cover"
                      src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2023/12/19-768x922.jpg"
                      alt="Google Home"
                    />
                    <div>
                      <h6 className="text-sm font-medium leading-5 text-gray-800 hover:text-blue-600">
                        Google Home - Smart Home Speaker
                      </h6>
                      <p className="mt-2 text-sm font-semibold text-gray-900">
                        $99.00
                      </p>
                    </div>
                  </div>
                </div>

                {/* IMAGE BANNER */}
                <div className="overflow-hidden rounded-lg">
                  <img
                    className="h-full w-full object-cover"
                    src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2023/10/01.jpg"
                    alt="Promo Banner"
                  />
                </div>
              </div>
            </div>
          </li>

          {/* CATEGORIES DROPDOWN */}
          <li className="group relative">
            <Link
              to="/category"
              className="font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600"
            >
              Categories
            </Link>

            <div className="invisible fixed left-1/2 top-[80px] z-50 mt-4 w-[1250px] -translate-x-1/2 translate-y-2 rounded-xl border border-gray-200 bg-white p-5 opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="grid grid-cols-4 gap-8">
                <div>
                  <h3 className="mb-3 border-b border-gray-200 pb-3 text-lg font-bold text-gray-900">
                    Cameras
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        to="/category/backup-camera"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        Backup camera
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category/digital-camera"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        Digital Camera
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category/ip-camera"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        IP camera
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 border-b border-gray-200 pb-3 text-lg font-bold text-gray-900">
                    Phones
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        to="/category/basic-phones"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        Basic Phones
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category/iphones"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        iPhones
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category/smartphones"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        Smartphones
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 border-b border-gray-200 pb-3 text-lg font-bold text-gray-900">
                    TV & Speaker
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        to="/category/home-theatre"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        Home Theatre Systems
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category/speakers"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        Party Speakers
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category/televisions"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        Televisions
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 border-b border-gray-200 pb-3 text-lg font-bold text-gray-900">
                    Best Selling
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        className="h-[70px] w-[70px] flex-shrink-0 rounded-md object-cover"
                        src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2023/12/19-768x922.jpg"
                        alt="Google Home"
                      />
                      <div>
                        <h6 className="text-xs font-medium leading-4 text-gray-800 hover:text-blue-600">
                          Google Home Speaker
                        </h6>
                        <p className="mt-1 text-xs font-semibold text-gray-900">
                          $99.00
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>

          {/* ABOUT */}
          <li>
            <Link
              to="/about"
              className="font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600"
            >
              About Us
            </Link>
          </li>

          {/* ELEMENT DROPDOWN */}
          <li className="group relative">
            <Link
              to="/element"
              className="font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600"
            >
              Element
            </Link>

            <div className="invisible fixed left-1/2 top-[80px] z-50 mt-4 -translate-x-1/2 translate-y-2 rounded-xl border border-gray-200 bg-white p-5 opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <ul className="min-w-[160px] space-y-1">
                <li>
                  <Link
                    to="/iconbox"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                  >
                    Icon box
                  </Link>
                </li>
                <li>
                  <Link
                    to="/portfolio"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                  >
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link
                    to="/gallery"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                  >
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          {/* SEARCH */}
          <li>
            <button
              type="button"
              onClick={() => navigate("/search")}
              className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-gray-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
              title="Search Products"
              aria-label="Search"
            >
              <FiSearch />
            </button>
          </li>

          {/* WISHLIST BUTTON */}
          <li>
            <button
              type="button"
              onClick={() => navigate("/wishlist")}
              className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-gray-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <FiHeart />
            </button>
          </li>

          {/* CART BUTTON */}
          <li>
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-gray-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
              title="Cart"
              aria-label="Cart"
            >
              <RiShoppingBagLine />
            </button>
          </li>

          {/* LOGGED IN STATUS CHECK */}
          {isLoggedIn ? (
            /* LOGOUT BUTTON */
            <li>
              <button
                type="button"
                onClick={logout}
                className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-gray-500 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
                title="Logout"
                aria-label="Logout"
              >
                <GrLogout />
              </button>
            </li>
          ) : (
            <>
              {/* LOGIN LINK */}
              <li>
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-2 font-medium text-gray-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  Login
                </Link>
              </li>

              {/* SIGNUP LINK */}
              <li>
                <Link
                  to="/signup"
                  className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md"
                >
                  Signup
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;