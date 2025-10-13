import {Button, ButtonProps} from "@mui/material";

interface ActionDialogButtonProps extends ButtonProps {
    /** @default - true */
    fullWidth?: boolean;
}

export default function ActionDialogButton(
    {fullWidth = true, ...props}: ActionDialogButtonProps
) {
    return (
        <Button
            fullWidth={fullWidth}
            {...props}
        />
    );
}