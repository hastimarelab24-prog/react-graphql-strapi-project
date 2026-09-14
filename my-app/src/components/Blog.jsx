import React from "react";

const blogData = [
  {
    id: 1,
    name: "How to Write a Blog Post Your Readers Will Love in 5 Steps",
    Image:
      "https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2023/12/01-24.jpg",
  },
  {
    id: 2,
    name: "9 Content Marketing Trends and Ideas to Increase Traffic",
    Image:
      "https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2023/12/02-49.jpg",
  },
  {
    id: 3,
    name: "The Ultimate Guide to Marketing Strategies to Improve Sales",
    Image:
      "https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2023/12/03-39.jpg",
  },
  {
    id: 4,
    name: "50 Best Sales Questions to Determine Your Customer's Needs",
    Image:
      "https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2023/12/04-37.jpg",
  },
  {
    id: 5,
    name: "6 Simple Ways To Boost Your Ecommerce Conversion Rate",
    Image:
      "https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2023/12/05-28.jpg",
  },
  {
    id: 6,
    name: "9 Customer Experience Trends That'll Define the Next Year",
    Image:
      "https://demos.codezeel.com/wordpress/WCM11/WCM110273/default/wp-content/uploads/2023/12/06-18.jpg",
  },
];

function Blog() {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-yellow-500">
            Latest News
          </p>

          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            From The Blog
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-gray-500">
            Discover useful tips, latest trends and ideas to improve your
            shopping experience.
          </p>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogData.map((blog) => (
            <div
              key={blog.id}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Image */}
              <div className="h-56 overflow-hidden">
                <img
                  src={blog.Image}
                  alt={blog.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-yellow-500">
                  Ecommerce
                </p>

                <h3 className="line-clamp-2 text-xl font-bold leading-7 text-gray-900">
                  {blog.name}
                </h3>

                <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
                  Discover useful tips, strategies and latest ideas to help
                  improve your online shopping experience.
                </p>

                <button
                  type="button"
                  className="mt-5 inline-flex items-center font-semibold text-gray-900 transition hover:text-yellow-500"
                >
                  Read More
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="mt-10 text-center">
          <button
            type="button"
            className="rounded-full bg-gray-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-yellow-400 hover:text-gray-900"
          >
            View All Blogs →
          </button>
        </div>

      </div>
    </section>
  );
}

export default Blog;