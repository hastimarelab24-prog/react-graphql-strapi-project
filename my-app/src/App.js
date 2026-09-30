import React from "react";
import Home from "./pages/Home";
import "./App.css";
import Navbar from "./components/Navbar";

import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { BrowserRouter, useLocation, useRoutes } from "react-router-dom";
import routes from "./routes"; // Import your routes configuration
import Category from "./components/Category";
import Footer from "./components/Footer";
import { OfferProvider } from "./context/OfferContext";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "http://localhost:1337/graphql",
});

const authLink = setContext((_, { headers }) => {
  // Strapi Admin Panel -> Settings -> API Tokens માંથી કોપી કરેલો token અહીં મુકો
  // અથવા જો LocalStorage માં user token સ્ટોર હોય તો: localStorage.getItem("token")
  const API_TOKEN = "2c332126c408b8d2a213c7422102e64459a1cbc35ce02d7194a2b1b227a21adef53be813a090ac10556cda36bbf9230e8761a0886bbc7796617889b1426aab037bec29d2709cdb7cb3449a7acdc22ec4ffec3b463cd0085dc4a14935b9c7938621ba96931cac02264ce40240c310b95e9d8d62300121a1355ce84136229a4dfd";

  return {
    headers: {
      ...headers,
      authorization: API_TOKEN ? `Bearer ${API_TOKEN}` : "",
    },
  };
})


const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Function Router
const Routes = () => {
  const elements = useRoutes(routes);
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password" ||
    location.pathname==="/checkout" ||
    location.pathname === "/admin" 
  return (
    <>
      {!hideLayout && <Navbar />}
      {elements}
      {/* <Category/> */}
      {!hideLayout && <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <OfferProvider>

        <Routes />
        </OfferProvider>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;