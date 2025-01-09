import React from "react";
import {
  Box,
  FormLabel,
  FormControl,
  Link,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as NavLink } from "react-router-dom";

import useLogin from "./useLogin";

import "./Login.scss";

const Login: React.FC = (): React.ReactNode => {
  const {
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
  } = useLogin();

  return (
    <div className="login-page">
      <Paper
        elevation={3}
        square={false}
        className="login-form-container"
        sx={{
          padding: "clamp(1rem, 5vw, 2rem)",
          width: "clamp(300px, 100%, 600px)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Typography
          component={"h1"}
          variant="h4"
          align="center"
          sx={{ width: "100%" }}
        >
          Sign in to continue
        </Typography>
        <Box
          component="form"
          id="login-form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 3,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              required
              fullWidth
              variant="outlined"
              color={!!emailError ? "error" : "primary"}
            />
          </FormControl>
          <FormControl variant="outlined">
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              name="password"
              placeholder="•••••••••••"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
              color={!!passwordError ? "error" : "primary"}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? "hide the password" : "display the password"}
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </FormControl>
          {!!loginError && (
            <Typography
              variant="caption"
              color="error"
            >
              {loginError}
            </Typography>
          )}
          <LoadingButton
            fullWidth
            type="submit"
            color="primary"
            onClick={validateInputs}
            loading={loading}
            loadingPosition="end"
            endIcon={<i className="fas fa-sign-in-alt" />}
            variant="contained"
          >
            {!loading ? "Let's Dive Back In" : "Logging in..."}
          </LoadingButton>
        </Box>
        <Link
          component={NavLink}
          type="button"
          variant="body2"
          color="primary"
          sx={{ alignSelf: "center" }}
          to={"/reset-password"}
        >
          Forgot your password?
        </Link>
      </Paper>
    </div>
  );
};

export default Login;
