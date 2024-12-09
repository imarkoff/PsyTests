"use client";

import {ReactNode} from "react";
import {Box, SxProps, useTheme} from "@mui/material";

export default function SignInContainer({children}: {children: ReactNode}) {
    const theme = useTheme();

    const boxStyles: SxProps = {
        '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            zIndex: -1,
            inset: 0,
            backgroundImage:
                'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
            backgroundRepeat: 'no-repeat',
            ...theme.applyStyles('dark', {
                backgroundImage:
                    'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
            }),
        },
    }

    return (
        <Box component={"main"} className={"size-full flex items-center justify-center"} sx={boxStyles}>
            {children}
        </Box>
    );
}