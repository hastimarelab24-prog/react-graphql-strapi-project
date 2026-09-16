import React, { useState } from "react";
import { data, Link } from "react-router-dom";

import { FaFolder, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  // handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // handle from submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });
    try {
      // Api call placeholder (fetch(api/contact),{method:'POST',body:JSON.Stringfy(formData)})
      await new Promise((resolve) => setTimeout(resolve, 1000)); //Simulating async request

      //  Optinal:store submissions in loaclStorage foe testing
      const existingMessages = JSON.parse(
        localStorage.getItem("contact_submission") || "[]",
      );
      localStorage.setItem(
        "contact_submissions",
        JSON.stringify([
          ...existingMessages,
          { ...formData, data: new Date().toISOString() },
        ]),
      );
      setStatus({ loading: false, success: true, error: null });
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: "Failed to send message.please try again",
      });
    }
  };
  return (
    <div className="mt-16">
      {/* HEADER */}
      <div className="flex items-center justify-between bg-slate-300 px-9 py-10">
        <h4 className="text-2xl font-bold text-black">Contact</h4>

        <div className="flex gap-3 text-xl">
          <Link to="/" className="text-gray-700 transition hover:text-blue-600">
            Home
          </Link>

          <p>/</p>

          <Link
            to="/contact"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Contact
          </Link>
        </div>
      </div>

      {/* CONTACT SECTION */}
      <div className=" my-10 flex  items-stretch gap-10 px-6">
        {/* LEFT IMAGE */}
        <div className="w-1/2 overflow-hidden rounded-xl">
          <iframe
            title="Our Location"
            src="https://www.google.com/maps?q=51.477135,-0.484166&z=15&output=embed"
            className="h-full min-h-[500px] w-full border-0"
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>

        {/* RIGHT SIDE */}

        <div className="w-1/2 px-3 py-10">
          <p className="text-xl text-gray-400">Get In Touch with Us</p>

          <h1 className="mt-2 text-4xl font-bold leading-tight text-gray-900">
            If you wish to directly reach us, Please fill out the form below -
          </h1>

          {/* feedback alert */}
          {status.success && (
            <div className="mt-4 rounded-lg bg-green-100 p-4 text-green-700">
              THanks you ! Your message has been sent successfully.
            </div>
          )}

          {status.error && (
            <div className="mt-4 rounded-lg bg-red-100 p-4 text-red-700">
              {status.error}
            </div>
          )}

          {/* FORM */}
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {/* NAME */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Your Name
              </label>

              <input
                id="name"
                type="text"
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Your Email
              </label>

              <input
                id="email"
                type="email"
                onChange={handleChange}
                placeholder="Your email id"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* MESSAGE */}
            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Your Message (Optional)
              </label>

              <textarea
                id="message"
                rows="5"
                placeholder="Your message"
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              ></textarea>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="rounded-lg bg-black px-7 py-3 font-semibold text-white transition hover:bg-yellow-400 hover:text-black"
            >
              SEND MESSAGE
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 flex w-full items-start justify-between gap-6 bg-gray-100 p-6">
        {/* ADDRESS */}
        <div className="flex flex-1 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-yellow-400">
            <FaFolder className="text-xl" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900">Address</h3>
            <p className="mt-1 text-gray-600">
              60 29th San Francisco, 507 - Union Trade Center
            </p>
          </div>
        </div>

        {/* PHONE */}
        <div className="flex flex-1 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-yellow-400">
            <FaPhone className="text-xl" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900">Call us :</h3>
            <p className="mt-1 text-gray-600">+00 123-456-789</p>
          </div>
        </div>

        {/* EMAIL */}
        <div className="flex flex-1 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-yellow-400">
            <FaEnvelope className="text-xl" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900">Mail us :</h3>
            <p className="mt-1 text-gray-600">demo@example.com</p>
          </div>
        </div>

        {/* OPEN TIME */}
        <div className="flex flex-1 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-yellow-400">
            <FaClock className="text-xl" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900">Open time :</h3>
            <p className="mt-1 text-gray-600">10:00AM – 6:00PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
