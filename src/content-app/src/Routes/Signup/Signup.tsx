import React from "react";
import { Link as NavLink } from "react-router-dom";
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
  Stack,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import useSignup from "./useSignup";

import "./Signup.scss";

const Signup: React.FC = (): React.ReactNode => {
  const {
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
  } = useSignup();

  return (
    <div className="signup-page">
      <Paper
        elevation={3}
        square={false}
        className="signup-form-container"
        sx={{
          padding: "clamp(1rem, 5vw, 2rem)",
          width: "clamp(300px, 100%, 600px)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Stack
          direction="column"
          alignItems={"center"}
          spacing={1}
        >
          <Typography
            component={"h1"}
            variant="h4"
            align="center"
            sx={{ width: "100%" }}
          >
            Welcome to Soulside
          </Typography>
          <Typography
            variant="body2"
            align="center"
          >
            Set a new password to access your dashboard
          </Typography>
        </Stack>
        <Box
          component="form"
          id="signup-form"
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
              disabled={true}
            />
          </FormControl>
          <FormControl variant="outlined">
            <FormLabel htmlFor="password">New Password</FormLabel>
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
          <FormControl variant="outlined">
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <TextField
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              name="confirmPassword"
              placeholder="•••••••••••"
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
              color={!!confirmPasswordError ? "error" : "primary"}
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
          {!!signupError && (
            <Typography
              variant="caption"
              color="error"
            >
              {signupError}
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
            {!loading ? "Register" : "Submitting..."}
          </LoadingButton>
        </Box>
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ alignSelf: "center" }}
        >
          <Typography
            variant="body2"
            align="center"
            sx={{ fontWeight: "semi-bold" }}
          >
            Already have an account?
          </Typography>
          <Link
            component={NavLink}
            type="button"
            variant="body2"
            color="primary"
            sx={{ fontWeight: "semi-bold" }}
            to={"/login"}
          >
            Sign In
          </Link>
        </Stack>
      </Paper>
    </div>
  );
};

export default Signup;
