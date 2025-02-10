import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function DialogCloseButton({onClose}: {onClose: () => void}) {
    return (
        <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
                marginLeft: "auto",
                marginRight: -1.5,
                color: "text.secondary"
            }}
            title={"Закрити"}
        >
            <CloseIcon />
        </IconButton>
    );
}