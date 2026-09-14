import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthActions } from "../hooks/useAuthActions";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { requestPasswordReset, loading, error } = useAuthActions();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email address");
      return;
    }

    const result = await requestPasswordReset(email);
    if (result.success) {
      setSubmitted(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
          Forgot Password
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Enter your registered email to receive a password reset link.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {submitted ? (
          <div className="text-center">
            <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-700">
              Check your email! Password reset link sent to <strong>{email}</strong>.
            </div>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm font-semibold text-black hover:underline"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;