import {Box, CircularProgress} from "@mui/material";

export default function CenteredSpinner() {
    return (
        <Box sx={{
            height: "100%",
            width: "100%",
            flexGrow: 1,
            display: "grid",
            placeItems: "center"
        }}>
            <CircularProgress />
        </Box>
    );
}