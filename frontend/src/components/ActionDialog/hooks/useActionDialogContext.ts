import {useContext} from "react";
import ActionDialogContext from "../contexts/ActionDialogContext";
import {OutOfReactContextError} from "@/errors";

export default function useActionDialogContext() {
    const context = useContext(ActionDialogContext);

    if (!context) {
        throw new OutOfReactContextError(
            "useActionDialogContext has been called out of ActionDialogContext"
        );
    }

    return context;
}