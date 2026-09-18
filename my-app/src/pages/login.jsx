import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { LOGIN_USER } from "../gqloperation/mutation";

function Login() {
  const navigate = useNavigate();
  const location=useLocation();


  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [loginUser, { loading, error, data }] = useMutation(LOGIN_USER);

  // Auth check & redirect on success
  // useEffect(() => {
  //   if (data?.login) {
  //     // login jwt token saving
  //     localStorage.setItem("token", data.login.jwt);

  //     // checkout user saving information 
  //     localStorage.setItem("user",JSON.stringify(data.login.user))
  //     // Notify navbar
  //     window.dispatchEvent(new Event("authChange"));
  //       // redirect to checkout if user came from checkout
  //     navigate(location.state?.form || "/",{
  //       replace:true,
  //     });
  //   }
  // }, [data, navigate,location]);


  useEffect(() => {
  if (data?.login) {
    localStorage.setItem("token", data.login.jwt);

    localStorage.setItem(
      "user",
      JSON.stringify(data.login.user)
    );

    console.log("Strapi JWT saved:", !!data.login.jwt);

    window.dispatchEvent(new Event("authChange"));

    navigate(location.state?.form || "/", {
      replace: true,
    });
  }
}, [data, navigate, location]);



  // Handle invalid credentials error
  useEffect(() => {
    if (error) {
      console.log("Login Error", error.message);
      const message = error.message.toLowerCase();
      if (
        message.includes("invalid identifier") ||
        message.includes("user not found") ||
        message.includes("identifier")
      ) {
        // Optional: redirect on failed user lookup
        // navigate("/signup");
      }
    }
  }, [error, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      alert("Please enter email/username and password");
      return;
    }

    try {
      await loginUser({
        variables: {
          input: {
            identifier: formData.identifier,
            password: formData.password,
          },
        },
      });
    } catch (err) {
      console.log("Login Error", err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-sm text-gray-500">
              Login To Continue Shopping
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-center">
              <p className="text-sm font-medium text-red-600">{error.message}</p>
            </div>
          )}

          {/* Success Banner */}
          {data?.login?.jwt && (
            <div className="mb-5 rounded-lg border border-green-400 bg-green-50 p-3 text-center">
              <p className="text-sm font-medium text-green-600">
                Login successfully! Redirecting...
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email or Username Input */}
            <div>
              <label
                htmlFor="identifier"
                className="mb-2 block text-sm font-medium text-gray-600"
              >
                Email or Username
              </label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Enter email or username"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Password Input + Forgot Password Link */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-600"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs font-semibold text-gray-600 hover:text-black hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Signup Switch */}
          <div className="mt-7 border-t border-gray-100 pt-6 text-center">
            <span className="text-sm text-gray-500">
              Don't have an account?{" "}
            </span>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-sm font-semibold text-black hover:underline"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;