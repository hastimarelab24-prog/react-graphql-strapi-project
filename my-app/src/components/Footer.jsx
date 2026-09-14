import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-slate-950 text-gray-300">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-14">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">
              Electro Hub
            </h2>

            <p className="text-gray-400 leading-7 max-w-sm">
              Discover the latest electronics, gadgets and accessories
              at the best prices. Quality products with a seamless
              shopping experience.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">

              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center
                rounded-full bg-slate-800 text-gray-300
                hover:bg-blue-600 hover:text-white
                transition-all duration-300"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center
                rounded-full bg-slate-800 text-gray-300
                hover:bg-pink-600 hover:text-white
                transition-all duration-300"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center
                rounded-full bg-slate-800 text-gray-300
                hover:bg-sky-500 hover:text-white
                transition-all duration-300"
              >
                <FaTwitter />
              </a>

              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center
                rounded-full bg-slate-800 text-gray-300
                hover:bg-red-600 hover:text-white
                transition-all duration-300"
              >
                <FaYoutube />
              </a>

            </div>
          </div>


          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3">

              <li>
                <a
                  href="/"
                  className="hover:text-yellow-400 transition duration-300"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="/products"
                  className="hover:text-yellow-400 transition duration-300"
                >
                  Products
                </a>
              </li>

              <li>
                <a
                  href="/categories"
                  className="hover:text-yellow-400 transition duration-300"
                >
                  Categories
                </a>
              </li>

              <li>
                <a
                  href="/about"
                  className="hover:text-yellow-400 transition duration-300"
                >
                  About Us
                </a>
              </li>

              <li>
                <a
                  href="/contact"
                  className="hover:text-yellow-400 transition duration-300"
                >
                  Contact Us
                </a>
              </li>

            </ul>
          </div>


          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5">
              Customer Service
            </h3>

            <ul className="space-y-3">

              <li>
                <a
                  href="#"
                  className="hover:text-yellow-400 transition duration-300"
                >
                  My Account
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-yellow-400 transition duration-300"
                >
                  My Orders
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-yellow-400 transition duration-300"
                >
                  Shopping Cart
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-yellow-400 transition duration-300"
                >
                  Wishlist
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-yellow-400 transition duration-300"
                >
                  Privacy Policy
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-yellow-400 transition duration-300"
                >
                  Terms & Conditions
                </a>
              </li>

            </ul>
          </div>


          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5">
              Contact Us
            </h3>

            <div className="space-y-5">

              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-yellow-400" />

                <p className="text-gray-400">
                  Ahmedabad, Gujarat, India
                </p>
              </div>

              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-yellow-400" />

                <p className="text-gray-400">
                  +91 98765 43210
                </p>
              </div>

              <div className="flex items-center gap-3">
                <FaEnvelope className="text-yellow-400" />

                <p className="text-gray-400">
                  support@electrohub.com
                </p>
              </div>

            </div>
          </div>

        </div>


        {/* Newsletter */}
        <div className="border-t border-slate-800 mt-12 pt-10">

          <div className="flex flex-col lg:flex-row
          justify-between items-center gap-6">

            <div>
              <h3 className="text-xl font-semibold text-white">
                Subscribe to our newsletter
              </h3>

              <p className="text-gray-400 mt-2">
                Get the latest products, offers and updates.
              </p>
            </div>

            <div className="flex w-full lg:w-auto">

              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 w-full lg:w-80
                bg-slate-900 border border-slate-700
                text-white placeholder-gray-500
                rounded-l-lg
                focus:outline-none
                focus:border-yellow-400"
              />

              <button
                className="px-6 py-3
                bg-yellow-400 text-slate-950
                font-semibold
                rounded-r-lg
                hover:bg-yellow-300
                transition duration-300"
              >
                Subscribe
              </button>

            </div>

          </div>

        </div>

      </div>


      {/* Bottom Footer */}
      <div className="border-t border-slate-800">

        <div className="max-w-7xl mx-auto px-6 py-5">

          <div className="flex flex-col md:flex-row
          justify-between items-center gap-3 text-sm">

            <p className="text-gray-500">
              © {new Date().getFullYear()}{" "}
              <span className="text-yellow-400 font-medium">
                Electro Hub
              </span>
              . All rights reserved.
            </p>

            <p className="text-gray-500">
              Designed & Developed with ❤️
            </p>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;

