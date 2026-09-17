import React from "react";
import Home from "./pages/Home";
import Login from "./pages/login";
import Singup from "./pages/Singup";
import Products from "./pages/Products";
import Cart from "./pages/cart";
import Search from "./components/Search";
import Shop from "./pages/Shop";
import Category from "./components/Category";
import About from "./pages/About";
import FeaturedProducts from "./pages/FeaturedProducts";
import According from "./components/According";
import Iconbox from "./pages/Iconbox";
import Portfolio from "./pages/Portfolio";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact ";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ForgotPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import Wishlist from "./pages/wishlist";
import Checkout from "./components/CheckoutFrom";
import AdminDashboard from "./admin/AdminDashboard";
const routes = [
  <Navbar />,
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/signup",
    element: <Singup />,
  },
  {
    path: "/shop",
    element: <Shop />,
  },
  {
    path: "/products/:pid",
    element: <Products />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/Category",
    element: <Category />,
  },
  {
    path: "/Category/:category",
    element: <Category />,
  },
  {
    path: "/about",
    element: <About />,
  },

  {
    path: "/FeaturProducts",
    element: <FeaturedProducts />,
  },
  {
    path: "/element",
    element: <According />,
  },
  {
    path: "/iconbox",
    element: <Iconbox />,
  },
  {
    path: "/portfolio",
    element: <Portfolio />,
  },
  {
    path: "/gallery",
    element: <Gallery />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/wishlist",
    element: <Wishlist />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path:"/admin-dashboard",
    element:<AdminDashboard/>
  },
  <Footer />,
];

export default routes;
