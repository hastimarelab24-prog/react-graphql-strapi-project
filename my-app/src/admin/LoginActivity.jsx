import React from 'react'

const LoginActivity = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Login Activity
        </h1>

        <p className="mt-2 text-gray-500">
          Customer login history
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-gray-600">
          Login activity will appear here after the Strapi login
          activity API is configured.
        </p>
      </div>
    </div>
  );
}

export default LoginActivity