"use client";

import {ReactNode} from "react";
import {createTheme, ThemeProvider} from "@mui/material";
import muiCardStyles from "./muiCardStyles";
import muiMenuStyles from "@/theme/muiMenuStyles";
import {ukUA as ukUADataGrid} from "@mui/x-data-grid/locales";
import {ukUA as ukUADatePicker} from "@mui/x-date-pickers/locales";
import {ukUA as coreUkUA} from "@mui/material/locale";
import muiDialogStyles from "@/theme/muiDialogStyles";

/**
 * AppTheme component that provides a custom Material-UI theme to its children.
 *
 * @param {Object} props
 * @param {ReactNode} props.children - The child components to be wrapped by the theme provider.
 * @returns The ThemeProvider component wrapping the children with the custom theme.
 */
export default function AppTheme({children}: { children: ReactNode }) {
    const theme = createTheme(
        {
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
                ...muiCardStyles,
                ...muiMenuStyles,
                ...muiDialogStyles
            }
        },
        coreUkUA,
        ukUADatePicker,
        ukUADataGrid
    );

    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
}