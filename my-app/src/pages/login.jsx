import React, { useEffect, useState } from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useMutation } from "@apollo/client/react";

import { LOGIN_USER } from "../gqloperation/mutation";


function Login() {

  const navigate = useNavigate();

  const location = useLocation();


  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });


  /*
    Login mutation
  */

  const [
    loginUser,
    {
      loading,
      error,
      data,
    },
  ] = useMutation(LOGIN_USER);


  /*
    Login successful
  */

  useEffect(() => {

    if (!data?.login) {
      return;
    }


    const user = data.login.user;


    /*
      Save JWT token
    */

    localStorage.setItem(
      "token",
      data.login.jwt
    );


    /*
      Save logged-in user
    */

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );


    /*
      Notify application
    */

    window.dispatchEvent(
      new Event("authChange")
    );


    /*
      Redirect after login
    */

    navigate(
      location.state?.from || "/admin",
      {
        replace: true,
      }
    );

  }, [
    data,
    navigate,
    location,
  ]);


  /*
    Login error
  */

  useEffect(() => {

    if (error) {

      console.log(
        "Login Error:",
        error.message
      );

    }

  }, [error]);


  /*
    Input change
  */

  const handleChange = (e) => {

    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });

  };


  /*
    Submit login
  */

  const handleSubmit = async (e) => {

    e.preventDefault();


    /*
      Validate fields
    */

    if (
      !formData.identifier ||
      !formData.password
    ) {

      alert(
        "Please enter email/username and password"
      );

      return;
    }


    try {

      const response =
        await loginUser({
          variables: {
            input: {
              identifier:
                formData.identifier,

              password:
                formData.password,
            },
          },
        });


      console.log(
        "Login Response:",
        response
      );

    } catch (err) {

      console.log(
        "Login Error:",
        err.message
      );

    }

  };


  return (

    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">


        {/* Header */}

        <div className="mb-6 text-center">

          <h1 className="text-2xl font-bold text-gray-900">
            Login
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Login to your account
          </p>

        </div>


        {/* Error */}

        {error && (

          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">

            {error.message}

          </div>

        )}


        {/* Login Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >


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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>


          {/* Forgot Password */}

          <div className="text-right">

            <button
              type="button"
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

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>


        {/* Signup */}

        <div className="mt-6 text-center text-sm text-gray-500">

          Don't have an account?{" "}

          <button
            type="button"
            onClick={() =>
              navigate("/signup")
            }
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