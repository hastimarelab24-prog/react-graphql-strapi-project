import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import Card from "./Card";
import {
  GET_ALL_PRODUCTS,
  GET_CATEGORY,
  GET_PRODUCTS_BY_CATEGORY,
} from "../gqloperation/queries";

function Category() {
  // selected category
  const [selectedCategory, setSelectedCategory] = useState("");

  //   get  all category
  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryError,
  } = useQuery(GET_CATEGORY);

  // get products according to selected category
  const {
    data: productsdata,
    loading: productLoading,
    error: productsError,
  } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: {
      categoryName: selectedCategory,
      // category select na hoy tyare query nahi chale
      // Query will run only after category is selected
    },
    skip: !selectedCategory,
  });

  // allproducts
  const {
    data:allProductsData,
    loading:allProductsLoading,
    error:allProductsError,
  }=useQuery(GET_ALL_PRODUCTS,{
    skip:selectedCategory !==""
    
  })

  // category loading
  if (categoryLoading) {
    return <h3>Loading Category...</h3>;
  }
  // categroy error
  if (categoryError) {
    console.log("Category Error:", categoryError);
    return <h3>{categoryError.message}</h3>;
  }
  // categroy data
  const categories = categoryData?.categories || [];
  //   products data
  const products = selectedCategory?
   productsdata?.products || []: allProductsData?.products ||[];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-500 mb-3">
            Explore Collection
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-stone-900">
            Shop by Category
          </h1>

          <p className="mt-3 text-stone-500 max-w-xl mx-auto">
            Discover our latest collection and find the perfect style for you.
          </p>
        </div>
      </section>

      {/* Category Buttons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-3">
          <button
          onClick={()=>setSelectedCategory("")}
            className="px-6 py-3 rounded-full border text-sm sm:text-base font-semibold
             transition-all shadow-sm duration-300"
            
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => {
                console.log("Selected Category:", category.name);
                setSelectedCategory(category.name);
              }}
              className={`
                px-6 py-3 rounded-full border
                text-sm sm:text-base font-semibold
                transition-all duration-300
                shadow-sm
                ${
                  selectedCategory === category.name
                    ? "bg-stone-900 text-white border-stone-900 shadow-lg scale-105"
                    : "bg-white text-stone-700 border-stone-300 hover:bg-stone-900 hover:text-white hover:border-stone-900"
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Selected Category */}
     
       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

  <div className="flex items-center justify-between mb-8 border-b border-stone-200 pb-5">
    <div>
      <p className="text-sm text-stone-500 uppercase tracking-widest">
        Collection
      </p>

      <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mt-1">
        {selectedCategory || "All Products"}
      </h2>
    </div>

    {!productLoading &&
      !allProductsLoading &&
      !productsError &&
      !allProductsError && (
        <span className="text-sm text-stone-500">
          {products.length} Products
        </span>
      )}
  </div>

  {(productLoading || allProductsLoading) && (
    <div className="py-16 text-center">
      <p className="text-stone-500 text-lg animate-pulse">
        Loading Products...
      </p>
    </div>
  )}

  {(productsError || allProductsError) && (
    <div className="rounded-xl bg-red-50 border border-red-200 p-5 text-red-600">
      {(productsError || allProductsError).message}
    </div>
  )}

  {!productLoading &&
    !allProductsLoading &&
    !productsError &&
    !allProductsError && (
      <>
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <p className="text-stone-500 text-lg">
              No products found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const imageUrl = product.images?.[0]?.url || "";

              return (
                <Card
                  key={product.documentId}
                  documentId={product.documentId}
                  name={product.name}
                  price={product.price}
                  imageUrl={imageUrl}
                />
              );
            })}
          </div>
        )}
      </>
    )}
</section>
      

      {/* Before Category Selected */}
      {!selectedCategory && (
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div
            className="
            bg-white
            rounded-2xl
            border
            border-stone-200
            p-12
            text-center
            shadow-sm
          "
          >
            <div className="text-4xl mb-4">✨</div>

            <h2 className="text-xl font-semibold text-stone-800">
              Select a Category
            </h2>

            <p className="text-stone-500 mt-2">
              Choose a category above to explore our products.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Category;
