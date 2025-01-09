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

import useResetPassword from "./useResetPassword";

import "./ResetPassword.scss";

const ResetPassword: React.FC = (): React.ReactNode => {
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
  } = useResetPassword();

  return (
    <div className="reset-password-page">
      <Paper
        elevation={3}
        square={false}
        className="reset-password-form-container"
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
            {resetPasswordPage ? "Set a new password" : "Trouble with logging in?"}
          </Typography>
          {!resetPasswordPage && (
            <Typography
              variant="body2"
              align="center"
            >
              Enter your email address and we'll send you a link to get back into your account.
            </Typography>
          )}
        </Stack>
        <Box
          component="form"
          id="reset-password-form"
          onSubmit={resetPasswordPage ? handleResetPassowrd : handleSendResetPassowrdEmail}
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
              disabled={!!resetPasswordPage}
            />
          </FormControl>
          {!!showEmailSent && !resetPasswordPage && (
            <Typography variant="subtitle2">
              We've sent an email to {email} with a link to reset your password.
            </Typography>
          )}
          {!!resetPasswordPage && (
            <>
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
            </>
          )}
          {!!resetPasswordError && (
            <Typography
              variant="caption"
              color="error"
            >
              {resetPasswordError}
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
            {resetPasswordPage
              ? !loading
                ? "Submit"
                : "Submitting..."
              : !loading
              ? "Send Password Reset Link"
              : "Sending..."}
          </LoadingButton>
        </Box>
        <Link
          component={NavLink}
          type="button"
          variant="body2"
          color="primary"
          sx={{ alignSelf: "center" }}
          to={"/login"}
        >
          Back to Login
        </Link>
      </Paper>
    </div>
  );
};

export default ResetPassword;
