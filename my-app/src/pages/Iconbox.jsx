import React from "react";
import { Link } from "react-router-dom";
import { FaFolder } from "react-icons/fa";
import { BiSolidBell } from "react-icons/bi";
import { MdOutlineRocketLaunch } from "react-icons/md";
import { CiFolderOn } from "react-icons/ci";
import { IoMoonOutline } from "react-icons/io5";
import { AiFillFlag } from "react-icons/ai";


function Iconbox() {
  return (
    <div className="w-full">
      {/* heading */}
      <div className="flex items-center justify-between bg-slate-300 px-9 py-10">
        <h4 className="text-2xl font-bold text-black">Icon Box</h4>

        <div className="flex gap-3 text-xl">
          <Link to="/" className="text-gray-700 transition hover:text-blue-600">
            Home
          </Link>

          <p>/</p>

          <Link
            to="/shop"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Icon Box
          </Link>
        </div>
      </div>

      <div className="mx-auto my-10 flex max-w-7xl items-stretch gap-10 px-6">
        {/*  LEFT IMAGE  */}
        <div className="w-1/2 overflow-hidden rounded-xl ">
          <img
            className="h-full w-full object-cover"
            src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2023/12/Icon-box-banner.png"
            alt="Accordion Banner"
          />
        </div>

        {/*  RIGHT SIDE  */}
        <div className="w-1/2 px-3 py-3 my-28">
          <p className="text-xl text-gray-400">Multiple icons</p>

          <h1 className="mt-1 text-4xl font-bold text-gray-900">Icons boxes</h1>

          {/* icon section details */}
          <div className="flex items-center gap-5">
            {/* ICON */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-yellow-300">
              <FaFolder className="text-2xl text-black transition-all duration-300 hover:text-white" />
            </div>

            {/* CONTENT */}
            <div>
              <h5 className="text-lg font-semibold text-gray-900">
                Global SEO research
              </h5>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                diam dolor, accum.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* ICON */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-yellow-300">
              <BiSolidBell className="text-2xl text-black transition-all duration-300 hover:text-white" />
            </div>

            {/* CONTENT  ICon 2*/}
            <div>
              <h5 className="text-lg font-semibold text-gray-900">
                Social media integration
              </h5>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                diam dolor, accum.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* ICON */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-yellow-300">
              <MdOutlineRocketLaunch className="text-2xl text-black transition-all duration-300 hover:text-white" />
            </div>

            {/* Icon 3 */}
            <div>
              <h5 className="text-lg font-semibold text-gray-900">
                Launching the application
              </h5>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                diam dolor, accum.
              </p>
            </div>
          </div>
        </div>
      </div>

      

      {/* card section icon */}
      <div className="flex justify-between my-7">
        {/* Icon card 1  */}
        <div className="w-1/3 border-r-4 border-gray-200 px-8 py-10 text-center">
          {/* ICON */}
          <div className="mb-5 flex justify-center">
            <CiFolderOn className="text-5xl text-gray-800 hover:text-yellow-500 font-bold" />
          </div>

          {/* TITLE */}
          <h3 className="text-xl font-semibold text-gray-900">
            Targeted accounts
          </h3>

          {/* DESCRIPTION */}
          <p className="mt-3 leading-6 text-gray-600">
            Nullam eu neque cras ut erat nunc ac dui vel mi sed morbi eu elit.
          </p>

          {/* BUTTON */}
          <button className="mt-5 font-semibold text-black transition-colors duration-300 hover:text-yellow-500">
            VIEW MORE
          </button>
        </div>

        {/* Icon card 2  */}
      <div className="w-1/3 border-r-4 border-gray-200 px-8 py-10 text-center">
          {/* ICON */}
          <div className="mb-5 flex justify-center">
            <IoMoonOutline className="text-5xl text-gray-800 hover:text-yellow-500" />
          </div>

          {/* TITLE */}
          <h3 className="text-xl font-semibold text-gray-900">
           Future customers
          </h3>

          {/* DESCRIPTION */}
          <p className="mt-3 leading-6 text-gray-600">
            Nullam eu neque cras ut erat nunc ac dui vel mi sed morbi eu elit.
          </p>

          {/* BUTTON */}
          <button className="mt-5 font-semibold text-black transition-colors duration-300 hover:text-yellow-500">
            VIEW MORE
          </button>
        </div>
        {/* Icon card 3 */}
         <div className="w-1/3 border-r-4 border-gray-200 px-8 py-10 text-center">
          {/* ICON */}
          <div className="mb-5 flex justify-center">
            <AiFillFlag   className="text-5xl text-gray-800 hover:text-yellow-500" />
          </div>

          {/* TITLE */}
          <h3 className="text-xl font-semibold text-gray-900">
Personal connections          </h3>

          {/* DESCRIPTION */}
          <p className="mt-3 leading-6 text-gray-600">
            Nullam eu neque cras ut erat nunc ac dui vel mi sed morbi eu elit.
          </p>

          {/* BUTTON */}
          <button className="mt-5 font-semibold text-black transition-colors duration-300 hover:text-yellow-500">
            VIEW MORE
          </button>
        </div>
      </div>
    </div>
  );
}

export default Iconbox;
