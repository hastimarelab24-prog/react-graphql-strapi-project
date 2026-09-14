
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthActions } from "../hooks/useAuthActions";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code") || "";

  const [formData, setFormData] = useState({
    password: "",
    passwordConfirmation: "",
  });

  const { confirmPasswordReset, loading, error } = useAuthActions();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code) {
      alert("Missing reset code in URL. Please use the link sent to your email.");
      return;
    }

    if (formData.password !== formData.passwordConfirmation) {
      alert("Passwords do not match!");
      return;
    }

    const result = await confirmPasswordReset(
      formData.password,
      formData.passwordConfirmation,
      code
    );

    if (result.success) {
      alert("Password updated successfully!");
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
          Reset Password
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Enter your new password below.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              name="passwordConfirmation"
              required
              value={formData.passwordConfirmation}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;