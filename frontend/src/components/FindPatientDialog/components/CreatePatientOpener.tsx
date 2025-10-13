import {Box, Button, Typography} from "@mui/material";

export default function CreatePatientOpener({handleOpen}: {handleOpen: () => void}) {
    return (
        <Box sx={{
            position: "sticky", top: 0, ml: "auto",
            display: "flex", alignItems: "baseline", justifyContent: "flex-end",
            backgroundColor: "background.paper", borderRadius: 0.5,
            border: "1px solid", borderColor: "divider",
            p: 0.5, zIndex: 1
        }}>
            <Typography variant={"body1"} color={"textSecondary"} fontWeight={500} sx={{mx: 1}}>
                Не знайшли пацієнта?
            </Typography>
            <Button color={"primary"} onClick={handleOpen}>
                Створити нового
            </Button>
        </Box>
    );
}