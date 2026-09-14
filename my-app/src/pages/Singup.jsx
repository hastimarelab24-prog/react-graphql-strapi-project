import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SINGUP_USER } from "../gqloperation/mutation";
import { useMutation } from "@apollo/client/react";

function Singup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [singupUser, { loading, error, data }] = useMutation(SINGUP_USER);

  useEffect(() => {
    if (data?.register) {
      navigate("/login");
    }
  }, [data, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    singupUser({
      variables: {
        input: formData,
      },
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-yellow-400"></div>
          <p className="mt-4 text-sm font-medium text-gray-600">
            Creating your account...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-lg">

          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Sign up to create your account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error.message}
            </div>
          )}

          {/* Success */}
          {data?.register && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
              Signup successful! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
              />
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-yellow-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 border-t border-gray-100 pt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-black transition hover:text-yellow-500"
              >
                Login
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Singup;

