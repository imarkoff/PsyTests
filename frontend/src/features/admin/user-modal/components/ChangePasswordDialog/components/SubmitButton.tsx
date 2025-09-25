import {Button} from "@mui/material";

interface SubmitButtonProps {
    onSubmit: () => void;
    isPasswordEmpty: boolean;
    isMutating: boolean;
}

export default function SubmitButton(
    {onSubmit, isPasswordEmpty, isMutating}: SubmitButtonProps
) {
    return (
        <Button
            variant={"contained"}
            onClick={onSubmit}
            disabled={isPasswordEmpty}
            loading={isMutating}
            fullWidth
        >
            Зберегти
        </Button>
    );
}