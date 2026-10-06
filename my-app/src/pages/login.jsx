// import React, { useEffect, useState } from "react";
// import {
//   useLocation,
//   useNavigate,
// } from "react-router-dom";
// import { useMutation } from "@apollo/client/react";
// import { LOGIN_USER } from "../gqloperation/mutation";

// function Login() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [formData, setFormData] = useState({
//     identifier: "",
//     password: "",
//   });

//   const [
//     loginUser,
//     {
//       loading,
//       error,
//       data,
//     },
//   ] = useMutation(LOGIN_USER);

//   useEffect(() => {
//     if (!data?.login) {
//       return;
//     }

//     const user = data.login.user;
//     const token = data.login.jwt;

//     // Save JWT token
//     localStorage.setItem("token", token);

//     // Save logged-in user
//     localStorage.setItem(
//       "user",
//       JSON.stringify(user)
//     );

//     // Notify application
//     window.dispatchEvent(
//       new Event("authChange")
//     );

//     // Get previous page
//     const from =
//       location.state?.from || "/";

//     // Go back to previous page
//     navigate(from, {
//       replace: true,
//     });
//   }, [data, navigate, location.state]);

//   useEffect(() => {
//     if (error) {
//       console.log(
//         "Login Error:",
//         error.message
//       );
//     }
//   }, [error]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };


// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!formData.identifier || !formData.password) {
//     alert("Please enter email/username and password");
//     return;
//   }

//   try {
//     const response = await fetch(
//       "http://localhost:1337/api/auth/local",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           identifier: formData.identifier,
//           password: formData.password,
//         }),
//       }
//     );

//     const result = await response.json();

//     console.log("Login API status:", response.status);

//     if (!response.ok) {
//       throw new Error(
//         result.error?.message || "Login failed"
//       );
//     }

//     if (!result.jwt || !result.user) {
//       throw new Error("JWT token not received from Strapi");
//     }

//     // Save Strapi JWT
//     localStorage.setItem("token", result.jwt);

//     // Save user details
//     localStorage.setItem(
//       "user",
//       JSON.stringify(result.user)
//     );

//     // Notify application
//     window.dispatchEvent(new Event("authChange"));

//     // Navigate after successful login
//     const from = location.state?.from || "/";

//     navigate(from, { replace: true });

//   } catch (err) {
//     console.error("Login error:", err);
//     alert(err.message);
//   }
// };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
//       <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">

//         <div className="mb-6 text-center">
//           <h1 className="text-2xl font-bold text-gray-900">
//             Login
//           </h1>

//           <p className="mt-2 text-sm text-gray-500">
//             Login to your account
//           </p>
//         </div>

//         {error && (
//           <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
//             {error.message}
//           </div>
//         )}

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-5"
//         >
//           <div>
//             <label className="mb-2 block text-sm font-medium text-gray-700">
//               Email / Username
//             </label>

//             <input
//               type="text"
//               name="identifier"
//               value={formData.identifier}
//               onChange={handleChange}
//               placeholder="Enter email or username"
//               className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//             />
//           </div>

//           <div>
//             <label className="mb-2 block text-sm font-medium text-gray-700">
//               Password
//             </label>

//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter password"
//               className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//             />
//           </div>

//           <div className="text-right">
//             <button
//               type="button"
//               onClick={()=>navigate("/forgot-password")}
//               className="text-sm font-medium text-blue-600 hover:text-blue-700"
//             >
//               Forgot Password?
//             </button>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {loading
//               ? "Logging in..."
//               : "Login"}
//           </button>
//         </form>

//         <div className="mt-6 text-center text-sm text-gray-500">
//           Don't have an account?{" "}

//           <button
//             type="button"
//             onClick={() => navigate("/signup")}
//             className="font-semibold text-blue-600 hover:text-blue-700"
//           >
//             Sign Up
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Login;


import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";

const API_URL = "http://localhost:1337";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const identifier = formData.identifier.trim();
    const password = formData.password;

    if (!identifier) {
      setError("Please enter your email or username.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      console.log("Sending login request...");

      const response = await fetch(`${API_URL}/api/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      const result = await response.json();

      console.log("Strapi login status:", response.status);
      console.log("Strapi login response:", result);

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(
            result?.error?.message ||
              "Invalid email/username or password."
          );
        }

        if (response.status === 403) {
          throw new Error(
            result?.error?.message ||
              "This account is not allowed to login."
          );
        }

        if (response.status === 500) {
          throw new Error(
            "Strapi server error. Please check your Strapi terminal."
          );
        }

        throw new Error(
          result?.error?.message || "Login failed."
        );
      }

      if (!result?.jwt || !result?.user) {
        throw new Error(
          "Strapi did not return a valid JWT or user."
        );
      }

      console.log("Login successful:", result.user);

      // Store authentication
      localStorage.setItem("token", result.jwt);
      localStorage.setItem(
        "user",
        JSON.stringify(result.user)
      );

      /*
       * Update login activity.
       * If this endpoint is not ready yet, login will
       * still continue successfully.
       */
      try {
        const activityResponse = await fetch(
          `${API_URL}/api/auth/update-login-status`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${result.jwt}`,
            },
          }
        );

        const activityResult = await activityResponse.json();

        console.log(
          "Login activity status:",
          activityResponse.status
        );

        console.log(
          "Login activity response:",
          activityResult
        );
      } catch (activityError) {
        console.warn(
          "Login activity update failed:",
          activityError
        );
      }

      // Notify Navbar/AuthContext
      window.dispatchEvent(new Event("authChange"));

      /*
       * Redirect user to the page from which they came.
       * Otherwise go to home page.
       */
      const from =
        location.state?.from?.pathname ||
        location.state?.from ||
        "/";

      navigate(from, {
        replace: true,
      });
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <FiLogIn size={26} />
            </div>

            <h1 className="text-2xl font-bold text-gray-800">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Login to continue to your account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Email / Username */}
            <div>
              <label
                htmlFor="identifier"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email or Username
              </label>

              <input
                id="identifier"
                name="identifier"
                type="text"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Enter email or username"
                autoComplete="username"
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
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

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <FiEyeOff size={19} />
                  ) : (
                    <FiEye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Signup */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;