import React from 'react';
import Home from './pages/Home';
import './App.css';
import Navbar from './components/Navbar';

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { BrowserRouter,useLocation,useRoutes } from 'react-router-dom';
import routes from './routes'; // Import your routes configuration
import Category from './components/Category';
import Footer from './components/Footer';
const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:1337/graphql',
  }),
  cache: new InMemoryCache(),
});

// Function Router
const Routes=()=>{
 const elements = useRoutes(routes);
 const location=useLocation();

 const hideLayout=location.pathname==="/login" || location.pathname==="/signup";
  return(
    <>

{!hideLayout && <Navbar/>}
      {elements}
      {/* <Category/> */}
{!hideLayout && <Footer/>}
    </>
   
  )
}

function App() {
  return (
    <BrowserRouter>
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;