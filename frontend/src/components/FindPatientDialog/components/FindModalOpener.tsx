import SearchIcon from "@mui/icons-material/Search";
import {Chip, Typography} from "@mui/material";

export default function FindModalOpener({handleOpen}: {handleOpen: () => void}) {
    return (
        <Chip
            icon={<SearchIcon />}
            label={
                <Typography variant={"body1"} color={"textSecondary"}>
                    Знайти пацієнта...
                </Typography>
            }
            color={"primary"}
            variant={"outlined"}
            sx={{
                py: 2.5, px: 1,
                borderRadius: 0.75,
                gap: 1,
                borderColor: "divider"
            }}
            onClick={handleOpen}
        />
    );
}