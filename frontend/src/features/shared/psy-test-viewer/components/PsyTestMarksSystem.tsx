"use client";

import {PsyTestComponentProps} from "@/features/shared/psy-test-viewer/types";
import usePsyTestContext from "@/features/shared/psy-test-viewer/hooks/usePsyTestContext";

export default function PsyTestMarksSystem(
    {disabled} : PsyTestComponentProps
) {
    const {
        test, userRole,
        layouts: { marks: Marks }
    } = usePsyTestContext();

    if (!test) return null;

    return Marks ? (
        <Marks test={test} role={userRole} disabled={disabled} />
    ) : null;
}