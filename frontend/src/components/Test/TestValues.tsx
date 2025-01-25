import {Typography} from "@mui/material";
import {ReactNode} from "react";

export default function TestValues(
    {title, children}: {title: string | ReactNode, children: string | ReactNode}
) {
    return (
        <Typography sx={{color: 'text.secondary'}}>
            <strong>{title}:</strong> {children}
        </Typography>
    );
}