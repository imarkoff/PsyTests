import {createContext} from "react";
import {PsyTestContextType} from "@/features/shared/psy-test-viewer/types";

const PsyTestContext = createContext<
    PsyTestContextType | undefined
>(
    undefined
);

export default PsyTestContext;