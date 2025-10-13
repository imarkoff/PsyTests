import {createContext} from "react";
import {ActionDialogContextProps} from "../types";

const ActionDialogContext = createContext<
    ActionDialogContextProps | undefined
>(
    undefined
);

export default ActionDialogContext;