import type { Metadata } from "next";
import "./assets/globals.css";
import AppTheme from "@/theme/AppTheme";
import {ReactNode} from "react";
import {CssBaseline} from "@mui/material";

export const metadata: Metadata = {
  title: "PsyTest",
  description: "PsyTest - тестування на психічні характеристики",
};

export default function RootLayout({children}: Readonly<{children: ReactNode}>) {
    return (
        <html lang="en" className={"h-full"}>
            <AppTheme>
                <CssBaseline />
                <body className={`h-full`}>
                    {children}
                </body>
            </AppTheme>
        </html>
    );
}
