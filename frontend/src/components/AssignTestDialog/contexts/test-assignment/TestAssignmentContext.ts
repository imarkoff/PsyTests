import {createContext} from "react";
import {UseTestAssignmentReturn} from "../../hooks/useTestAssignment";

const TestAssignmentContext = createContext<
    UseTestAssignmentReturn | undefined
>(
    undefined
);

export default TestAssignmentContext;