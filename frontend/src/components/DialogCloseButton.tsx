import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {IconButtonProps, Tooltip} from "@mui/material";

interface DialogCloseButtonProps extends IconButtonProps {
    onClose: () => void;
    gutterRight?: boolean;
}

export default function DialogCloseButton(
    {gutterRight = true, ...iconButtonProps}: DialogCloseButtonProps
) {
    return (
        <Tooltip title="Закрити вікно">
            <IconButton
                {...iconButtonProps}
                sx={{
                    marginLeft: "auto",
                    marginRight: gutterRight ? -1.5 : 0,
                    color: "text.secondary",
                    ...iconButtonProps?.sx
                }}
            >
                <CloseIcon />
            </IconButton>
        </Tooltip>
    );
}