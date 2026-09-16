import React from "react";
import { Link } from "react-router-dom";
import { blogData } from "./Details";

function Gallery() {
  return (
    <div className="mt-24">
      <div className="flex items-center justify-between bg-slate-300 px-9 py-10">
        <h4 className="text-2xl font-bold text-black">Gallery</h4>

        <div className="flex gap-3 text-xl">
          <Link to="/" className="text-gray-700 transition hover:text-blue-600">
            Home
          </Link>

          <p>/</p>

          <Link
            to="/gallery"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Gallery
          </Link>
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

        {/* Gallery Grid  */}

        <div className=" my-10 flex  items-stretch gap-10 px-6">
          {/* LEFT SIDE */}
          <div className="my-28 w-1/2 px-3 py-3">
            <p className="text-xl text-gray-400">Gallery</p>

            <h1 className="mt-1 text-4xl font-bold text-gray-900">
              Gallery Grid Style
            </h1>

            <p className="mb-6 mt-6 text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
              tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </p>
            <button
            to="/gallery" 
            className=" py-3 px-7 border border-r-4 bg-yellow-500  rounded-lg ">
                VIEW MORE
            </button>
          </div>

          {/* RIGHT SIDE - 4 IMAGES */}
          <div className="grid w-1/2 grid-cols-2 gap-5">
            {blogData.slice(0, 4).map((blog, index) => (
              <div key={index} className="overflow-hidden rounded-xl">
                <img
                  src={blog.Image}
                  alt={blog.title || "Our Work"}
                  className="h-60 w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

{/* Image section */}
   <div className="m-0 flex w-full ">

  {blogData.slice(0, 4).map((blog, index) => (
    <div
      key={index}
      className="w-1/4 overflow-hidden rounded-xl"
    >
      <img
        src={blog.Image}
        alt={blog.title || "Our Work"}
        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
      />
    </div>
  ))}

</div>
    </div>
  );
}

export default Gallery;
