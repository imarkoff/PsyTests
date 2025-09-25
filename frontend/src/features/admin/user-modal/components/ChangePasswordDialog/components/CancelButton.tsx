import {Button} from "@mui/material";

interface CancelButtonProps {
    onClose: () => void;
    isMutating: boolean;
}

export default function CancelButton(
    {onClose, isMutating}: CancelButtonProps
) {
    return (
        <Button
            onClick={onClose}
            disabled={isMutating}
            fullWidth
        >
            Відмінити
        </Button>
    );
}