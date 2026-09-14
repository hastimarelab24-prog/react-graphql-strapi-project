import { useMutation } from "@apollo/client/react";
import React from "react";
import {
  FORGET_PASSWORD,
  LOGIN_USER,
  RESET_PASSWORD,
} from "../gqloperation/mutation";
import { data } from "react-router-dom";

export default function useAuthActions() {
  const [loginUserMutation, { loading: loginLoading, error: loginError }] =
    useMutation(LOGIN_USER);

  const [forgotPassword, { loading: forgotLoading, error: forgotError }] =
    useMutation(FORGET_PASSWORD);
  const [resetPassword, { loading: resetLoading, error: resetError }] =
    useMutation(RESET_PASSWORD);

  const login = async (identifier, password) => {
    try {
      const res = await loginUserMutation({
        variables: { input:{identifier,password }},
      });
      if (res.data?.resetPassword?.jwt) {
        localStorage.setItem("token", res.data.login.jwt);
        window.dispatchEvent(new Event("authChange"));
        return { success: true, data: res.data };
      }
      return { success: false, error: "Authentication failed" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // send Email request function
  const requestPasswordReset = async (email) => {
    try {
      const response = await forgotPassword({ variables: { email } });
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  //   reset Password Function
  const confirmPasswordReset = async (password, passwordConfirmation, code) => {
    try {
      const response = await resetPassword({
        variables: { password, passwordConfirmation, code },
      });
      if(res.data?.resetPassword?.jwt){
        localStorage.setItem("token",res.data.resetPassword.jwt);
        window.dispatchEvent(new Event("authChange"));
        return{success:true,data:res.data}
      }
      return { success: true, error:"Password Reset failed"};
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  return {
    requestPasswordReset,
    confirmPasswordReset,
    loading: forgotLoading || resetLoading || loginLoading,
    error: forgotError?.message || resetError?.message || loginError?.message,
  };
}
