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
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:1337";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Login with Strapi REST API
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.identifier.trim() || !formData.password) {
      setError("Please enter email/username and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/local`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: formData.identifier.trim(),
            password: formData.password,
          }),
        }
      );

      const result = await response.json();

      console.log("Strapi login status:", response.status);

      if (!response.ok) {
        throw new Error(
          result?.error?.message || "Login failed."
        );
      }

      if (!result.jwt || !result.user) {
        throw new Error("Strapi did not return a valid JWT.");
      }

      // Save Strapi Users & Permissions JWT
      localStorage.setItem("token", result.jwt);

      // Save logged-in user
      localStorage.setItem(
        "user",
        JSON.stringify(result.user)
      );

      // Notify other components about login
      window.dispatchEvent(new Event("authChange"));

      // Navigate to previous page or home
      const from = location.state?.from || "/";

      navigate(from, {
        replace: true,
      });

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">

        {/* Heading */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Login
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Login to your account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email / Username */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email / Username
            </label>

            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Enter email or username"
              autoComplete="username"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Signup */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}

          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign Up
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;