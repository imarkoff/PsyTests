import {Dialog, DialogProps, styled} from "@mui/material";
import ActionDialogProvider from "@/components/ActionDialog/contexts/ActionDialogProvider";

type ActionDialogRootProps = DialogProps & {
    onClose: () => void;
};

export default function ActionDialogRoot(props: ActionDialogRootProps) {
    return (
        <ActionDialogProvider
            isOpen={props.open}
            onClose={props.onClose}
        >
            <StyledDialog {...props} />
        </ActionDialogProvider>
    );
}

const StyledDialog = styled(Dialog)(() => ({
    "& .MuiDialog-paper": {
        maxWidth: "400px",
        width: "100%",
    }
}));