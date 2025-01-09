import React, { useState, useEffect } from "react";

import { login } from "@/services/auth";

const useLogin = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loginError, setLoginError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Login | Soulside";
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
    if (emailError || passwordError) {
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      setLoginError(error?.message || "Invalid Credentials");
    }
    setLoading(false);
  };

  const validateInputs = (): boolean => {
    let isValid = true;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }
    if (!password) {
      setPasswordError("Please enter your password");
      isValid = false;
    } else {
      setPasswordError("");
    }
    setLoginError("");
    return isValid;
  };

  return {
    email,
    setEmail,
    emailError,
    password,
    setPassword,
    passwordError,
    loginError,
    showPassword,
    loading,
    handleClickShowPassword,
    handleMouseDownPassword,
    handleMouseUpPassword,
    handleSubmit,
    validateInputs,
  };
};

export default useLogin;
