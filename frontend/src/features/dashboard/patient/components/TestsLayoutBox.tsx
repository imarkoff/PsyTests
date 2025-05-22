import {ReactNode} from "react";
import {Box, Typography} from "@mui/material";
import { ApiResponse } from "@/lib/api-client/types";

export default function TestsLayoutBox({title, children}: {title: string, children: ReactNode}) {
    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
            <Typography variant="h5" fontWeight={600} sx={{marginLeft: 2}}>{title}</Typography>
            {children}
        </Box>
    )
}

export const TestsLayoutError = (
    {friendlyMessage, error}: {friendlyMessage: string, error: ApiResponse<unknown>["error"]}
) => (
    <Typography color={"error"} variant="h6" sx={{mx: 2}}>
        {friendlyMessage}
        <br />
        {error?.statusText}
    </Typography>
)