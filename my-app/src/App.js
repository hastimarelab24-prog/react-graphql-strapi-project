import React, { createContext } from "react";
import Home from "./pages/Home";
import "./App.css";
import Navbar from "./components/Navbar";

import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { BrowserRouter, useLocation, useRoutes } from "react-router-dom";
import routes from "./routes"; 
import Footer from "./components/Footer";
import { OfferProvider } from "./context/OfferContext";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";

// Custom Apollo Context Creation
export const ApolloContext = createContext(null);

const httpLink = createHttpLink({
  uri: "http://localhost:1337/graphql",
});



// const authLink = setContext((_,{headers})=>{
//   const token = localStorage.getItem("token");
//  console.log("apollo token" , token ? "Token Exists" :" No token");
 
//   return {
//     headers:{
//       ...headers,
//       ...(token ? {Authorization : `Bearer ${token}`,} :{}),
//     }
//   }
// })


// // Apollo client 
// const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache(),
// });

const client =new ApolloClient({
    link:httpLink,
    cache:new InMemoryCache()
})
const Routes = () => {
  const elements = useRoutes(routes);
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/checkout" ||
    location.pathname === "/admin";

  return (
    <>
      {!hideLayout && <Navbar />}
      {elements}
      {!hideLayout && <Footer />}
    </>
  );
};

function App() {
  return (
    <ApolloProvider client={client}>
      <ApolloContext.Provider value={client}>
        <OfferProvider>
             <BrowserRouter>
             
          <Routes />
             </BrowserRouter>
        </OfferProvider>
      </ApolloContext.Provider>
      </ApolloProvider>
    
  );
}

export default App;