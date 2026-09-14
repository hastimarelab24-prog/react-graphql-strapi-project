import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineCheck } from "react-icons/ai";
import { blogData } from "./Details";
function Portfolio() {
  return (
    <div>
        {/* Heading  */}
      <div className="flex items-center justify-between bg-slate-300 px-9 py-10">
        <h4 className="text-2xl font-bold text-black">Portfolio</h4>

        <div className="flex gap-3 text-xl">
          <Link to="/" className="text-gray-700 transition hover:text-blue-600">
            Home
          </Link>

          <p>/</p>

          <Link
            to="/shop"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Portfolio
          </Link>
        </div>
      </div>

      <div className="mx-auto my-10 flex max-w-7xl items-stretch gap-10 px-6">
        {/*  LEFT IMAGE  */}

        <div className="w-1/2 px-3 py-3 my-28">
          <p className="text-xl text-gray-400">Our work</p>

          <h1 className="mt-1 text-4xl font-bold text-gray-900">
            Manage Everything in Your Hand
          </h1>

          <p className=" mt-6 mb-6 text-gray-500">
            There are many variations of passages of Lorem Ipsum available, but
            the majority have suffered alteration in some form have suffered
            alteration in some form. There are many variations of passages of
            Lorem Ipsum available, but the majority have suffered alteration.
          </p>

          <ul className="text-gray-500">
            <li className="flex gap-4 my-3">
              <AiOutlineCheck className="hover:text-yellow-500  rounded-full text-xl bg-yellow-400 justify-center text-white " />{" "}
              Campaigns Per Day
            </li>
            <li className="flex gap-4 my-3">
              {" "}
              <AiOutlineCheck className="hover:text-yellow-500 rounded-full text-xl bg-yellow-400 justify-center text-white " />
              Digital Marketing
            </li>
            <li className="flex gap-4 my-3">
              {" "}
              <AiOutlineCheck className="hover:text-yellow-500 rounded-full text-xl bg-yellow-400 justify-center text-white" />
              Marketing Agency
            </li>
            <li className="flex gap-4 my-3">
              {" "}
              <AiOutlineCheck className="hover:text-yellow-500 rounded-full text-xl bg-yellow-400 justify-center text-white " />
              Style Templates
            </li>
            <li className="flex gap-4 my-3">
              {" "}
              <AiOutlineCheck className="hover:text-yellow-500 rounded-full text-xl bg-yellow-400 justify-center text-white " />
              24*7 Hour Support
            </li>
          </ul>
        </div>

        {/*  RIGHT SIDE  */}
        <div className="w-1/2 overflow-hidden rounded-xl ">
          <img
            className="h-full w-full object-cover"
            src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2023/12/portfolio-banner.png"
            alt="Accordion Banner"
          />
        </div>
      </div>

      {/* Best of our work section */}
      <div className="  px-6 py-16">
        {/* Heading section */}
        <div className="mb-10 text-center">
          <h5 className="text-lg font-medium text-gray-500">Our Look-out</h5>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Best Of Our Work
          </h1>
        </div>

        {/* Image section */}
        <div className="grid grid-cols-3 gap-6">
          {blogData.map((blog, index) => (
            <div key={index} className="overflow-hidden rounded-xl">
              <img
                src={blog.Image}
                alt={blog.title || "Our Work"}
                className="h-80 w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
