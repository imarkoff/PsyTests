"use client";

import {PsyTestComponentProps} from "@/features/shared/psy-test-viewer/types";
import usePsyTestContext from "@/features/shared/psy-test-viewer/hooks/usePsyTestContext";
import {Skeleton} from "@mui/material";

export default function PsyTestHeaderDetails(
    {disabled} : PsyTestComponentProps
) {
    const {
        test, userRole,
        layouts: { header: Header }
    } = usePsyTestContext();

    return (!!test && !!Header) ? (
        <Header test={test} role={userRole} disabled={disabled} />
    ) : (
        <Skeleton width={250} variant={"text"} sx={{ fontSize: "1.25rem" }} />
    );
}