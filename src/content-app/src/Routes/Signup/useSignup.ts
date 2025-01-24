import React, { useState, useEffect } from "react";

import { signup } from "@/services/auth";

const useSignup = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [token, setToken] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [signupError, setSignupError] = useState("");

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (emailError || passwordError || confirmPasswordError || !token) {
      return;
    }
    setLoading(true);
    try {
      await signup(email, password, token);
      setSignupError("");
    } catch (error: any) {
      setSignupError(
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
    setSignupError("");
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
    signupError,
    showPassword,
    loading,
    handleClickShowPassword,
    handleMouseDownPassword,
    handleMouseUpPassword,
    validateInputs,
    handleSubmit,
  };
};

export default useSignup;
