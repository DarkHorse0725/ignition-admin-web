import { CSSProperties } from "react";
import { createTheme } from "@mui/material";
import { ColorPartial } from "@mui/material/styles/createPalette";

declare module "@mui/material/styles" {
  interface Palette {
    pink: ColorPartial;
    blue: ColorPartial;
    border: {
      light: string;
    };
  }
  interface Theme {
    palette: Palette;
  }
  // allow configuration using `createTheme`
  interface PaletteOptions {
    pink: ColorPartial;
    blue: ColorPartial;
    border: {
      light: string;
    };
  }

  interface TypographyVariants {
    body3: CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    body3?: CSSProperties;
  }

}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    body3: true;
  }
}

let theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#909BF9",
      dark: "#707BC2", // for read notifications (a darker shade of the main color (blue))
    },
    secondary: {
      main: "#edf2ff",
    },
    background: {
      default: "#1D2736",
      paper: "#0D1324",
    },
    success: {
      main: "#1BC84C",
      dark: "#2C9607",
      light: "#dcf2e2",
    },
    warning: {
      main: "#DEA432",
      dark: "#E46C39",
      light: "#f9ebbb",
    },
    error: {
      main: "#F00E0E",
      light: "#f5dada",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#AEB3C1",
      disabled: "#9b9b9b",
    },
    grey: {
      200: "#676F8B",
      300: "#3E496B", // border color of the input
      400: "#2A3547", // background color of the input
      500: "#C3C7D5",
      600: "#2F3C4F",
      700: "#1e2a3c", //background of table's header
      800: "#767A85", // color for table's header
      900: "#8A8F97", // search icon
    },
    blue: {
      100: "#D0DCFF",
      200: "#3B56A91A",
      300: "#3856B0",
      400: "#2D437A",
    },
    pink: {
      100: "#D9215A",
    },
    action: {
      disabledBackground: "#A6ABB9",
    },
    common: {
      white: "#ffffff",
      black: "#000000",
    },
    border: {
      light: "#3F434F",
    },
  },
});

theme = createTheme(theme, {
  typography: {
    fontFamily: ["Arial", "sans-serif"].join(","),
    h1: {
      fontSize: 30,
      fontWeight: 600,
      color: theme.palette,
    },
    // page title
    h4: {
      fontSize: 16,
      fontWeight: 700,
      color: theme.palette.text.primary,
      lineHeight: "24px",
    },
    h5: {
      fontSize: 16,
      fontWeight: 500,
      color: theme.palette.text.primary,
    },
    h6: {
      fontSize: 14,
      fontWeight: 500,
      color: theme.palette.text.primary,
    },
    body1: {
      fontSize: 12,
      fontWeight: 400,
      color: theme.palette.text.primary,
    },
    body2: {
      fontSize: 11,
      fontWeight: 400,
    },
    body3: {
      fontSize: 14,
      fontWeight: 700,
      color: theme.palette.text.primary,
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          body3: "p",
        }
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#DFDFDF",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: theme.palette.background.default,
            opacity: 0.5,
            width: "6px",
            height: "6px",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: "5px",
            backgroundColor: "#959595",
            minHeight: 24,
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
          {
            backgroundColor: "#DFDFDF",
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
          {
            backgroundColor: "#DFDFDF",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
          {
            backgroundColor: "#DFDFDF",
          },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: theme.palette.background.default,
            opacity: 0.5,
          },
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { color: "primary" },
          style: {
            background:
              "radial-gradient(611.25% 7721.22% at 107.75% -385%, rgba(20, 49, 126, 0.83) 0%, rgba(12, 59, 226, 0.72) 100%)",
            color: theme.palette.text.primary,
            fontWeight: 700,
            fontSize: 12,
            textTransform: "none",
            "&:disabled": {
              background: theme.palette.action.disabledBackground,
              color: theme.palette.text.primary,
            },
          },
        },
        {
          props: { color: "secondary" },
          style: {
            padding: "5px 20px",
            backgroundColor: theme.palette.grey[400],
            color: theme.palette.text.primary,
            borderRadius: "5px",
            textTransform: "capitalize",
            border: `1px solid ${theme.palette.primary.main}`,
            "&:disabled": {
              background: theme.palette.action.disabledBackground,
              color: theme.palette.text.primary,
            },
          },
        },
        {
          props: { color: "warning" },
          style: {
            padding: "5px 20px",
            backgroundColor: "rgba(228, 108, 57, 0.1)",
            border: "1px solid #E46C39",
            textTransform: "capitalize",
            color: theme.palette.common.white,
            "&:disabled": {
              background: theme.palette.action.disabledBackground,
              color: theme.palette.text.primary,
            },
          },
        },
      ],
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.grey[800],
        },
        arrow: {
          "&:before": {
            backgroundColor: theme.palette.grey[800],
          },
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: ({ ownerState, theme }: any) => ({
          "&.Mui-active": {
            // color: theme.palette.primary.main,
            color: theme.palette.blue[100],
          },
        }),
      },
    },
  },
});

export default theme;
