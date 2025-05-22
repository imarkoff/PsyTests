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
            display: "flex",
            flexDirection: "column",
            gap: 2
        }}>
            <Typography
                variant={"h5"}
                sx={{ textAlign: {xs: "center", md: "left"} }}
                fontWeight={600}
            >
                {title}
            </Typography>
            <Box sx={{
                minHeight: 200,
                position: "relative",
                display: "grid",
                gridTemplateRows: "auto 1fr",
                gridTemplateColumns: {sm: `repeat(auto-fill, minmax(${colSize}px, 1fr))`},
                gap: 1,
            }}>
                {children}
            </Box>
        </Box>
    );
}

export const PatientSectionNoEntities = ({title}: { title: string }) => (
    <Typography sx={{
        position: "absolute",
        left: "25px",
        alignSelf: "center",
        width: "fit-content",
        color: "text.secondary"
    }}>
        {title}
    </Typography>
);