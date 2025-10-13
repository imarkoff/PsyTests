import { DialogActions } from "@mui/material";
import ActionDialogRoot from "./components/ActionDialogRoot";
import ActionDialogHeader from "./components/ActionDialogHeader";
import ActionDialogContent from "./components/ActionDialogContent";
import ActionDialogButton from "./components/ActionDialogButton";

const ActionDialog = {
    Root: ActionDialogRoot,
    Header: ActionDialogHeader,
    Content: ActionDialogContent,
    Actions: DialogActions,
    Button: ActionDialogButton
};

export default ActionDialog;