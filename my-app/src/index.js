import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // <-- Point to the generated Tailwind CSS file
import App from './App';
import { ApolloProvider } from "@apollo/client/react";
import client from "./App"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <ApolloProvider client={client}>

    <App />
     </ApolloProvider>
  </React.StrictMode>
);