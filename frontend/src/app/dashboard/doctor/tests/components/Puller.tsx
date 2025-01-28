import {Box} from "@mui/material";
import {grey} from "@mui/material/colors";

export default function Puller() {
    return (
        <Box sx={{
            position: "absolute",
            right: 0, left: 0,
            cursor: "grab",
            height: 30,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Box sx={(theme) => ({
                width: 30,
                height: 6,
                backgroundColor: "rgba(0, 0, 0, 0.25)",
                backdropFilter: "blur(2px)",
                borderRadius: 3,
                marginX: "auto",
                ...theme.applyStyles('dark', {
                    backgroundColor: grey[600],
                }),
            })} />
        </Box>
    );
}