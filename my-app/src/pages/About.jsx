import React from "react";


function About() {
  return (
    <div className="bg-white text-gray-800 mt-16">
      {/* Hero Section */}

      {/* <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 mb-3">
            Welcome to Our Store
          </p>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            About Us
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-lg text-gray-600 leading-8">
            Discover fashion that reflects your personality, style, and
            confidence.
          </p>
        </div>
      </section> */}

      <div className="bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1500px]">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-yellow-500">
            Welcome To our Store
          </p>

          <h1 className="text-4xl font-bold text-gray-900">About Us</h1>

          <p className="mt-2 text-gray-500">Discover our latest products</p>
        </div>
      </div>

      {/* About Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80"
              alt="Our store"
              className="w-full h-[450px] object-cover rounded-2xl shadow-lg"
            />
          </div>

          {/* Text */}
          <div>
            <p className="text-yellow-500 font-semibold uppercase tracking-widest mb-3">
              Who We Are
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Fashion Made For You
            </h2>

            <p className="text-gray-600 leading-7 mb-5">
              We believe fashion is more than just clothing. It is a way to
              express who you are, what you love, and how you feel.
            </p>

            <p className="text-gray-600 leading-7 mb-5">
              Our goal is to bring you stylish, comfortable, and high-quality
              products that fit effortlessly into your everyday lifestyle.
            </p>

            <p className="text-gray-600 leading-7">
              From timeless classics to modern trends, we carefully select
              products that help you look and feel your best.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-yellow-500 font-semibold uppercase tracking-widest mb-3">
            Our Mission
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Style. Quality. Confidence.
          </h2>

          <p className="text-gray-600 leading-8 max-w-3xl mx-auto">
            Our mission is to make fashion accessible, inspiring, and enjoyable.
            We are committed to offering quality products, excellent service,
            and a shopping experience our customers can trust.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-3">Quality Products</h3>
              <p className="text-gray-600">
                Carefully selected products with quality and style in mind.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-bold mb-3">Customer First</h3>
              <p className="text-gray-600">
                Your satisfaction is at the heart of everything we do.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-3">Modern Style</h3>
              <p className="text-gray-600">
                We bring you fresh and modern styles for every occasion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gray-900 py-16 text-center text-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Find Your Perfect Style
          </h2>

          <p className="text-gray-300 mb-8">
            Explore our collection and discover something made for you.
          </p>

          <button
          
            className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full
                       font-semibold hover:bg-yellow-300 transition"
          >
            Shop Now
          </button>
        </div>
      </section>
    </div>
  );
}

export default About;
