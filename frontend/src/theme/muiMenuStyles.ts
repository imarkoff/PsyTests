import {Components, Theme} from "@mui/material";

const muiMenuStyles: Components<Theme> = {
    MuiMenu: {
        styleOverrides: {
            paper: {
                boxShadow: "0 0 15px rgba(0,0,0,0.2)",
                borderRadius: 8,
            },
        },
    },
    MuiMenuItem: {
        styleOverrides: {
            root: {
                padding: '8px 16px',
                "&.Mui-selected": {
                    fontWeight: 600
                },
            },
        },
    }
}

export default muiMenuStyles;