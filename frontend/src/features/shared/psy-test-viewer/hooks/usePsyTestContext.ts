import {useContext} from "react";
import PsyTestContext from "../contexts/PsyTestContext";
import {OutOfReactContextError} from "@/errors";
import {PsyTestContextType} from "@/features/shared/psy-test-viewer/types";

export default function usePsyTestContext(): PsyTestContextType {
    const context = useContext(PsyTestContext);

    if (!context) {
        throw new OutOfReactContextError(
            "usePsyTestContext has been called out of PsyTestContext",
        );
    }

    return context;
}