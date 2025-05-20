import {ReactNode} from "react";
import {Box, Typography} from "@mui/material";

export default function TestsLayoutBox({title, children}: {title: string, children: ReactNode}) {
    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
            <Typography variant="h5" fontWeight={600} sx={{marginLeft: 2}}>{title}</Typography>
            {children}
        </Box>
    )
}