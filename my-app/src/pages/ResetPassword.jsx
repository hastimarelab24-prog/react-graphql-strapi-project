import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { RESET_PASSWORD } from "../gqloperation/mutation";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Extract reset code/token from URL (e.g., /reset-password?code=xyz)
  const code = searchParams.get("code");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [resetPassword, { loading, error }] = useMutation(RESET_PASSWORD);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (validationError) setValidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code) {
      setValidationError("Invalid or missing reset token. Please request a new password reset link.");
      return;
    }

    if (formData.password.length < 6) {
      setValidationError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({
        variables: {
          code: code,
          password: formData.password,
          passwordConfirmation: formData.confirmPassword,
        },
      });
      setIsSuccess(true);
    } catch (err) {
      console.error("Reset Password Error:", err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
          {!isSuccess ? (
            <>
              {/* Header */}
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
                <p className="mt-2 text-sm text-gray-500">
                  Enter your new password below to reset your account credentials.
                </p>
              </div>

              {/* GraphQL / Backend Error */}
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-center">
                  <p className="text-sm font-medium text-red-600">{error.message}</p>
                </div>
              )}

              {/* Form Validation Error */}
              {validationError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-center">
                  <p className="text-sm font-medium text-red-600">{validationError}</p>
                </div>
              )}

              {/* Form Inputs */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-600"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-gray-600"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Updating Password..." : "Reset Password"}
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900">Password Updated!</h2>
              <p className="mt-2 text-sm text-gray-500">
                Your password has been successfully reset. You can now log in with your new password.
              </p>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-6 w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;