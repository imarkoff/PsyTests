"use client";

import {Skeleton, Typography} from "@mui/material";
import usePsyTestContext from "@/features/shared/psy-test-viewer/hooks/usePsyTestContext";

export default function PsyTestTitle() {
    const {test, isLoading} = usePsyTestContext();

    return (
        <>
            <Typography variant={"h5"}>{test?.name}</Typography>
            <Typography>{test?.description}</Typography>
            {isLoading && (
                <Skeleton width={"100%"} variant={"text"} sx={{fontSize: "1.25rem"}}/>
            )}
        </>
    );
}