import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";

import { GrLogout } from "react-icons/gr";
import { RiShoppingBagLine } from "react-icons/ri";
import { FiSearch, FiHeart, FiMenu, FiX, FiChevronDown } from "react-icons/fi";

import Card from "./Card";
import { GET_ALL_PRODUCTS } from "../gqloperation/queries";

const Navbar = () => {
  const { loading, error, data } = useQuery(GET_ALL_PRODUCTS);
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const logout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange"));
    setMobileMenuOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    checkAuth();
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  const toggleSubMenu = (menuName) => {
    setActiveSubMenu(activeSubMenu === menuName ? null : menuName);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setActiveSubMenu(null);
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full  border-b border-gray-200 bg-white text-gray-800 shadow-sm">
      <div className="container mx-auto flex min-h-[76px] items-center justify-between px-4">
        {/* LOGO */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="group flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-blue-100 bg-blue-50 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md md:h-12 md:w-12">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKlok0F-ptePIrFilbjwvAWr3RUUxtEF9XZJF2300AWA&s=10"
              alt="ElectroHub Logo"
              className="h-full w-full object-cover transition-all duration-300 group-hover:brightness-110"
            />
          </div>

          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-blue-600 md:text-xl">
              ElectroHub
            </h3>
            <p className="text-[9px] font-semibold tracking-[0.2em] text-blue-500 md:text-[10px]">
              SMART LIVING
            </p>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <ul className="hidden items-center gap-6 lg:flex">
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

            <div className="invisible fixed left-1/2 top-[80px] z-50 mt-4 w-[1250px] max-w-[95vw] -translate-x-1/2 translate-y-2 rounded-xl border border-gray-200 bg-white p-5 opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="grid grid-cols-4 gap-8">
                {data?.products?.slice(0, 4).map((product) => (
                  <Card
                    documentId={product.documentId}
                    name={product.name}
                    price={product.price}
                    stock={product.stock}
                    imageUrl={product.images?.[0]?.url}
                    isDiscountActive={product.isDiscountActive}
                    discountType={product.discountType}
                    discountValue={product.discountValue}
                    categoryIsDiscountActive={
                      product.category?.isDiscountActive
                    }
                    categoryDiscountType={product.category?.discountType}
                    categoryDiscountValue={product.category?.discountValue}
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

            <div className="invisible fixed left-1/2 top-[80px] z-50 mt-4 w-[1250px] max-w-[95vw] -translate-x-1/2 translate-y-2 rounded-xl border border-gray-200 bg-white p-5 opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="grid grid-cols-4 gap-8">
                <div>
                  <h3 className="mb-3 border-b border-gray-200 pb-3 text-lg font-bold text-gray-900">
                    Products Type
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        to="/shop?type=simple"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        Simple Product
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop?type=grouped"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        Grouped Product
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop?type=variable"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        Variable Product
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop?type=sale"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        Sale Product
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop?type=upsell"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        Upsell Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop?type=cross-sell"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        Cross-Sell Product
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 border-b border-gray-200 pb-3 text-lg font-bold text-gray-900">
                    WooCommerce Pages
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        to="/shop"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        Shop Page
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/cart"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        Cart Page
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/checkout"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        Checkout Page
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/account"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        My Account
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/wishlist"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        Wishlist Page
                      </Link>
                    </li>
                  </ul>
                </div>

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

            <div className="invisible fixed left-1/2 top-[80px] z-50 mt-4 w-[1250px] max-w-[95vw] -translate-x-1/2 translate-y-2 rounded-xl border border-gray-200 bg-white p-5 opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="grid grid-cols-4 gap-8">
                <div>
                  <h3 className="mb-3 border-b border-gray-200 pb-3 text-lg font-bold text-gray-900">
                    Cameras
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        to="/category/backup-camera"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        Backup camera
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category/digital-camera"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        Digital Camera
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category/ip-camera"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
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
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        Basic Phones
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category/iphones"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        iPhones
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category/smartphones"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
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
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        Home Theatre Systems
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category/speakers"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        Party Speakers
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category/televisions"
                        className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
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
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Icon box
                  </Link>
                </li>
                <li>
                  <Link
                    to="/portfolio"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link
                    to="/gallery"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        </ul>

        {/* UTILITY ACTIONS */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => navigate("/search")}
            className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            aria-label="Search"
          >
            <FiSearch />
          </button>

          <button
            type="button"
            onClick={() => navigate("/wishlist")}
            className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            aria-label="Wishlist"
          >
            <FiHeart />
          </button>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            aria-label="Cart"
          >
            <RiShoppingBagLine />
          </button>

          {/* DESKTOP AUTH BUTTONS */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={logout}
                className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-gray-500 hover:bg-red-50 hover:text-red-500"
                aria-label="Logout"
              >
                <GrLogout />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-2 font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-blue-700 hover:shadow-md"
                >
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU TOGGLE BUTTON */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-gray-700 hover:bg-gray-100 lg:hidden"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* MOBILE BACKDROP */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* MOBILE NAVIGATION DRAWER */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[300px] transform bg-white p-6 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2"
          >
            <h3 className="text-lg font-bold text-gray-900">ElectroHub</h3>
          </Link>
          <button
            onClick={closeMobileMenu}
            className="rounded-lg p-2 text-xl text-gray-600 hover:bg-gray-100"
          >
            <FiX />
          </button>
        </div>

        <ul className="mt-6 space-y-2">
          <li>
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              Home
            </Link>
          </li>

          {/* MOBILE PRODUCTS DROPDOWN */}
          <li>
            <button
              onClick={() => toggleSubMenu("products")}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              <span>Products</span>
              <FiChevronDown
                className={`transition-transform duration-200 ${
                  activeSubMenu === "products" ? "rotate-180" : ""
                }`}
              />
            </button>
            {activeSubMenu === "products" && (
              <div className="mt-2 space-y-2 pl-4">
                <Link
                  to="/shop"
                  onClick={closeMobileMenu}
                  className="block text-sm text-gray-600 hover:text-blue-600"
                >
                  All Products
                </Link>
              </div>
            )}
          </li>

          {/* MOBILE SHOP DROPDOWN */}
          <li>
            <button
              onClick={() => toggleSubMenu("shop")}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              <span>Shop</span>
              <FiChevronDown
                className={`transition-transform duration-200 ${
                  activeSubMenu === "shop" ? "rotate-180" : ""
                }`}
              />
            </button>
            {activeSubMenu === "shop" && (
              <div className="mt-2 space-y-2 pl-4 text-sm text-gray-600">
                <p className="font-semibold text-gray-900">Product Types</p>
                <Link
                  to="/shop?type=simple"
                  onClick={closeMobileMenu}
                  className="block py-1"
                >
                  Simple Product
                </Link>
                <Link
                  to="/shop?type=grouped"
                  onClick={closeMobileMenu}
                  className="block py-1"
                >
                  Grouped Product
                </Link>
                <Link
                  to="/shop?type=variable"
                  onClick={closeMobileMenu}
                  className="block py-1"
                >
                  Variable Product
                </Link>
                <p className="pt-2 font-semibold text-gray-900">Pages</p>
                <Link
                  to="/cart"
                  onClick={closeMobileMenu}
                  className="block py-1"
                >
                  Cart Page
                </Link>
                <Link
                  to="/checkout"
                  onClick={closeMobileMenu}
                  className="block py-1"
                >
                  Checkout Page
                </Link>
                <Link
                  to="/account"
                  onClick={closeMobileMenu}
                  className="block py-1"
                >
                  My Account
                </Link>
              </div>
            )}
          </li>

          {/* MOBILE CATEGORIES DROPDOWN */}
          <li>
            <button
              onClick={() => toggleSubMenu("categories")}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              <span>Categories</span>
              <FiChevronDown
                className={`transition-transform duration-200 ${
                  activeSubMenu === "categories" ? "rotate-180" : ""
                }`}
              />
            </button>
            {activeSubMenu === "categories" && (
              <div className="mt-2 space-y-2 pl-4 text-sm text-gray-600">
                <Link
                  to="/category/digital-camera"
                  onClick={closeMobileMenu}
                  className="block py-1"
                >
                  Digital Camera
                </Link>
                <Link
                  to="/category/smartphones"
                  onClick={closeMobileMenu}
                  className="block py-1"
                >
                  Smartphones
                </Link>
                <Link
                  to="/category/televisions"
                  onClick={closeMobileMenu}
                  className="block py-1"
                >
                  Televisions
                </Link>
              </div>
            )}
          </li>

          <li>
            <Link
              to="/about"
              onClick={closeMobileMenu}
              className="block rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              About Us
            </Link>
          </li>
        </ul>

        {/* MOBILE AUTH ACTION BUTTONS */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          {isLoggedIn ? (
            <button
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 py-2.5 font-medium text-red-600 hover:bg-red-100"
            >
              <GrLogout /> Logout
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="w-full rounded-lg border border-gray-300 py-2.5 text-center font-medium text-gray-700 hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={closeMobileMenu}
                className="w-full rounded-lg bg-blue-600 py-2.5 text-center font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </aside>
    </nav>
  );
};

export default Navbar;
