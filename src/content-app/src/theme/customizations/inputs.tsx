import { alpha, Theme, Components } from "@mui/material/styles";
import { outlinedInputClasses, toggleButtonGroupClasses, toggleButtonClasses } from "@mui/material";
import { CheckBoxOutlineBlankRounded, CheckRounded, RemoveRounded } from "@mui/icons-material";
import { brand } from "../themePrimitives";

/* eslint-disable import/prefer-default-export */
export const inputsCustomizations: Components<Theme> = {
  MuiButtonBase: {
    defaultProps: {
      disableTouchRipple: true,
      disableRipple: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        boxSizing: "border-box",
        transition: "all 100ms ease-in",
        "&:focus-visible": {
          outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
          outlineOffset: "2px",
        },
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: "none",
        borderRadius: theme.shape.borderRadius,
        textTransform: "none",
        fontSize: "0.875rem",
        variants: [
          {
            props: {
              size: "small",
            },
            style: {
              height: "2.25rem",
              padding: "8px 12px",
            },
          },
          {
            props: {
              size: "medium",
            },
            style: {
              height: "2.5rem", // 40px
            },
          },
          {
            props: {
              color: "primary",
              variant: "contained",
            },
            style: {
              color: "white",
              backgroundColor: theme.palette.primary.main,
              backgroundImage: `linear-gradient(to bottom, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
              "&:hover": {
                backgroundImage: "none",
                backgroundColor: theme.palette.primary.main,
              },
              "&:active": {
                backgroundColor: theme.palette.primary.main,
              },
              "&:disabled": {
                color: theme.palette.grey[500],
                backgroundColor: theme.palette.grey[300],
                backgroundImage: "none",
              },
              ...theme.applyStyles("dark", {
                color: "black",
                backgroundColor: theme.palette.grey[50],
                backgroundImage: `linear-gradient(to bottom, ${theme.palette.grey[100]}, ${theme.palette.grey[50]})`,
                boxShadow: "inset 0 -1px 0  hsl(220, 30%, 80%)",
                border: `1px solid ${theme.palette.grey[50]}`,
                "&:hover": {
                  backgroundImage: "none",
                  backgroundColor: theme.palette.grey[300],
                  boxShadow: "none",
                },
                "&:active": {
                  backgroundColor: theme.palette.grey[400],
                },
              }),
            },
          },
          {
            props: {
              color: "secondary",
              variant: "contained",
            },
            style: {
              color: "white",
              backgroundColor: brand[300],
              backgroundImage: `linear-gradient(to bottom, ${alpha(brand[400], 0.8)}, ${
                brand[500]
              })`,
              boxShadow: `inset 0 2px 0 ${alpha(brand[200], 0.2)}, inset 0 -2px 0 ${alpha(
                brand[700],
                0.4
              )}`,
              border: `1px solid ${brand[500]}`,
              "&:hover": {
                backgroundColor: brand[700],
                boxShadow: "none",
              },
              "&:active": {
                backgroundColor: brand[700],
                backgroundImage: "none",
              },
            },
          },
          {
            props: {
              variant: "outlined",
            },
            style: {
              color: theme.palette.text.primary,
              border: "1px solid",
              borderColor: theme.palette.grey[200],
              backgroundColor: alpha(theme.palette.grey[50], 0.3),
              "&:hover": {
                backgroundColor: theme.palette.grey[100],
                borderColor: theme.palette.grey[300],
              },
              "&:active": {
                backgroundColor: theme.palette.grey[200],
              },
              ...theme.applyStyles("dark", {
                backgroundColor: theme.palette.grey[800],
                borderColor: theme.palette.grey[700],

                "&:hover": {
                  backgroundColor: theme.palette.grey[900],
                  borderColor: theme.palette.grey[600],
                },
                "&:active": {
                  backgroundColor: theme.palette.grey[900],
                },
              }),
            },
          },
          {
            props: {
              color: "secondary",
              variant: "outlined",
            },
            style: {
              color: brand[700],
              border: "1px solid",
              borderColor: brand[200],
              backgroundColor: brand[50],
              "&:hover": {
                backgroundColor: brand[100],
                borderColor: brand[400],
              },
              "&:active": {
                backgroundColor: alpha(brand[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: brand[50],
                border: "1px solid",
                borderColor: brand[900],
                backgroundColor: alpha(brand[900], 0.3),
                "&:hover": {
                  borderColor: brand[700],
                  backgroundColor: alpha(brand[900], 0.6),
                },
                "&:active": {
                  backgroundColor: alpha(brand[900], 0.5),
                },
              }),
            },
          },
          {
            props: {
              variant: "text",
            },
            style: {
              color: theme.palette.grey[600],
              "&:hover": {
                backgroundColor: theme.palette.grey[100],
              },
              "&:active": {
                backgroundColor: theme.palette.grey[200],
              },
              ...theme.applyStyles("dark", {
                color: theme.palette.grey[50],
                "&:hover": {
                  backgroundColor: theme.palette.grey[700],
                },
                "&:active": {
                  backgroundColor: alpha(theme.palette.grey[700], 0.7),
                },
              }),
            },
          },
          {
            props: {
              color: "secondary",
              variant: "text",
            },
            style: {
              color: brand[700],
              "&:hover": {
                backgroundColor: alpha(brand[100], 0.5),
              },
              "&:active": {
                backgroundColor: alpha(brand[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: brand[100],
                "&:hover": {
                  backgroundColor: alpha(brand[900], 0.5),
                },
                "&:active": {
                  backgroundColor: alpha(brand[900], 0.3),
                },
              }),
            },
          },
        ],
      }),
    },
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: "10px",
        boxShadow: `0 4px 16px ${alpha(theme.palette.grey[400], 0.2)}`,
        [`& .${toggleButtonGroupClasses.selected}`]: {
          color: brand[500],
        },
        ...theme.applyStyles("dark", {
          [`& .${toggleButtonGroupClasses.selected}`]: {
            color: "#fff",
          },
          boxShadow: `0 4px 16px ${alpha(brand[700], 0.5)}`,
        }),
      }),
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: "12px 16px",
        textTransform: "none",
        borderRadius: "10px",
        fontWeight: 500,
        ...theme.applyStyles("dark", {
          color: theme.palette.grey[400],
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
          [`&.${toggleButtonClasses.selected}`]: {
            color: brand[300],
          },
        }),
      }),
    },
  },
  MuiCheckbox: {
    defaultProps: {
      disableRipple: true,
      icon: <CheckBoxOutlineBlankRounded sx={{ color: "hsla(210, 0%, 0%, 0.0)" }} />,
      checkedIcon: <CheckRounded sx={{ height: 14, width: 14 }} />,
      indeterminateIcon: <RemoveRounded sx={{ height: 14, width: 14 }} />,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        margin: 10,
        height: 16,
        width: 16,
        borderRadius: 5,
        border: "1px solid ",
        borderColor: alpha(theme.palette.grey[300], 0.8),
        boxShadow: "0 0 0 1.5px hsla(210, 0%, 0%, 0.04) inset",
        backgroundColor: alpha(theme.palette.grey[100], 0.4),
        transition: "border-color, background-color, 120ms ease-in",
        "&:hover": {
          borderColor: brand[300],
        },
        "&.Mui-focusVisible": {
          outline: `3px solid ${alpha(brand[500], 0.5)}`,
          outlineOffset: "2px",
          borderColor: brand[400],
        },
        "&.Mui-checked": {
          color: "white",
          backgroundColor: brand[500],
          borderColor: brand[500],
          boxShadow: `none`,
          "&:hover": {
            backgroundColor: brand[600],
          },
        },
        ...theme.applyStyles("dark", {
          borderColor: alpha(theme.palette.grey[700], 0.8),
          boxShadow: "0 0 0 1.5px hsl(210, 0%, 0%) inset",
          backgroundColor: alpha(theme.palette.grey[900], 0.8),
          "&:hover": {
            borderColor: brand[300],
          },
          "&.Mui-focusVisible": {
            borderColor: brand[400],
            outline: `3px solid ${alpha(brand[500], 0.5)}`,
            outlineOffset: "2px",
          },
        }),
      }),
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        border: "none",
        fontSize: "0.875rem",
      },
      input: ({ theme }) => ({
        "&::placeholder": {
          opacity: 0.7,
          color: theme.palette.grey[500],
        },
        "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active":
          {
            transition: "background-color 5000s ease-in-out 0s",
            WebkitTextFillColor: "unset !important",
            textFillColor: "unset !important",
            WebkitBoxShadow: "unset !important",
            boxShadow: "unset !important",
            caretColor: "unset !important",
          },
      }),
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      input: ({ theme }) => ({
        padding: "8px 12px",
        [`&.${outlinedInputClasses.inputAdornedStart}`]: {
          paddingLeft: 0,
        },
        [`&.${outlinedInputClasses.inputAdornedEnd}`]: {
          paddingRight: 0,
        },
      }),
      root: ({ theme }) => ({
        color: theme.palette.text.primary,
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
        backgroundColor: theme.palette.background.default,
        transition: "border 120ms ease-in",
        "&:hover": {
          borderColor: theme.palette.grey[400],
        },
        [`&.${outlinedInputClasses.focused}`]: {
          outline: `1.5px solid ${alpha(theme.palette.primary.main, 0.5)}`,
          borderColor: theme.palette.primary.main,
        },
        ...theme.applyStyles("dark", {
          "&:hover": {
            borderColor: theme.palette.grey[500],
          },
        }),
        variants: [
          {
            props: {
              size: "small",
            },
            style: {
              height: "2.25rem",
            },
          },
          {
            props: {
              size: "medium",
            },
            style: {
              height: "2.5rem",
            },
          },
        ],
      }),
      notchedOutline: {
        border: "none",
      },
    },
  },
  MuiInputAdornment: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.grey[500],
        ...theme.applyStyles("dark", {
          color: theme.palette.grey[400],
        }),
      }),
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        typography: theme.typography.caption,
        marginBottom: 8,
      }),
    },
  },
  MuiFormControl: {
    styleOverrides: {
      root: ({ theme }) => ({
        [`& textarea`]: {
          padding: "8px 12px",
          color: theme.palette.text.primary,
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
          backgroundColor: theme.palette.background.default,
          transition: "border 120ms ease-in",
          fontFamily: theme.typography.fontFamily,
          lineHeight: theme.typography.body1.lineHeight,
          minWidth: "100%",
          overflow: "auto !important",
          "&:hover": {
            borderColor: theme.palette.grey[400],
          },
          "&:focus": {
            outline: `1.5px solid ${alpha(theme.palette.primary.main, 0.5)}`,
            borderColor: theme.palette.primary.main,
          },
          "&::placeholder": {
            opacity: 0.7,
            color: theme.palette.grey[500],
          },
        },
      }),
    },
  },
};
