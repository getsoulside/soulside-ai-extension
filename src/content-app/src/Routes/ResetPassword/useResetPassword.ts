import React, { useState, useEffect } from "react";

import { sendResetPasswordEmail, resetPassword } from "@/services/auth";

const useResetPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [token, setToken] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [resetPasswordError, setResetPasswordError] = useState("");

  const [showEmailSent, setShowEmailSent] = useState(false);
  const [resetPasswordPage, setResetPasswordPage] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlEmail = urlParams.get("email");
    const urlToken = urlParams.get("token");
    if (urlEmail) {
      setEmail(urlEmail);
    }
    if (urlToken) {
      setToken(urlToken);
    }
    if (urlEmail && urlToken) {
      setResetPasswordPage(true);
    }
  }, []);

  const handleClickShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSendResetPassowrdEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowEmailSent(false);
    if (emailError) {
      return;
    }
    setLoading(true);
    try {
      await sendResetPasswordEmail(email);
      setResetPasswordError("");
      setShowEmailSent(true);
    } catch (error: any) {
      setResetPasswordError(error?.message || "User not found");
    }
    setLoading(false);
  };

  const handleResetPassowrd = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (emailError || passwordError || confirmPasswordError || !token) {
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email, password, token);
      setResetPasswordError("");
    } catch (error: any) {
      setResetPasswordError(
        error?.message || "Invalid URL, please check the reset password link from the email"
      );
    }
    setLoading(false);
  };

  const validateInputs = (): boolean => {
    let isValid = true;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }
    if (resetPasswordPage) {
      if (!password) {
        setPasswordError("Please enter your password.");
        isValid = false;
      } else {
        setPasswordError("");
      }
      if (!confirmPassword || confirmPassword !== password) {
        setConfirmPasswordError("Password doesn't match");
        isValid = false;
      } else {
        setConfirmPasswordError("");
      }
    }
    setShowEmailSent(false);
    setResetPasswordError("");
    return isValid;
  };

  return {
    email,
    setEmail,
    emailError,
    password,
    setPassword,
    passwordError,
    confirmPassword,
    setConfirmPassword,
    confirmPasswordError,
    resetPasswordError,
    showPassword,
    showEmailSent,
    loading,
    resetPasswordPage,
    handleClickShowPassword,
    handleMouseDownPassword,
    handleMouseUpPassword,
    validateInputs,
    handleSendResetPassowrdEmail,
    handleResetPassowrd,
  };
};

export default useResetPassword;
