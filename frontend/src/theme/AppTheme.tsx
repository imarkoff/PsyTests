"use client";

import {ReactNode} from "react";
import {createTheme, ThemeProvider} from "@mui/material";
import muiCardStyles from "./muiCardStyles";
import muiMenuStyles from "@/theme/muiMenuStyles";

/**
 * AppTheme component that provides a custom Material-UI theme to its children.
 *
 * @param {Object} props
 * @param {ReactNode} props.children - The child components to be wrapped by the theme provider.
 * @returns The ThemeProvider component wrapping the children with the custom theme.
 */
export default function AppTheme({children}: {children: ReactNode}) {
    const theme = createTheme({
        colorSchemes: {
            dark: true
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        textTransform: "none",
                        boxShadow: "none",
                        fontWeight: "bold"
                    }
                }
            },
            MuiToggleButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 6
                    }
                }
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                    }
                }
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        borderRadius: 10
                    }
                }
            },
            ...muiCardStyles,
            ...muiMenuStyles
        }
    });

    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
}