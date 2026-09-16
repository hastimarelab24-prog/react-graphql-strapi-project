import React, { useState } from "react";
import { Link } from "react-router-dom";

function Accordion() {
  const [openIndex, setOpenIndex] = useState(0);

  const accordionData = [
    {
      title: "Accordion 01",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    },
    {
      title: "Accordion 02",
      content:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.",
    },
    {
      title: "Accordion 03",
      content:
        "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system.",
    },
  ];

  const handleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full mt-16">
      {/*  HEADING  */}
      <div className="flex items-center justify-between bg-slate-300 px-9 py-10">
        <h4 className="text-2xl font-bold text-black">Accordion</h4>

        <div className="flex gap-3 text-xl">
          <Link to="/" className="text-gray-700 transition hover:text-blue-600">
            Home
          </Link>

          <p>/</p>

          <Link
            to="/shop"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Shop
          </Link>
        </div>
      </div>

      {/*  CONTENT  */}
      <div className="mx-auto my-10 flex max-w-7xl items-stretch gap-10 px-6">
        {/*  LEFT IMAGE  */}
        <div className="w-1/2 overflow-hidden rounded-xl border border-gray-200">
          <img
            className="h-full w-full object-cover"
            src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2023/12/accordion-banner-01.jpg"
            alt="Accordion Banner"
          />
        </div>

        {/*  RIGHT SIDE  */}
        <div className="w-1/2 px-3 py-3">
          <p className="text-xl text-gray-400">Pick Your Style</p>

          <h1 className="mt-1 text-4xl font-bold text-gray-900">
            Boxes and Border
          </h1>

          {/*  ACCORDION  */}
          <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {accordionData.map((item, index) => (
              <div key={index}>
                {/* HEADER */}
                <button
                  type="button"
                  onClick={() => handleAccordion(index)}
                  className=" flex w-full items-center justify-between border-b border-gray-200 px-5 py-5 text-left font-medium text-gray-800 transition-all duration-300 hover:bg-gray-50 hover:text-blue-600
                  "
                >
                  <span>{item.title}</span>

                  <span
                    className={`
                      text-xl
                      transition-transform duration-300
                      ${openIndex === index ? "rotate-180" : "rotate-0"}
                    `}
                  >
                    ↓
                  </span>
                </button>

                {/* CONTENT */}
                {openIndex === index && (
                  <div className="border-b border-gray-200 bg-white px-5 py-5">
                    <p className="leading-7 text-gray-600">{item.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Accordion colors */}
      <div className="mx-auto my-10 flex max-w-full items-stretch gap-10 bg-gray-300 px-6">
        {/* LEFT SIDE - ACCORDION */}
        <div className="flex w-1/2 flex-col px-3 py-3 my-32">
          <p className="text-xl text-gray-600">Fully adjustable</p>

          <h1 className="mt-1 text-4xl font-bold text-gray-900">
            Accordion colors
          </h1>

          {/* ACCORDION */}
          <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {accordionData.map((item, index) => (
              <div key={index}>
                {/* HEADER */}
                <button
                  type="button"
                  onClick={() => handleAccordion(index)}
                  className="flex w-full items-center justify-between border-b border-gray-200 px-5 py-5 text-left font-medium text-gray-800 transition-all duration-300 hover:bg-gray-50 hover:text-blue-600"
                >
                  <span>{item.title}</span>

                  <span
                    className={`text-xl transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    ↓
                  </span>
                </button>

                {/* CONTENT */}
                {openIndex === index && (
                  <div className="border-b border-gray-200 bg-white px-5 py-5">
                    <p className="leading-7 text-gray-600">{item.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - IMAGE */}
        <div className="flex w-1/2 overflow-hidden rounded-xl border border-gray-200">
          <img
            className="h-full w-full object-cover"
            src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2023/12/accordion-banner-02.png"
            alt="Accordion Banner"
          />
        </div>
      </div>

      {/* Typography styles */}
      <div className="mx-auto my-10 flex max-w-7xl items-stretch gap-10 px-6">
        {/*  LEFT IMAGE  */}
        <div className="w-1/2 overflow-hidden rounded-xl border border-gray-200">
          <img
            className="h-full  w-full "
            src="https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2023/12/accordion-banner-03.png"
            alt="Accordion Banner"
          />
        </div>

        {/*  RIGHT SIDE  */}
        <div className="w-1/2 px-3 py-3">
          <p className="text-xl text-gray-400">Fonts, colors & more</p>

          <h1 className="mt-1 text-4xl font-bold text-gray-900">
            Typography styles
          </h1>

          {/*  ACCORDION  */}
          <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {accordionData.map((item, index) => (
              <div key={index}>
                {/* HEADER */}
                <button
                  type="button"
                  onClick={() => handleAccordion(index)}
                  className=" flex w-full items-center justify-between border-b border-gray-200 px-5 py-5 text-left font-medium text-gray-800 transition-all duration-300 hover:bg-gray-50 hover:text-blue-600
                  "
                >
                  <span>{item.title}</span>

                  <span
                    className={`
                      text-xl
                      transition-transform duration-300
                      ${openIndex === index ? "rotate-180" : "rotate-0"}
                    `}
                  >
                    ↓
                  </span>
                </button>

                {/* CONTENT */}
                {openIndex === index && (
                  <div className="border-b border-gray-200 bg-white px-5 py-5">
                    <p className="leading-7 text-gray-600">{item.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accordion;
