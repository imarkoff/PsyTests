import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {IconButtonProps, Tooltip} from "@mui/material";

interface DialogCloseButtonProps extends IconButtonProps {
    onClose: () => void;
}

export default function DialogCloseButton(
    iconButtonProps: DialogCloseButtonProps
) {
    return (
        <Tooltip title="Закрити вікно">
            <IconButton
                {...iconButtonProps}
                sx={{
                    marginLeft: "auto",
                    marginRight: -1.5,
                    color: "text.secondary",
                    ...iconButtonProps?.sx
                }}
            >
                <CloseIcon />
            </IconButton>
        </Tooltip>
    );
}