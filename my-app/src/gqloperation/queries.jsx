import { gql } from "@apollo/client";

export const GET_CATEGORY = gql`
  query GetCategories {
    categories {
      name
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($categoryName: String!) {
    products(filters: { category: { name: { eq: $categoryName } } }) {
      documentId
      name
      price
      stock
      description
      images {
        url
      }
    }
  }
`;
export const SEARCH_PRODUCTS = gql`
  query SearchProducts($search: String!) {
    products(
      filters: { name: { containsi: $search } }
      pagination: { limit: 100 }
    ) {
      documentId
      name
      price
      stock
      description
      images {
        url
      }
    }
  }
`;

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    products(pagination: { limit: 100 }) {
      documentId
      name
      price
      stock
      isDiscountActive
      discountType
      discountValue
      category {
        name
      }
      images {
        url
      }
    }
  }
`;

export const GET_GLOBAL_OFFER = gql`
  query GetGlobalOffer {
    globalOffer {
      name
      isActive
      discountType
      discountValue
    }
  }
`;
