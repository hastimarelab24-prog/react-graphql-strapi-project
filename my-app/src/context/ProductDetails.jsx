// // import React, {
//   createContext,
//   useContext,
// } from "react";

// import useProductDetails from "../hook/useProductDetails";

// // Create Context
// const ProductDetailsContext =
//   createContext(null);

// // Provider
// export const ProductDetailsProvider = ({
//   children,
// }) => {
//   const productDetails =
//     useProductDetails();

//   return (
//     <ProductDetailsContext.Provider
//       value={productDetails}
//     >
//       {children}
//     </ProductDetailsContext.Provider>
//   );
// };

// // Custom Context Hook
// export const useProductDetailsContext = () => {
//   const context = useContext(
//     ProductDetailsContext
//   );

//   if (!context) {
//     throw new Error(
//       "useProductDetailsContext must be used inside ProductDetailsProvider"
//     );
//   }

//   return context;
// };

// export default ProductDetailsContext;