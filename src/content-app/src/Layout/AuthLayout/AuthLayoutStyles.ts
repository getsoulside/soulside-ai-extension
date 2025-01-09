import { Theme } from "@mui/material";

const AuthLayoutStyles = {
  authLayout: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
    backgroundImage: `radial-gradient(
      circle farthest-corner at 50% 50%,
      var(--soulside-palette-primary-light),
      var(--soulside-palette-primary-main)
    )`,
  },
  authNavBar: {
    marginBottom: "20px",
  },
  soulsideLogo: {
    height: "40px",
    width: "auto",
  },
};

export default AuthLayoutStyles;
