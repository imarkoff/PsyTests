import {ReactNode} from "react";
import {Box, Typography} from "@mui/material";

interface PatientSectionProps {
    title: string;
    children: ReactNode;
    colSize?: number;
}

/**
 * Component for displaying a section of patient information
 * @param title
 * @param children
 * @param colSize - column size for grid layout
 * @constructor
 */
export default function PatientSection({title, children, colSize=450}: PatientSectionProps) {
    return (
        <Box sx={{
            minHeight: 200,
            display: "grid",
            gridTemplateRows: "auto 1fr",
            gridTemplateColumns: {sm: `repeat(auto-fill, minmax(${colSize}px, 1fr))`},
            justifyContent: {xs: "center", sm: "start"},
            gap: 1
        }}>
            <Typography
                variant={"h5"}
                sx={{
                    mb: 1,
                    textAlign: {xs: "center", md: "left"},
                    gridColumn: "1 / -1"
                }}
                fontWeight={600}
            >
                {title}
            </Typography>
            {children}
        </Box>
    );
}