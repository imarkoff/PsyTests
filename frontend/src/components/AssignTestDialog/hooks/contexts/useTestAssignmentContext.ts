import {useContext} from "react";
import TestAssignmentContext from "@/components/AssignTestDialog/contexts/test-assignment/TestAssignmentContext";
import {OutOfReactContextError} from "@/errors";

export default function useTestAssignmentContext() {
    const context = useContext(TestAssignmentContext);

    if (!context) {
        throw new OutOfReactContextError("TestAssignmentContext has been used out of context");
    }

    return context;
}