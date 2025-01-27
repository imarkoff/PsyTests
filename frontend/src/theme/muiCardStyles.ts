import {alpha, Components, Theme} from "@mui/material";

const muiCardStyles: Components<Theme> = {
    MuiCard: {
        styleOverrides: {
            root: ({ theme }) => ({
                transition: 'all 100ms ease',
                backgroundColor: 'hsl(220, 35%, 97%)',
                borderRadius: 12,
                boxShadow: 'none',
                ...theme.applyStyles('dark', {
                    backgroundColor: 'hsl(220, 30%, 6%)',
                }),
                variants: [
                    {
                        props: {
                            variant: 'outlined',
                        },
                        style: {
                            boxShadow: 'none',
                            background: 'hsl(0, 0%, 100%)',
                            ...theme.applyStyles('dark', {
                                background: alpha('hsl(220, 35%, 3%)', 0.4),
                            }),
                        },
                    },
                ],
            }),
        },
    }
}
export default muiCardStyles;