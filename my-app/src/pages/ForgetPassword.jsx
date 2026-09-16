import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { FORGET_PASSWORD } from "../gqloperation/mutation";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState("");

  const [forgotPassword, { loading, error }] = useMutation(FORGET_PASSWORD);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (validationError) setValidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setValidationError("Please enter your registered email address.");
      return;
    }

    try {
      // Execute Strapi / GraphQL forgot password mutation
      const response = await forgotPassword({
        variables: { email: email.trim() },
      });

      if (response?.data) {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error("Forgot Password Error:", err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
          
          {!isSubmitted ? (
            <>
              {/* Form Header */}
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900">Forgot Password?</h1>
                <p className="mt-2 text-sm text-gray-500">
                  Enter your registered email address to receive a password reset link.
                </p>
              </div>

              {/* Error Banners */}
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-center">
                  <p className="text-sm font-medium text-red-600">{error.message}</p>
                </div>
              )}

              {validationError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-center">
                  <p className="text-sm font-medium text-red-600">{validationError}</p>
                </div>
              )}

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-600"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Enter your registered email"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            /* Confirmation State */
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900">Email Sent!</h2>
              <p className="mt-2 text-sm text-gray-500">
                A password reset link has been dispatched to <br />
                <span className="font-semibold text-gray-800">{email}</span>.
              </p>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="text-xs font-semibold text-gray-600 hover:text-black hover:underline disabled:opacity-50"
                >
                  {loading ? "Resending..." : "Didn't receive the email? Resend link"}
                </button>
              </div>
            </div>
          )}

          {/* Navigation Link */}
          <div className="mt-7 border-t border-gray-100 pt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:underline"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;