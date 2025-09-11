import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {Tooltip} from "@mui/material";

export default function DialogCloseButton({onClose}: {onClose: () => void}) {
    return (
        <Tooltip title="Закрити вікно">
            <IconButton
                onClick={onClose}
                sx={{
                    marginLeft: "auto",
                    marginRight: -1.5,
                    color: "text.secondary"
                }}
            >
                <CloseIcon />
            </IconButton>
        </Tooltip>

    );
}