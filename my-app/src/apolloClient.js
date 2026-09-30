import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: "http://localhost:1337/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");

  console.log("Apollo Token:", token ? "Token exists" : "Token missing");

  return {
    headers: {
      ...headers,
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;