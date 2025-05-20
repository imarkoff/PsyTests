import type { Metadata } from "next";
import AppTheme from "@/theme/AppTheme";
import {ReactNode} from "react";
import {Box, CssBaseline} from "@mui/material";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v15-appRouter";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/600.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/800.css';
import '@fontsource/roboto/900.css';

export const metadata: Metadata = {
  title: "PsyTest",
  description: "PsyTest - тестування на психічні характеристики",
};

export default function RootLayout({children}: Readonly<{children: ReactNode}>) {
    return (
        <html lang={"uk"} style={{ height: "100%" }}>
            <AppRouterCacheProvider>
                <AppTheme>
                    <CssBaseline enableColorScheme />
                    <Box component={"body"} sx={{ height: "100%" }}>
                        {children}
                    </Box>
                </AppTheme>
            </AppRouterCacheProvider>
        </html>
    );
}
