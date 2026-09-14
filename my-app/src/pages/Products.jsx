import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

// GraphQL query targeting Strapi documentId 
const GET_PRODUCT_BY_DOCUMENT_ID = gql`
  query GetProductByDocumentId($documentId: ID!) {
    product(documentId: $documentId) {
      documentId
      name
      price
      description
      images {
        url
      }
    }
  }
`;

function Products() {
const[selectedImage,setSelectedImage]=useState(0);

  // Make sure your route definition uses the exact same parameter name, e.g., <Route path="/product/:pid" element={<Products />} />
  const { pid } = useParams();

  // Query is skipped completely if pid is undefined or null
  const { loading, error, data } = useQuery(GET_PRODUCT_BY_DOCUMENT_ID, {
    variables: { documentId: pid },
    skip: !pid,
  });
// const {name, price, images} = data.product.data.attributes;
// console.log(images)
  // 1. Guard against missing route parameter in the URL
  if (!pid) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-white">
        <div className="bg-gray-800 border border-yellow-500 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-400 mb-2">No Product Parameter Found</h2>
          <p className="text-gray-300">
              Products Id is missing from URL.

          </p>
          <p className='mt-2 text-gray-300'>
            Example:
          </p>
            <code className="bg-gray-900 px-2 py-1 rounded text-yellow-300 font-mono">/path/:pid</code> in your router setup.
        </div>
      </div>
    );
  }

  // 2. Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-white text-center">
        <div className="animate-pulse flex flex-col items-center justify-center p-12 bg-gray-800 rounded-lg">
          <p className="text-lg font-medium text-gray-300">Loading product details...</p>
        </div>
      </div>
    );
  }

  // 3. GraphQL Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-white">
        <div className="bg-red-950 border border-red-500 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-400 mb-2">GraphQL Fetch Error</h2>
          <p className="text-red-200 font-mono text-sm bg-red-900/50 p-3 rounded">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  // Get product
  const product = data?.product;

  // 4. Product null state (ID sent, but no record returned by GraphQL backend)
  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-white">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-400 mb-2">Product Not Found</h2>
          <p className="text-gray-400">
            No record returned for documentId:
            <code className="bg-gray-900 px-2 py-1 rounded text-yellow-300 font-mono">{pid}</code>
          </p>
        </div>
      </div>
    );
  }

  // description format fix
  const getDescriptionText=(description)=>{
    // if description is empty
    if(!description){
      return "No description Avalible";
    }

    // if description is normal string 
    if(typeof description==="string"){
      return description;
    }

    // if strapi returns array/blocks
    if(Array.isArray(description)){
      return description.map((block)=>{
        if(!block?.children){
          return "";
        }
        // return block.children.map((child)=>child?.text|| "".join(""))
      })
      .filter(Boolean).join("/n")
    }
    // if something else comes from API
    return " ";
  }


  // imatge URl

  // Formatting local vs remote Strapi media URLs
  // const imageUrl = product.images?.[0]?.url;
  // const fullImageUrl = imageUrl?.startsWith('/')
  //   ? `http://localhost:1337${imageUrl}`
  //   : imageUrl;


const productImages = product.images || [];
const getImageUrl=(url)=>{
  if(!url) return "";
  return url.startsWith("http") ? url : `http://localhost:1337${url}`
}

const currentImage=productImages[selectedImage]?.url;
const fullImageUrl=getImageUrl(currentImage);


    // addto cart method 
    const addtocart=()=>{
      // get old cart from localstorage
      const oldCart=JSON.parse(localStorage.getItem("cart")) || [];
      // check product already exists
      const productExist =oldCart.find(
        (item)=>item.documentId===product.documentId
      );
      if(productExist){
        alert("Products already added to cart")
        return;
      }

      // create cart product
      const newProducts={
        documentId:product.documentId,
        name:product.name,
        price:product.price,
        image:fullImageUrl,
        qty:1,
      }
      // add products
      oldCart.push(newProducts);

      // save upadate cart
      localStorage.setItem("cart",JSON.stringify(oldCart));
      alert("Products Added to cart")
    }
  return (

  <div className="min-h-screen bg-stone-100 px-4 py-8 sm:px-6 lg:px-8">

    <div className="mx-auto max-w-6xl">

      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-stone-500">
        Home
        <span className="mx-2">/</span>
        Products
        <span className="mx-2">/</span>
        <span className="font-medium text-stone-800">
          {product.name}
        </span>
      </div>

      {/* Product Card */}
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white p-5 shadow-lg sm:p-8">

        <div className="flex flex-col gap-8 md:flex-row">

          {/* Product Image */}
          <div className="w-full md:w-1/2">
          {/* main image */}
            <div className="overflow-hidden rounded-2xl bg-stone-100">

              {fullImageUrl ? (
                <img
                  src={fullImageUrl}
                  alt={product.name || "Product Image"}
                  className="
                    h-[350px]
                    w-full
                    object-cover
                    transition-transform
                    duration-500
                    hover:scale-105
                    sm:h-[450px]
                  "
                />
              ) : (
                <div className="flex h-[350px] items-center justify-center text-stone-400 sm:h-[450px]">
                  No image available
                </div>
              )}

            </div>

            {/* thiumbanils image */}
            {productImages.length> 1 &&(
              <div>
                {
                  productImages.map((image,index)=>{
                    const thumbnailUrl=getImageUrl(image.url);
                    return(
                      <button key={index} type='button' onClick={()=>setSelectedImage(index)}
                      className={` h-20 w-20 flex-shrink-0 overflow-hidden mx-3 rounded-xl border-2 bg-stone-100 transition-all 
                        ${selectedImage===index?"border-indigo-600 ring-2 ring-indigo-200":"border-stone-200"}`}>
                          <img src={thumbnailUrl} alt={`${product.name} ${index+1}`} srcset=""  className='h-full w-full object-contain'/>
                      </button>
                    )
                  })
                }
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex w-full flex-col md:w-1/2">

            {/* Badge */}
            <span className="mb-4 w-fit rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">
              New Product
            </span>

            {/* Name */}
            <h1 className="text-3xl font-bold leading-tight text-stone-800 sm:text-4xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-5">
              <p className="text-sm text-stone-500">
                Price
              </p>

              <p className="mt-1 text-3xl font-bold text-indigo-600">
                ${product.price ?? 0}
              </p>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-stone-200" />

            {/* Details */}
            <div>
              <h2 className="text-lg font-semibold text-stone-800">
                Product Details
              </h2>

              <p className="mt-3 leading-7 text-stone-500">
              {getDescriptionText(product.description)}
              </p>
            </div>

            {/* Product ID */}
            <div className="mt-6 rounded-xl bg-stone-50 p-4">
              <p className="text-sm text-stone-500">
                Product ID
              </p>

              <p className="mt-1 break-all font-mono text-sm text-stone-700">
                {product.documentId}
              </p>
            </div>

            {/* Add To Cart */}
            <button
              onClick={addtocart}
              className=" mt-8 w-full rounded-xl bg-indigo-600 px-6 py-4 font-semibold text-white shadow-md transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95
              "
            >
              Add to Cart
            </button>

            {/* Features */}
            <div className="mt-5 grid grid-cols-2 gap-4">

              <div className="rounded-xl bg-stone-50 p-4 text-center">
                <p className="font-semibold text-stone-700">
                  Secure
                </p>
                <p className="mt-1 text-xs text-stone-400">
                  Safe Shopping
                </p>
              </div>

              <div className="rounded-xl bg-stone-50 p-4 text-center">
                <p className="font-semibold text-stone-700">
                  Quality
                </p>
                <p className="mt-1 text-xs text-stone-400">
                  Premium Product
                </p>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
);

}

export default Products;