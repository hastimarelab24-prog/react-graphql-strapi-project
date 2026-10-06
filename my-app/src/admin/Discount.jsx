import React, { useEffect, useState } from "react";
import { useOffer } from "../context/OfferContext";
import { from } from "@apollo/client";

const Discount = () => {
  const { offer, loading, saving, error, fetchOffer, saveOffer } = useOffer();

  const [formData, setFormData] = useState({
    name: "",
    isActive: false,
    discountType: "percentage",
    discountValue: "0",
  });
  const [localError, setLocalError] = useState("");

  // local strapi Global offer
  useEffect(() => {
    if (offer) {
      setFormData({
        name: offer.name || "",
        isActive: Boolean(offer.isActive),
        discountType: offer.discountType || "percentage",
        discountValue: String(offer.discountValue ?? 0),
      });
    }
  }, [offer]);

  // input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // save discount
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLocalError("");

      if (!formData.name.trim()) {
        throw new Error("Please enter discount name.");
      }

      const discountValue = Number(formData.discountValue);

      if (!Number.isInteger(discountValue) || discountValue < 0) {
        throw new Error(" discount value must be a whole number.");
      }

      if (formData.discountType === "percentage" && discountValue > 100) {
        throw new Error("perge centage discount cannot be more than 100%");
      }

      await saveOffer({...formData,discountValue,});

      alert("Discount update successfully!");
    } catch (err) {
      console.error("Discount save error", err);
      setLocalError(err.message);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gray-50 p-4  md:p-6">
      {/* header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Discount</h1>
        <p className="mt-1 text-sm text-gray-500">
          manger discount for all products
        </p>
      </div>

      {/* main crad */}
      <div className="max-w-4xl rounded-2xl border bg-white p-5 shadow-sm md:p-7">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Global Discount
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              this discount will apply to all products
            </p>
          </div>

          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              formData.isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {formData.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        {loading ? (
          <div className="py-10 text-center text-gray-500">
            Loading discount....
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* name */}
            <div className="mb-5">
              <label
                htmlFor=""
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Discount Name
              </label>

              <input
                type=" text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="festive Discount"
                required
                className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* active */}
            <div className="mb-5 rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">Active Discount</h3>
                  <p className="text-sm text-gray-500">
                    enble discount for all products
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-5 w-5 accent-blue-600"
                />
              </div>
            </div>

            {/* discount type + value */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor=""
                  className="mb-2 block text-sm font-medium text-gray-500"
                >
                  Discount Type
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  className="w-full rounded-lg border bg-white p-3"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor=""
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Discount Value
                </label>

                <input
                  type="number"
                  name="discountValue"
                  min="0"
                  step="1"
                  value={formData.discountValue}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                />
              </div>
            </div>

            {/* preview*/}
            <div className="mt-6 rounded-xl bg-blue-50 p-5">
              <p className="text-sm text-gray-500">Current global Discount</p>

              <h3 className="mt-2 text-3xl font-bold text-blue-600">
                {formData.isActive
                  ? formData.discountType === "percentage"
                    ? `${formData.discountValue}% OFF`
                    : `₹${formData.discountValue} OFF`
                  : "No Discount"}
              </h3>

              {
                formData.isActive && (
                    <p className="mt-2 text-sm text-gray-600">
                        Applied to all products
                    </p>
                )
              }
            </div>

            {/* error */}
            {
                displayError && (
                    <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {displayError}
                    </div>
                )
            }

            {/* buttton */}
            <div className="mt-6 flex gap-3">
                <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Discount"}
                </button>

                <button type=" button" onClick={fetchOffer} disabled={loading} 
                className="rounded-xl border px-6 py-3 font-semibold text-gray-700 hover:bg-white">
                    Refersh
                </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Discount;
