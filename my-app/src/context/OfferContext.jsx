// import { useQuery } from "@apollo/client/react"
// import React,{createContext,useContext} from "react"
// import { GET_GLOBAL_OFFER } from "../gqloperation/queries"

// // create context
// const OfferContext=createContext(null)
// // create provider
// export const OfferProvider=({children})=>{
// const {data,loading,error}=useQuery(GET_GLOBAL_OFFER,{
//     fetchPolicy:"network-only",
// });
// const offer =data?.globalOffer || null;

// console.log("GLOBAL OFFER DATA:",data);
// console.log("GLOBAL OFFER:",offer);
// console.log("GLOBAL OFFER ERROR",error);



// return(
//     <OfferContext.Provider
//     value={{offer,loading,error}}>
//         {children}
//     </OfferContext.Provider>
// )
// }

// export const useOffer=()=>{
//     const context= useContext(OfferContext);

//     if(!context){
//         throw new Error(
//             "userOffer must be used inside offerProvider"
//         )
//     }
//     return context
// }


import React, {
  createContext,
  useContext,
} from "react";

import useGlobalOffer from "../hook/useGlobalOffer";

const OfferContext = createContext(null);

/*
|--------------------------------------------------------------------------
| OFFER PROVIDER
|--------------------------------------------------------------------------
*/
export const OfferProvider = ({ children }) => {
  const {
    offer,
    loading,
    saving,
    error,
    fetchOffer,
    saveOffer,
  } = useGlobalOffer();

  return (
    <OfferContext.Provider
      value={{
        offer,
        loading,
        saving,
        error,
        fetchOffer,
        saveOffer,
      }}
    >
      {children}
    </OfferContext.Provider>
  );
};

/*
|--------------------------------------------------------------------------
| USE OFFER
|--------------------------------------------------------------------------
*/
export const useOffer = () => {
  const context = useContext(OfferContext);

  if (!context) {
    throw new Error(
      "useOffer must be used inside OfferProvider"
    );
  }

  return context;
};