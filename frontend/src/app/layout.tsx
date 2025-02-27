import type { Metadata } from "next";
import "./assets/globals.css";
import AppTheme from "@/theme/AppTheme";
import {ReactNode} from "react";
import {CssBaseline} from "@mui/material";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


export const metadata: Metadata = {
  title: "PsyTest",
  description: "PsyTest - тестування на психічні характеристики",
};

export default function RootLayout({children}: Readonly<{children: ReactNode}>) {
    return (
        <html lang="en" className={"h-full"}>
            <AppTheme>
                <CssBaseline enableColorScheme />
                <body className={`h-full`}>
                    {children}
                </body>
            </AppTheme>
        </html>
    );
}
