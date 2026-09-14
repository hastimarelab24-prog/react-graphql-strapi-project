import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation Login($input: UsersPermissionsLoginInput!) {
    login(input: $input) {
      jwt
      user {
        id
        username
        email
      }
    }
  }
`;

export const SINGUP_USER = gql`
  mutation Register($input: UsersPermissionsRegisterInput!) {
    register(input: $input) {
      jwt
      user {
        email
      }
    }
  }
`;

// Request
export const FORGET_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      ok
    }
  }
`;

// reset password
export const RESET_PASSWORD = gql`
  mutation ResetPassword(
    $password: String!
    $passwordConfirmation: String!
    $code: String!
  ) {
    resetPassword(
      password: $password
      passwordConfirmation: $passwordConfirmation
      code: $code
    ) {
      jwt
      user {
        id
        username
        email
      }
    }
  }
    `;
